# DevQuiz

DevQuiz is a full‑stack quiz platform for developers to test and grow their skills across web fundamentals, programming, and software practices. It delivers a modern, animated learning experience on the frontend and uses Supabase (PostgreSQL) for data and authentication.

## What The Website Does

DevQuiz lets users:
1. Register or log in.
2. Browse quiz categories and topics.
3. Take multiple‑choice quizzes with instant feedback.
4. View results after each quiz.
5. Access an admin dashboard to manage categories, topics, and questions.

## Core Pages

1. Home: Marketing‑style landing page introducing DevQuiz.
2. Login / Register: User onboarding flow via Supabase Auth.
3. Dashboard: Category selection and overview.
4. Category Page: Topic selection inside a category.
5. Quiz Page: Interactive quiz flow.
6. Result Page: Score summary and replay option.
7. Profile: User stats and recent activity (from Supabase results).
8. Admin Dashboard: Create and manage categories, topics, and questions.

## Feature Highlights

1. Modern UI with gradients and glassmorphism.
2. Theme toggle (light/dark).
3. Category‑based quiz navigation.
4. Progress indicator and score summary.
5. Admin panel for content management.

## Tech Stack

Frontend:
1. React (Vite)
2. React Router
3. Tailwind CSS
4. Supabase JS client

Backend:
1. Node.js
2. Express (minimal health server)
3. Supabase (PostgreSQL + Auth)

## Project Structure

Frontend: `frontend/`
Backend: `Backend/`
Database migrations: `database/migrations/`
Seed data: `database/seed/`

The frontend reads questions and metadata directly from Supabase using `@supabase/supabase-js`.
The backend is minimal and optional, primarily for seeding and health checks.

## Current Status

The UI is fully functional with Supabase Auth and database reads/writes.
The backend is minimal and optional.

## Running The Project

Frontend:
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Backend (optional):
1. `cd Backend`
2. `npm install`
3. `npm run dev`

## Environment Setup Examples

Create `Backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://user:password@localhost:5432/devquiz
JWT_SECRET=replace_with_a_long_random_string
PORT=5000
CORS_ORIGINS=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Database Migration (Supabase/Postgres)

Run:
1. `database/migrations/001_init.sql`
2. `database/migrations/002_init.sql` (composite key fix for topics)

These create tables, relationships, RLS policies, and the `question_counts` view.

### RLS Policies (Recommended)

Included in `001_init.sql`:
1. `users`: Only the authenticated user can read/insert/update their own profile.
2. `results`: Only the authenticated user can read/insert their own results.
3. `questions`, `categories`, `topics`: Public read access for all users.
4. Admin‑only write access for categories/topics/questions.

## Seeding Data

Seed categories/topics/questions to Supabase:

```bash
cd Backend
npm run seed:supabase
```

Seed only metadata:

```bash
npm run seed:supabase -- meta
```

Seed only questions:

```bash
npm run seed:supabase -- questions
```

Seed files:
1. `database/seed/categories.json`
2. `database/seed/topics.json`
3. `database/seed/questions.json`

## Migration Guidance (Existing Users Without Email)

If you already have users in the database created before email was required, you need to add an email for them:

1. One‑time migration script: assign placeholder emails (dev only).
2. Manual update in Supabase.
3. Re‑register users in development.

Important: `email` is required and unique.

## Redundant / Potentially Unused Files

1. `frontend/src/data/mockQuizData.js`
   Status: Placeholder only (no active data).
   Recommendation: Keep for offline demos or remove if no longer needed.

## Roadmap Ideas

1. Admin workflows for bulk import and moderation.
2. Advanced analytics and leaderboards.
3. Badges, streaks, and achievements.
4. Team challenges and competitive modes.
5. Leaderboards by category/topic with time filters.
6. Streaks and badges tied to results.
7. Question reporting and moderation queue.
8. Admin analytics dashboard (daily active users, completion rate).

## Full Codebase Review (Latest)

### Strengths
1. Supabase‑first architecture is consistent across auth, reads, and writes.
2. Admin panel now supports CRUD for categories, topics, and questions.
3. RLS policies are present and aligned with client usage.
4. Seed pipelines are structured and reproducible.

### Bugs / Risks / Gaps
1. `httpError.js` and JWT dependency were unused in the minimal backend.
   Status: Removed.
   Where: `Backend/utils/httpError.js`, `Backend/package.json`
   Fix: Completed.

2. `seed-admin.js` uses Supabase Admin API now.
   Status: Converted to Supabase.
   Where: `Backend/scripts/seed-admin.js`
   Fix: Completed.

3. `quizMetaData.js` is display‑only and not enforced by DB.
   Impact: Naming/icon drift possible.
   Where: `frontend/src/data/quizMetaData.js`
   Fix: Keep documented as intentional or move display metadata to DB.

## Recent Enhancements (Just Added)

1. Profile now shows best score and topic performance.
2. Results page includes correct vs incorrect breakdown.
3. Admin dashboard supports edit, search, filters, pagination, import/export, and delete confirmations with undo.
4. Admin dashboard adds correct‑answer selector, import validation with error reports, and bulk archive instead of hard delete.

4. Admin questions list now shows total results and supports filters.
   Status: Completed.
   Where: `frontend/src/pages/AdminDashboard.jsx`
   Fix: Completed.

5. Auth profile creation now includes a DB trigger and client verification.
   Status: Completed.
   Where: `database/migrations/001_init.sql`, `frontend/src/context/AuthContext.jsx`, `frontend/src/services/api.js`
   Fix: Completed.

### Pages That Need Completion / Polishing
1. Profile page: Add richer stats (best score, topic performance).
2. Result page: Add detailed breakdown (correct vs incorrect).
3. Admin dashboard: Add bulk import, export, and undo/confirm for deletes.

### Enhancement Ideas
1. Add “Create Quiz Set” feature to group questions by difficulty.
2. Add leaderboards by category/topic with time filters.
3. Add streaks and badges tied to results.
4. Add question reporting / moderation queue.
5. Add analytics dashboard for admin (daily active users, completion rate).

### Suggested Roadmap (Next 3 Milestones)
1. **Content Ops**
   - Bulk import UI for questions.
   - Category/topic analytics.
2. **User Progress**
   - Detailed profile stats.
   - Badges and streaks.
3. **Competitive Features**
   - Leaderboards.
   - Time‑boxed challenges.
