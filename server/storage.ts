import {
  users,
  userProfiles,
  lessons,
  exercises,
  userLessonProgress,
  userExerciseAttempts,
  badges,
  userBadges,
  culturalContent,
  reviewItems,
  quranWords,
  type UserProfile,
  type InsertUserProfile,
  type Lesson,
  type InsertLesson,
  type Exercise,
  type InsertExercise,
  type UserLessonProgress,
  type UserExerciseAttempt,
  type Badge,
  type InsertBadge,
  type UserBadge,
  type CulturalContent,
  type InsertCulturalContent,
  type ReviewItem,
  type InsertReviewItem,
  type QuranWord,
  type InsertQuranWord,
} from "@shared/schema";
import type { User } from "@shared/models/auth";
import { db } from "./db";
import { eq, desc, asc, and, sql, lte } from "drizzle-orm";

export interface IStorage {
  getProfile(userId: string): Promise<UserProfile | undefined>;
  upsertProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile | undefined>;

  getLessons(): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  getExercisesByLesson(lessonId: string): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  getAdaptiveExercises(userId: string): Promise<Exercise[]>;

  getUserLessonProgress(userId: string): Promise<UserLessonProgress[]>;
  upsertLessonProgress(data: { userId: string; lessonId: string; completed: boolean; score: number }): Promise<void>;

  createExerciseAttempt(data: { userId: string; exerciseId: string; lessonId: string; userAnswer: string; isCorrect: boolean; xpEarned: number }): Promise<void>;

