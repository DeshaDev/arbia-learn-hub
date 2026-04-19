# Arabica - Arabic Language Learning Platform

## Overview
An innovative, comprehensive Arabic language learning platform for non-native speakers, featuring adaptive learning, gamification, cultural immersion, and diverse exercise types.

## Architecture
- **Frontend**: React + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Replit Auth (OpenID Connect)

## Key Features
- **Adaptive Learning**: Exercises adjust to user's level automatically
- **Exercise Types**: Multiple choice, fill-in-blank, sentence ordering, free writing
- **4 Language Skills**: Reading, writing, listening, speaking - tracked independently
- **Gamification**: XP points, level progression, day streaks, badges, leaderboard
- **Cultural Content**: Arabic proverbs, stories, traditions, life situations
- **Progress Dashboard**: Skills breakdown, learning recommendations, badge collection
- **OpenAI TTS**: High-quality Arabic pronunciation via /api/tts endpoint with server cache
- **AI Drawing Evaluation**: Canvas drawing tool with OpenAI Vision API handwriting assessment
- **AI Pronunciation Evaluation**: Microphone recording with OpenAI Whisper STT + AI feedback
- **Interactive Games**: Letter matching, listening challenge, root word builder, speed round
- **Visual Learning**: Scene headers, teacher tips, IPA pronunciation guides, writing guides
- **ACTFL/CEFR Alignment**: Each lesson has proficiency level, learning objectives, and can-do statements
- **Curriculum Roadmap**: Lessons page shows visual progression with level headers and roadmap timeline
- **Spaced Repetition (SRS)**: SM-2 algorithm for vocabulary review with flashcard-style queue on practice page
- **Tashkeel System**: All 28 letters have 4 tashkeel marks (Fatha, Damma, Kasra, Sukun) with audio playback

## Pages
- `/` - Landing page (unauthenticated) or Dashboard (authenticated)
- `/lessons` - Browse lessons by level
- `/lessons/:id` - Lesson detail with exercises, drawing canvas, mic recorder
- `/practice` - Adaptive practice session
- `/games` - Interactive educational games (letter match, listening, root builder, speed round)
- `/culture` - Arabic cultural content
- `/leaderboard` - Global XP leaderboard
- `/progress` - Detailed progress & badges

## API Routes
- `GET /api/profile` - Get/create user profile
- `GET /api/lessons` - List all lessons (includes objectives, canDoStatements, cefrLevel, actflLevel, prerequisites, estimatedMinutes)
- `GET /api/lessons/:id` - Get lesson details
- `GET /api/lessons/:id/exercises` - Get exercises for a lesson
- `GET /api/practice/adaptive` - Get adaptive exercise set
- `POST /api/practice/submit` - Submit exercise answer
- `POST /api/tts` - Text-to-speech for Arabic text (OpenAI gpt-audio)
- `POST /api/ai/evaluate-handwriting` - AI handwriting evaluation (OpenAI Vision)
- `POST /api/ai/evaluate-pronunciation` - AI pronunciation evaluation (OpenAI Whisper + GPT)
- `GET /api/user/progress` - Get lesson progress
- `GET /api/badges` - List all badges
- `GET /api/user/badges` - Get user's earned badges
- `GET /api/cultural-content` - Get cultural content
- `GET /api/leaderboard` - Get XP leaderboard
- `GET /api/review/queue` - Get spaced repetition review items due
- `POST /api/review/add` - Add item to SRS review queue
- `POST /api/review/answer` - Submit SRS review answer with quality rating (SM-2 algorithm)

## Database Tables
- `users` + `sessions` (Replit Auth)
- `user_profiles` - Extended user data (XP, level, streak, skills)
- `lessons` - Arabic lessons organized by level (with objectives, canDoStatements, cefrLevel, actflLevel, prerequisites, estimatedMinutes)
- `exercises` - Various exercise types per lesson
- `user_lesson_progress` - Track lesson completion
- `user_exercise_attempts` - Track exercise attempts
- `badges` - Achievement badges
- `user_badges` - User's earned badges
- `cultural_content` - Proverbs, stories, traditions
- `review_items` - Spaced repetition queue (SM-2: interval, easeFactor, repetitions, nextReviewAt)

## Design
- Arabic-themed warm gold and teal color palette
- Fonts: Plus Jakarta Sans (UI), Amiri (Arabic text), Playfair Display (headings)
- RTL support for Arabic text with `dir="rtl"` and Amiri font family
