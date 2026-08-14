# RF Quiz App - Project Log & Knowledge Base

## Project Overview
- **Name:** rf-quiz-app
- **Framework:** Next.js 14.2.35
- **Language:** JavaScript/React 18.3.1
- **Database:** PostgreSQL (via `pg` driver)
- **Deployment:** Vercel
- **Repository:** https://github.com/TapasDas1982/rf-quiz-app
- **Live URL:** https://vercel.com/tapashs-projects-7ee61f8d/rf-quiz-app

## Timeline

### 2026-07-29 - Project Initialization
- Initialized package.json with Next.js, React, and PostgreSQL dependencies
- Added Next.js config to ignore ESLint during builds
- Added .gitignore for Node.js and environment files
- Added .env.example with DATABASE_URL and ADMIN credentials template
- Set up PostgreSQL database connection and table setup (`lib/db.js`)

### 2026-07-29 - Core Features Added
- Added quiz app with pages, API routes, and 50 questions (`a93aff1`)
- Added answer key for quiz questions (`lib/answerKey.js`, `8772df2`)
- Added mailer functionality for quiz results (`f4b2b1e`)

### 2026-07-29 - Admin Dashboard
- Replaced result emails with password-protected admin dashboard (`ae659f6`)
- Added middleware for basic auth protection on `/admin` routes (`middleware.js`)
- Added Correct/Wrong columns to admin dashboard (`5043479`)
- Added per-question answer breakdown for each participant (`d04e498`)

### 2026-08-14 - Randomized Balanced Question Bank (200+ questions)
- **Expanded question bank** from 50 to **200 questions** (`lib/questions.js`)
- Each question now tagged with `id`, `difficulty` (easy/tough), `category` (nutrition/lifestyle/mindset/medical/programs)
- **Difficulty split:** 60 easy (30%) + 140 tough (70%)
- **Per quiz:** 50 questions randomly selected = 15 easy + 35 tough, balanced across all 5 categories (~10 per category)
- Every participant gets a **different random set** of questions
- New `lib/quizSelector.js` - balanced random selection logic
- New `GET /api/quiz` route - serves the random question set (client-safe, no answers)
- `lib/answerKey.js` changed from positional array to **ID-keyed map**
- `app/api/submit/route.js` grades by question ID and stores which questions were used
- `lib/db.js` added `question_ids TEXT[]` column to `participants`
- `app/page.js` fetches the random quiz from `/api/quiz` before starting
- `app/admin/[id]/page.js` shows per-question breakdown using stored `question_ids`
- Verified: build passes, all 200 questions have valid answer keys, selector produces correct 15/35 split with all categories present

## Architecture

### Key Files
| File | Purpose |
|------|---------|
| `lib/db.js` | PostgreSQL connection pool and table setup |
| `lib/questions.js` | Quiz question bank (200 questions with difficulty & category) |
| `lib/answerKey.js` | Answer key for grading (ID-keyed, server-only) |
| `lib/quizSelector.js` | Balanced random selection of 50 questions per quiz |
| `middleware.js` | Basic auth for `/admin` routes |
| `next.config.js` | Next.js config (ESLint ignored in builds) |

### Question Bank Structure
- **200 questions** total
- **Categories (5):** `nutrition` (40), `lifestyle` (40), `mindset` (40), `medical` (43), `programs` (37)
- **Difficulty:** easy 60 (30%) / tough 140 (70%)
- **Per quiz:** 50 questions (15 easy / 35 tough), ~10 per category, randomized per attempt

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string (Neon/Supabase/Railway)
- `ADMIN_USERNAME` - Admin dashboard username
- `ADMIN_PASSWORD` - Admin dashboard password

### API Routes
- `GET /api/quiz` - Returns 50 random balanced questions (id, q, options)
- `POST /api/submit` - Grades answers by question ID, saves participant + question_ids
- `GET /api/leaderboard` - Top 10 by score/time
- `/admin` - Password-protected submissions dashboard (Basic auth via middleware)
- `/admin/[id]` - Per-question answer breakdown for a participant

## Deployment History

| Date | Platform | URL | Notes |
|------|----------|-----|-------|
| 2026-07-29+ | Vercel | https://vercel.com/tapashs-projects-7ee61f8d/rf-quiz-app | Deployed from GitHub repo |

## Future Updates Log

*Add new entries below as changes are made*

---
*Last updated: 2026-08-14 (randomized 200+ question bank shipped)*