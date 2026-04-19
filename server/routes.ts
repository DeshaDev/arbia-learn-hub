import express from "express";
import type { Express as ExpressType, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { textToSpeech, speechToText, ensureCompatibleFormat, openai as audioOpenai } from "./replit_integrations/audio/client";
import { openai as imageOpenai } from "./replit_integrations/image/client";
import { reviewItems as reviewItemsTable } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

const GUEST_USER_ID = "guest-user";

function calculateSM2(repetitions: number, easeFactor: number, interval: number, quality: number) {
  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  let newInterval: number;
  let newReps: number;

  if (quality < 3) {
    newReps = 0;
    newInterval = 1;
  } else {
    newReps = repetitions + 1;
    if (newReps === 1) {
      newInterval = 1;
    } else if (newReps === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEF);
    }
  }

  return { repetitions: newReps, easeFactor: newEF, interval: newInterval };
}

function getUserId(req: any): string {
  return req.user?.claims?.sub || GUEST_USER_ID;
}

export async function registerRoutes(
  httpServer: Server,
  app: ExpressType
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get("/api/profile", async (req: any, res) => {
    try {
      const userId = getUserId(req);
      let profile = await storage.getProfile(userId);

      if (!profile) {
        profile = await storage.upsertProfile({
          userId,
          nativeLanguage: "English",
          currentLevel: 1,
          totalXp: 0,
          streakDays: 0,
          readingScore: 0,
          writingScore: 0,
          listeningScore: 0,
          speakingScore: 0,
          lessonsCompleted: 0,
          exercisesCompleted: 0,
          accuracy: 0,
        });
      }

      const today = new Date().toISOString().split("T")[0];
      if (profile.lastActiveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const newStreak = profile.lastActiveDate === yesterdayStr
          ? (profile.streakDays || 0) + 1
          : 1;

        profile = await storage.updateProfile(userId, {
          lastActiveDate: today,
          streakDays: newStreak,
        }) || profile;
      }

      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.get("/api/lessons", async (_req, res) => {
    try {
      const allLessons = await storage.getLessons();
      res.json(allLessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) return res.status(404).json({ message: "Lesson not found" });
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  app.get("/api/lessons/:id/exercises", async (req, res) => {
    try {
      const exerciseList = await storage.getExercisesByLesson(req.params.id);
      res.json(exerciseList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.get("/api/practice/adaptive", async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const exerciseList = await storage.getAdaptiveExercises(userId);
      res.json(exerciseList);
    } catch (error) {
      console.error("Error fetching adaptive exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.post("/api/practice/submit", async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const { exerciseId, answer } = req.body;

      if (!exerciseId || answer === undefined) {
        return res.status(400).json({ message: "exerciseId and answer are required" });
      }

      const exercise = await storage.getExercise(exerciseId);
      if (!exercise) return res.status(404).json({ message: "Exercise not found" });

      let isCorrect = false;
      if (exercise.type === "free_writing") {
        isCorrect = answer.trim().length >= 3;
      } else if (exercise.type === "sentence_order") {
        isCorrect = answer.trim() === exercise.correctAnswer;
      } else {
        isCorrect = answer.trim().toLowerCase() === exercise.correctAnswer.toLowerCase();
      }

      const xpEarned = isCorrect ? (exercise.xpReward || 10) : 0;

      await storage.createExerciseAttempt({
        userId,
        exerciseId,
        lessonId: exercise.lessonId,
        userAnswer: answer,
        isCorrect,
        xpEarned,
      });

      let profile = await storage.getProfile(userId);
      if (!profile) {
        profile = await storage.upsertProfile({ userId });
      }

      const newXp = (profile.totalXp || 0) + xpEarned;
      const newExercisesCompleted = (profile.exercisesCompleted || 0) + 1;

      const totalAttempts = newExercisesCompleted;
      const correctAttempts = isCorrect
        ? Math.round(((profile.accuracy || 0) / 100) * (totalAttempts - 1)) + 1
        : Math.round(((profile.accuracy || 0) / 100) * (totalAttempts - 1));
      const newAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

      const newLevel = Math.max(1, Math.floor(newXp / 200) + 1);

      const skillUpdates: Record<string, number> = {};
      const skillKey = `${exercise.skillType}Score` as keyof typeof profile;
      if (isCorrect && exercise.skillType) {
        const currentScore = (profile[skillKey] as number) || 0;
        const increment = exercise.type === "free_writing" ? 1.5 : (isCorrect ? 2 : 0);
        const newScore = Math.min(100, currentScore + increment);
        
        if (exercise.skillType === "reading") skillUpdates.readingScore = newScore;
        if (exercise.skillType === "writing") skillUpdates.writingScore = newScore;
        if (exercise.skillType === "listening") skillUpdates.listeningScore = newScore;
        if (exercise.skillType === "speaking") skillUpdates.speakingScore = newScore;
      }

      await storage.updateProfile(userId, {
        totalXp: newXp,
        currentLevel: newLevel,
        exercisesCompleted: newExercisesCompleted,
        accuracy: newAccuracy,
        ...skillUpdates,
      });

      await storage.checkAndAwardBadges(userId);

      res.json({ isCorrect, xpEarned, correctAnswer: exercise.correctAnswer });
    } catch (error) {
      console.error("Error submitting answer:", error);
      res.status(500).json({ message: "Failed to submit answer" });
    }
  });

  app.get("/api/user/progress", async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const progress = await storage.getUserLessonProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get("/api/badges", async (_req, res) => {
    try {
      const allBadges = await storage.getBadges();
      res.json(allBadges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  app.get("/api/user/badges", async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const userBadgeList = await storage.getUserBadges(userId);
      res.json(userBadgeList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user badges" });
    }
  });

  app.get("/api/cultural-content", async (_req, res) => {
    try {
      const content = await storage.getCulturalContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cultural content" });
    }
  });

  app.get("/api/quran-words", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const words = await storage.getQuranWords(category);
      res.json(words);
    } catch (error) {
      console.error("Error fetching Quran words:", error);
      res.status(500).json({ message: "Failed to fetch Quran words" });
    }
  });

  app.post("/api/lessons/:id/complete", async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const lessonId = req.params.id;
      const { score } = req.body;

      const lesson = await storage.getLesson(lessonId);
      if (!lesson) return res.status(404).json({ message: "Lesson not found" });

      await storage.upsertLessonProgress({
        userId,
        lessonId,
        completed: true,
        score: score || 100,
      });

      let profile = await storage.getProfile(userId);
      if (!profile) {
        profile = await storage.upsertProfile({ userId });
      }

      const newLessonsCompleted = (profile.lessonsCompleted || 0) + 1;
      const newXp = (profile.totalXp || 0) + (lesson.xpReward || 50);
      const newLevel = Math.max(1, Math.floor(newXp / 200) + 1);

      await storage.updateProfile(userId, {
        lessonsCompleted: newLessonsCompleted,
        totalXp: newXp,
        currentLevel: newLevel,
      });

      await storage.checkAndAwardBadges(userId);

      if (userId !== GUEST_USER_ID) {
        try {
          const exercises = await storage.getExercisesByLesson(lessonId);
          for (const ex of exercises) {
            if (ex.correctAnswer) {
              await storage.addReviewItem({
                userId,
                itemType: ex.type === "fill_blank" ? "vocabulary" : "phrase",
                itemText: ex.question,
                itemTextAr: ex.correctAnswer,
                meaning: null,
                lessonId: lessonId,
              });
            }
          }
        } catch (e) {
          console.error("Failed to seed review items:", e);
        }
      }

      res.json({ success: true, xpEarned: lesson.xpReward });
    } catch (error) {
      console.error("Error completing lesson:", error);
      res.status(500).json({ message: "Failed to complete lesson" });
    }
  });

  const ttsCache = new Map<string, Buffer>();

  app.post("/api/tts", async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string" || text.length > 500) {
        return res.status(400).json({ message: "Valid Arabic text required (max 500 chars)" });
      }

      const cacheKey = text.trim();
      let audioBuffer = ttsCache.get(cacheKey);

      if (!audioBuffer) {
        audioBuffer = await textToSpeech(
          text,
          "nova",
          "mp3"
        );
        if (ttsCache.size > 500) {
          const firstKey = ttsCache.keys().next().value;
          if (firstKey) ttsCache.delete(firstKey);
        }
        ttsCache.set(cacheKey, audioBuffer);
      }

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(audioBuffer);
    } catch (error) {
      console.error("TTS error:", error);
      res.status(500).json({ message: "Failed to generate audio" });
    }
  });

  const largeBodyParser = express.json({ limit: "10mb" });

  app.post("/api/ai/evaluate-handwriting", largeBodyParser, async (req: Request, res: Response) => {
    try {
      const { imageData, targetLetter, targetName } = req.body;
      if (!imageData || !targetLetter) {
        return res.status(400).json({ message: "imageData and targetLetter are required" });
      }

      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      if (base64Data.length > 500000) {
        return res.status(400).json({ message: "Image too large" });
      }

      const response = await imageOpenai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an Arabic calligraphy teacher evaluating a student's handwriting attempt. Be encouraging but specific. Evaluate how well the drawn letter matches the target Arabic letter. Consider: stroke direction (right to left), letter proportions, dots placement, curves and lines quality. Respond in JSON format: {"score": <0-100>, "feedback": "<encouraging feedback in English>", "feedbackAr": "<same feedback in Arabic>", "tips": ["<specific improvement tip 1>", "<tip 2>"]}`
          },
          {
            role: "user",
            content: [
              { type: "text", text: `The student tried to write the Arabic letter "${targetLetter}" (${targetName}). Please evaluate their handwriting attempt. Score from 0-100 and give specific feedback.` },
              { type: "image_url", image_url: { url: `data:image/png;base64,${base64Data}` } },
            ],
          },
        ],
        max_tokens: 300,
      });

      const content = response.choices[0]?.message?.content || "";
      let result;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        result = jsonMatch ? JSON.parse(jsonMatch[0]) : { score: 50, feedback: content, tips: [] };
      } catch {
        result = { score: 50, feedback: content, tips: [] };
      }

      res.json(result);
    } catch (error) {
      console.error("Handwriting evaluation error:", error);
      res.status(500).json({ message: "Failed to evaluate handwriting" });
    }
  });

  app.post("/api/ai/evaluate-pronunciation", largeBodyParser, async (req: Request, res: Response) => {
    try {
      const { audio, expectedText, expectedTransliteration } = req.body;
      if (!audio || !expectedText) {
        return res.status(400).json({ message: "audio and expectedText are required" });
      }

      const audioBuffer = Buffer.from(audio, "base64");
      if (audioBuffer.length > 2000000) {
        return res.status(400).json({ message: "Audio too large (max 2MB)" });
      }

      const { buffer: compatibleBuffer, format } = await ensureCompatibleFormat(audioBuffer);
      const transcript = await speechToText(compatibleBuffer, format);

      const evalResponse = await audioOpenai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an Arabic pronunciation teacher. Compare the student's spoken attempt with the expected text. Be encouraging. Consider that the transcription might not be perfect. Score based on similarity. Respond in JSON: {"score": <0-100>, "transcript": "<what was detected>", "feedback": "<encouraging feedback>", "feedbackAr": "<Arabic feedback>", "tips": ["<pronunciation tip 1>", "<tip 2>"]}`
          },
          {
            role: "user",
            content: `Expected Arabic text: "${expectedText}"${expectedTransliteration ? ` (${expectedTransliteration})` : ''}\nStudent's transcribed speech: "${transcript}"\nPlease evaluate the pronunciation attempt.`
          }
        ],
        max_tokens: 300,
      });

      const content = evalResponse.choices[0]?.message?.content || "";
      let result;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        result = jsonMatch ? JSON.parse(jsonMatch[0]) : { score: 50, transcript, feedback: content, tips: [] };
      } catch {
        result = { score: 50, transcript, feedback: content, tips: [] };
      }

      result.transcript = result.transcript || transcript;
      res.json(result);
    } catch (error) {
      console.error("Pronunciation evaluation error:", error);
      res.status(500).json({ message: "Failed to evaluate pronunciation" });
    }
  });

  app.get("/api/review/queue", async (req: any, res) => {
    try {
      if (!req.user?.claims?.sub) return res.status(401).json({ message: "Not authenticated" });
      const items = await storage.getReviewQueue(req.user.claims.sub);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch review queue" });
    }
  });

  app.post("/api/review/add", async (req: any, res) => {
    try {
      if (!req.user?.claims?.sub) return res.status(401).json({ message: "Not authenticated" });
      const { itemType, itemText, itemTextAr, meaning, lessonId } = req.body;
      if (!itemType || !itemText || !itemTextAr) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const item = await storage.addReviewItem({
        userId: req.user.claims.sub,
        itemType,
        itemText,
        itemTextAr,
        meaning: meaning || null,
        lessonId: lessonId || null,
      });
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to add review item" });
    }
  });

  app.post("/api/review/answer", async (req: any, res) => {
    try {
      if (!req.user?.claims?.sub) return res.status(401).json({ message: "Not authenticated" });
      const { itemId, quality } = req.body;
      if (!itemId || quality === undefined) {
        return res.status(400).json({ message: "Missing itemId or quality" });
      }

      const q = Math.max(0, Math.min(5, Number(quality)));

      const items = await storage.getReviewQueue(req.user.claims.sub);
      const item = items.find((i) => i.id === itemId);
      if (!item) {
        const allItems = await db.select().from(reviewItemsTable).where(eq(reviewItemsTable.id, itemId));
        if (allItems.length === 0) return res.status(404).json({ message: "Item not found" });
        const currentItem = allItems[0];
        const sm2 = calculateSM2(currentItem.repetitions || 0, currentItem.easeFactor || 2.5, currentItem.interval || 1, q);
        const nextReview = new Date(Date.now() + sm2.interval * 24 * 60 * 60 * 1000);
        const updated = await storage.updateReviewItem(itemId, {
          repetitions: sm2.repetitions,
          easeFactor: sm2.easeFactor,
          interval: sm2.interval,
          nextReviewAt: nextReview,
          lastReviewedAt: new Date(),
        });
        return res.json(updated);
      }

      const sm2 = calculateSM2(item.repetitions || 0, item.easeFactor || 2.5, item.interval || 1, q);
      const nextReview = new Date(Date.now() + sm2.interval * 24 * 60 * 60 * 1000);
      const updated = await storage.updateReviewItem(itemId, {
        repetitions: sm2.repetitions,
        easeFactor: sm2.easeFactor,
        interval: sm2.interval,
        nextReviewAt: nextReview,
        lastReviewedAt: new Date(),
      });
      res.json(updated);
    } catch (error) {
      console.error("Review answer error:", error);
      res.status(500).json({ message: "Failed to process review" });
    }
  });

  app.get("/api/leaderboard", async (_req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  return httpServer;
}