  getBadges(): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]>;
  awardBadge(userId: string, badgeId: string): Promise<void>;
  checkAndAwardBadges(userId: string): Promise<void>;

  getCulturalContent(): Promise<CulturalContent[]>;
  createCulturalContent(content: InsertCulturalContent): Promise<CulturalContent>;

  getQuranWords(category?: string): Promise<QuranWord[]>;
  getQuranWordsByCategory(category: string): Promise<QuranWord[]>;
  createQuranWord(word: InsertQuranWord): Promise<QuranWord>;

  getReviewQueue(userId: string): Promise<ReviewItem[]>;
  addReviewItem(item: InsertReviewItem): Promise<ReviewItem>;
  updateReviewItem(id: string, data: Partial<ReviewItem>): Promise<ReviewItem | undefined>;

  getLeaderboard(): Promise<{
    userId: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
    totalXp: number;
    currentLevel: number;
    streakDays: number;
  }[]>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile || undefined;
  }

  async upsertProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [result] = await db
      .insert(userProfiles)
      .values(profile)
      .onConflictDoUpdate({
        target: userProfiles.userId,
        set: profile,
      })
      .returning();
    return result;
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const [result] = await db
      .update(userProfiles)
      .set(data)
      .where(eq(userProfiles.userId, userId))
      .returning();
    return result;
  }

  async getLessons(): Promise<Lesson[]> {
    return db.select().from(lessons).where(eq(lessons.isPublished, true)).orderBy(asc(lessons.level), asc(lessons.orderIndex));
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson || undefined;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [result] = await db.insert(lessons).values(lesson).returning();
    return result;
  }

  async getExercisesByLesson(lessonId: string): Promise<Exercise[]> {
    return db.select().from(exercises).where(eq(exercises.lessonId, lessonId)).orderBy(asc(exercises.orderIndex));
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise || undefined;
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [result] = await db.insert(exercises).values(exercise).returning();
    return result;
  }

  async getAdaptiveExercises(userId: string): Promise<Exercise[]> {
    const profile = await this.getProfile(userId);
    const level = profile?.currentLevel || 1;

    const allExercises = await db
      .select()
      .from(exercises)
      .innerJoin(lessons, eq(exercises.lessonId, lessons.id))
      .where(eq(lessons.level, level))
      .orderBy(sql`RANDOM()`)
      .limit(8);

    if (allExercises.length === 0) {
      const fallback = await db
        .select()
        .from(exercises)
        .orderBy(sql`RANDOM()`)
        .limit(8);
      return fallback;
    }

    return allExercises.map((row) => row.exercises);
  }

  async getUserLessonProgress(userId: string): Promise<UserLessonProgress[]> {
    return db.select().from(userLessonProgress).where(eq(userLessonProgress.userId, userId));
  }

  async upsertLessonProgress(data: { userId: string; lessonId: string; completed: boolean; score: number }): Promise<void> {
    const existing = await db
      .select()
      .from(userLessonProgress)
      .where(and(eq(userLessonProgress.userId, data.userId), eq(userLessonProgress.lessonId, data.lessonId)));

    if (existing.length > 0) {
      await db
        .update(userLessonProgress)
        .set({ completed: data.completed, score: data.score, completedAt: data.completed ? new Date() : null })
        .where(eq(userLessonProgress.id, existing[0].id));
    } else {
      await db.insert(userLessonProgress).values({
        userId: data.userId,
        lessonId: data.lessonId,
        completed: data.completed,
        score: data.score,
        completedAt: data.completed ? new Date() : null,
      });
    }
  }

  async createExerciseAttempt(data: { userId: string; exerciseId: string; lessonId: string; userAnswer: string; isCorrect: boolean; xpEarned: number }): Promise<void> {
    await db.insert(userExerciseAttempts).values(data);
  }

  async getBadges(): Promise<Badge[]> {
    return db.select().from(badges);
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    const [result] = await db.insert(badges).values(badge).returning();
    return result;
  }

  async getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]> {
    const result = await db
      .select()
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId));

    return result.map((row) => ({
      ...row.user_badges,
      badge: row.badges,
    }));
  }

  async awardBadge(userId: string, badgeId: string): Promise<void> {
    const existing = await db
      .select()
      .from(userBadges)
      .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badgeId)));

    if (existing.length === 0) {
      await db.insert(userBadges).values({ userId, badgeId });
    }
  }

  async checkAndAwardBadges(userId: string): Promise<void> {
    const profile = await this.getProfile(userId);
    if (!profile) return;

    const allBadges = await this.getBadges();

    for (const badge of allBadges) {
      let shouldAward = false;

      switch (badge.condition) {
        case "first_lesson":
          shouldAward = (profile.lessonsCompleted || 0) >= (badge.threshold || 1);
          break;
        case "exercises_completed":
          shouldAward = (profile.exercisesCompleted || 0) >= (badge.threshold || 1);
          break;
        case "streak_days":
          shouldAward = (profile.streakDays || 0) >= (badge.threshold || 1);
          break;
        case "xp_total":
          shouldAward = (profile.totalXp || 0) >= (badge.threshold || 1);
          break;
        case "accuracy":
          shouldAward = (profile.accuracy || 0) >= (badge.threshold || 1);
          break;
        case "level_reached":
          shouldAward = (profile.currentLevel || 1) >= (badge.threshold || 1);
          break;
      }

      if (shouldAward) {
        await this.awardBadge(userId, badge.id);
      }
    }
  }

  async getCulturalContent(): Promise<CulturalContent[]> {
    return db.select().from(culturalContent).orderBy(asc(culturalContent.level));
  }

  async createCulturalContent(content: InsertCulturalContent): Promise<CulturalContent> {
    const [result] = await db.insert(culturalContent).values(content).returning();
    return result;
  }

  async getQuranWords(category?: string): Promise<QuranWord[]> {
    if (category && category !== "all") {
      return db.select().from(quranWords).where(eq(quranWords.category, category)).orderBy(desc(quranWords.frequency));
    }
    return db.select().from(quranWords).orderBy(desc(quranWords.frequency));
  }

  async getQuranWordsByCategory(category: string): Promise<QuranWord[]> {
    return db.select().from(quranWords).where(eq(quranWords.category, category)).orderBy(desc(quranWords.frequency));
  }

  async createQuranWord(word: InsertQuranWord): Promise<QuranWord> {
    const [result] = await db.insert(quranWords).values(word).returning();
    return result;
  }

  async getReviewQueue(userId: string): Promise<ReviewItem[]> {
    return db
      .select()
      .from(reviewItems)
      .where(
        and(
          eq(reviewItems.userId, userId),
          lte(reviewItems.nextReviewAt, new Date())
        )
      )
      .orderBy(asc(reviewItems.nextReviewAt))
      .limit(20);
  }

  async addReviewItem(item: InsertReviewItem): Promise<ReviewItem> {
    const existing = await db
      .select()
      .from(reviewItems)
      .where(
        and(
          eq(reviewItems.userId, item.userId),
          eq(reviewItems.itemTextAr, item.itemTextAr)
        )
      );
    if (existing.length > 0) return existing[0];
    const [result] = await db.insert(reviewItems).values(item).returning();
    return result;
  }

  async updateReviewItem(id: string, data: Partial<ReviewItem>): Promise<ReviewItem | undefined> {
    const [result] = await db
      .update(reviewItems)
      .set(data)
      .where(eq(reviewItems.id, id))
      .returning();
    return result;
  }

  async getLeaderboard() {
    const result = await db
      .select({
        userId: userProfiles.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        totalXp: userProfiles.totalXp,
        currentLevel: userProfiles.currentLevel,
        streakDays: userProfiles.streakDays,
      })
      .from(userProfiles)
      .innerJoin(users, eq(userProfiles.userId, users.id))
      .orderBy(desc(userProfiles.totalXp))
      .limit(50);

    return result.map((r) => ({
      userId: r.userId,
      firstName: r.firstName,
      lastName: r.lastName,
      profileImageUrl: r.profileImageUrl,
      totalXp: r.totalXp || 0,
      currentLevel: r.currentLevel || 1,
      streakDays: r.streakDays || 0,
    }));
  }
}

export const storage = new DatabaseStorage();
