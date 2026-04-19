import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";
export * from "./models/chat";
import { users } from "./models/auth";

export const userProfiles = sqliteTable("user_profiles", {
  userId: text("user_id").primaryKey().references(() => users.id),
  nativeLanguage: text("native_language").default("English"),
  currentLevel: integer("current_level").default(1),
  totalXp: integer("total_xp").default(0),
  streakDays: integer("streak_days").default(0),
  lastActiveDate: text("last_active_date"),
  readingScore: real("reading_score").default(0),
  writingScore: real("writing_score").default(0),
  listeningScore: real("listening_score").default(0),
  speakingScore: real("speaking_score").default(0),
  lessonsCompleted: integer("lessons_completed").default(0),
  exercisesCompleted: integer("exercises_completed").default(0),
  accuracy: real("accuracy").default(0),
});

export const lessons = sqliteTable("lessons", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  level: integer("level").notNull().default(1),
  orderIndex: integer("order_index").notNull().default(0),
  category: text("category").notNull().default("general"),
  skillFocus: text("skill_focus").notNull().default("reading"),
  imageUrl: text("image_url"),
  xpReward: integer("xp_reward").default(50),
  isPublished: integer("is_published", { mode: 'boolean' }).default(true),
  actflLevel: text("actfl_level").default("Novice Low"),
  cefrLevel: text("cefr_level").default("A1"),
  objectives: text("objectives", { mode: 'json' }).$type<string[]>(),
  canDoStatements: text("can_do_statements", { mode: 'json' }).$type<string[]>(),
  prerequisites: text("prerequisites", { mode: 'json' }).$type<string[]>(),
  estimatedMinutes: integer("estimated_minutes").default(30),
});

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  lessonId: text("lesson_id").references(() => lessons.id).notNull(),
  type: text("type").notNull(),
  difficulty: integer("difficulty").notNull().default(1),
  question: text("question").notNull(),
  questionAr: text("question_ar"),
  context: text("context"),
  contextAr: text("context_ar"),
  hint: text("hint"),
  hintAr: text("hint_ar"),
  options: text("options", { mode: 'json' }),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  explanationAr: text("explanation_ar"),
  grammarNote: text("grammar_note"),
  grammarNoteAr: text("grammar_note_ar"),
  skillType: text("skill_type").notNull().default("reading"),
  xpReward: integer("xp_reward").default(10),
  orderIndex: integer("order_index").default(0),
});

export const userLessonProgress = sqliteTable("user_lesson_progress", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  lessonId: text("lesson_id").references(() => lessons.id).notNull(),
  completed: integer("completed", { mode: 'boolean' }).default(false),
  score: real("score").default(0),
  completedAt: integer("completed_at", { mode: 'timestamp' }),
});

export const userExerciseAttempts = sqliteTable("user_exercise_attempts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  exerciseId: text("exercise_id").references(() => exercises.id).notNull(),
  lessonId: text("lesson_id").references(() => lessons.id).notNull(),
  userAnswer: text("user_answer").notNull(),
  isCorrect: integer("is_correct", { mode: 'boolean' }).notNull(),
  xpEarned: integer("xp_earned").default(0),
  attemptedAt: integer("attempted_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const badges = sqliteTable("badges", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  icon: text("icon").notNull(),
  condition: text("condition").notNull(),
  threshold: integer("threshold").default(1),
  category: text("category").default("achievement"),
});

export const userBadges = sqliteTable("user_badges", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  badgeId: text("badge_id").references(() => badges.id).notNull(),
  earnedAt: integer("earned_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const reviewItems = sqliteTable("review_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  itemType: text("item_type").notNull(),
  itemText: text("item_text").notNull(),
  itemTextAr: text("item_text_ar").notNull(),
  meaning: text("meaning"),
  lessonId: text("lesson_id").references(() => lessons.id),
  nextReviewAt: integer("next_review_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  interval: integer("interval").default(1),
  easeFactor: real("ease_factor").default(2.5),
  repetitions: integer("repetitions").default(0),
  lastReviewedAt: integer("last_reviewed_at", { mode: 'timestamp' }),
});

export const culturalContent = sqliteTable("cultural_content", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: text("type").notNull(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  content: text("content").notNull(),
  contentAr: text("content_ar").notNull(),
  category: text("category").default("general"),
  level: integer("level").default(1),
  imageUrl: text("image_url"),
});

export const quranWords = sqliteTable("quran_words", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  wordAr: text("word_ar").notNull(),
  wordTransliteration: text("word_transliteration").notNull(),
  meaningEn: text("meaning_en").notNull(),
  meaningAr: text("meaning_ar").notNull(),
  wordType: text("word_type").notNull().default("noun"),
  frequency: integer("frequency").notNull(),
  rootLetters: text("root_letters"),
  exampleVerseAr: text("example_verse_ar"),
  exampleVerseEn: text("example_verse_en"),
  exampleSurah: text("example_surah"),
  exampleAyah: integer("example_ayah"),
  difficulty: integer("difficulty").default(1),
  category: text("category").default("general"),
});

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

export const lessonsRelations = relations(lessons, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one }) => ({
  lesson: one(lessons, { fields: [exercises.lessonId], references: [lessons.id] }),
}));

export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });
export const insertUserProfileSchema = createInsertSchema(userProfiles);
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true });
export const insertCulturalContentSchema = createInsertSchema(culturalContent).omit({ id: true });
export const insertUserExerciseAttemptSchema = createInsertSchema(userExerciseAttempts).omit({ id: true, attemptedAt: true });
export const insertReviewItemSchema = createInsertSchema(reviewItems).omit({ id: true });

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
export type CulturalContent = typeof culturalContent.$inferSelect;
export type InsertCulturalContent = z.infer<typeof insertCulturalContentSchema>;
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type UserExerciseAttempt = typeof userExerciseAttempts.$inferSelect;
export type ReviewItem = typeof reviewItems.$inferSelect;
export type InsertReviewItem = z.infer<typeof insertReviewItemSchema>;
export type QuranWord = typeof quranWords.$inferSelect;
export type InsertQuranWord = z.infer<typeof insertQuranWordSchema>;

export const insertQuranWordSchema = createInsertSchema(quranWords).omit({ id: true });
