# DevQuiz

DevQuiz is a full‑stack quiz platform for developers to test and grow their skills across web fundamentals, programming, and software practices. It delivers a modern, animated learning experience on the frontend and is designed to support persistent user accounts and results on the backend.

## What The Website Does

DevQuiz lets users:
1. Register or log in.
2. Browse quiz categories and topics.
3. Take timed‑style multiple‑choice quizzes with instant feedback.
4. View their results after each quiz.
5. Access an admin dashboard for high‑level insights (mocked in the UI).

The current frontend runs against local mock data for quizzes, while the backend provides the foundations for authentication and data persistence.

## Core Pages

1. Home: Marketing‑style landing page introducing DevQuiz.
2. Login / Register: User onboarding flow.
3. Dashboard: Category selection and overview.
4. Category Page: Topic selection inside a category.
5. Quiz Page: Interactive quiz flow.
6. Result Page: Score summary and replay option.
7. Profile: Basic user profile and stats.
8. Admin Dashboard: Mock administrative overview.

## Feature Highlights

1. Clean, modern UI with animations and gradients.
2. Theme toggle (light/dark).
3. Category‑based quiz navigation.
4. Question progression with progress indicator.
5. Score calculation and results summary.

## Tech Stack

Frontend:
1. React (Vite)
2. React Router
3. Tailwind CSS

Backend:
1. Node.js
2. Express
3. MongoDB (Mongoose)
4. JWT Authentication

## Project Structure

Frontend: `frontend/`
Backend: `Backend/`

The frontend uses mock quiz data in `frontend/src/data/mockQuizData.js`.
The backend currently contains authentication setup and placeholders for quiz and result APIs.

## Current Status

The UI is fully functional with mock data and local session handling.
The backend is a work in progress and is ready to be extended to:
1. Support real user login.
2. Store quiz results.
3. Serve quizzes dynamically.

## Running The Project

Frontend:
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Backend:
1. `cd Backend`
2. `npm install`
3. `npm run dev`

You will need a `.env` file in `Backend/` with at least:
1. `DATABASE_URL=...`
2. `SUPABASE_URL=...`
3. `SUPABASE_SERVICE_ROLE_KEY=...`
4. `JWT_SECRET=...`

## Environment Setup Examples

Create `Backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/devquiz
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=replace_with_a_long_random_string
PORT=5000
CORS_ORIGINS=http://localhost:5173
```

Optional frontend environment values (if you later wire API calls):

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## API Documentation (Current + Planned)

Base URL (local): `http://localhost:5000`

Current:
1. `POST /api/auth/register`
   Purpose: Register a new user.
   Body:
   - `username` (string, required)
   - `password` (string, required)
   Responses:
   - `201` Created: `{ message, userId }`
   - `400` Bad Request: `{ message }`
   - `409` Conflict: `{ message }`
   - `500` Server Error: `{ message }`

Planned:
1. `POST /api/auth/login`
   Purpose: Authenticate a user and return a JWT.
   Body:
   - `username` or `email`
   - `password`
   Response:
   - `{ token, user }`

2. `GET /api/questions`
   Purpose: List categories, topics, and questions.

3. `GET /api/questions/:categoryId/:topicId`
   Purpose: Get questions for a specific topic.

4. `POST /api/results`
   Purpose: Store a user quiz result.
   Auth: Bearer token required.

5. `GET /api/results/me`
   Purpose: Retrieve results for the current user.
   Auth: Bearer token required.

## Contributor Guidelines

1. Keep code style consistent with existing patterns (React functional components, hooks, and Tailwind).
2. Do not commit real secrets. Use `.env` files locally and keep `JWT_SECRET` long and random.
3. Add or update README notes when you introduce new routes or features.
4. Prefer descriptive component names and keep pages in `frontend/src/pages`.
5. Avoid adding unused components. If you add one, wire it into the UI or remove it.

## Supabase / PostgreSQL Migration Notes

This project is moving from MongoDB to PostgreSQL (Supabase). Below are the changes required, a migration path, and local setup instructions.

### Codebase Changes Required

Backend:
1. Replace Mongoose models with SQL queries (e.g., via `pg` or Supabase client).
2. Remove MongoDB connection (`Backend/config/database.js`) and update server startup to connect to Postgres/Supabase.
3. Update controllers:
   - Auth: store `password_hash` in `users`, validate with bcrypt, issue JWT as before.
   - Questions: query `questions` table with `category_id` and `topic_id`.
   - Results: insert into `results` and select by `user_id`.
4. Replace seed scripts:
   - `seed-questions.js` → SQL inserts or a Node script using Postgres client.
   - `seed-admin.js` → insert into `users` with `is_admin = true`.
5. Update environment variables:
   - Replace `MONGO_URI` with `DATABASE_URL` (or Supabase URL + service role key).

Frontend:
1. No major changes required if API routes remain the same.
2. If using Supabase directly from the frontend, replace API calls with Supabase SDK calls.

### Suggested Schema (SQL)

See `database/migrations/001_init.sql` for full DDL including tables and relationships.

### RLS Policies (Recommended)

These are included in `database/migrations/001_init.sql`:
1. `users`: Only the authenticated user can read/insert/update their own profile.
2. `results`: Only the authenticated user can read/insert their own results.
3. `questions`, `categories`, `topics`: Public read access for all users.

If you want admin‑only writes to questions/categories/topics, add admin‑role checks in Supabase policies.

### Migration Path (MongoDB → PostgreSQL)

1. Export from MongoDB:
   - `users`, `questions`, `results` collections.
2. Transform:
   - Map `_id` to UUIDs (or store old IDs in a temporary column if needed).
   - Convert `categoryId` → `category_id`, `topicId` → `topic_id`.
   - Ensure `email` exists for all users (see migration guidance above).
3. Import into Postgres:
   - Load `categories` and `topics` first.
   - Load `users`, then `questions`, then `results`.
4. Verify:
   - Count totals match.
   - Run sample queries for a known user to confirm results.

### Local Setup Guide (Postgres + Seed Data)

1. Install PostgreSQL locally.
2. Create database:
   - `createdb devquiz`
3. Run migration:
   - `psql devquiz -f database/migrations/001_init.sql`
4. Seed categories/topics/questions:
   - Use a Node script (recommended) or SQL inserts.
   - You can adapt `Backend/scripts/seed-questions.js` to write into Postgres.
5. Configure environment:
   - `DATABASE_URL=postgresql://user:password@localhost:5432/devquiz`
6. Start backend:
   - Update backend to use Postgres client.
   - `npm run dev` in `Backend/`


## Roadmap Ideas

1. Connect frontend to backend for real data.
2. Add authentication login and role‑based access control.
3. Store quiz history per user.
4. Admin management for quizzes and questions.
5. Add leaderboards and performance analytics.

### Redundant / Potentially Unused Files

1. `frontend/src/data/mockQuizData.js`
   Status: Placeholder only (no active data).
   Recommendation: Keep for offline demos or remove if no longer needed.

2. `frontend/src/services/firebase.js`
   Status: Configured but not wired into the app yet.
   Recommendation: Keep (planned Firebase usage), but document intended scope.

3. `frontend/public/vite.svg`
   Status: Template asset, currently unused.
   Recommendation: Remove if you want a cleaner repo.

4. `frontend/src/assets/react.svg`
   Status: Template asset, currently unused.
   Recommendation: Remove if you want a cleaner repo.

### Additional Observations (Post‑Cleanup)

1. Results saving now exists, but has no success feedback or retry.
   Impact: Users may not know if their results were saved.
   Fix: Add a “Saved ✓” message and optional retry.

2. Login is email‑only and registration requires email.
   Impact: Existing users without email must be migrated.
   Fix: Follow the migration guidance below and consider frontend email validation.

3. `/api/questions/:categoryId/:topicId` lacks pagination.
   Impact: Large payloads for big topics.
   Fix: Add `page` and `limit` support to this endpoint as well.

4. Metadata source split between backend (existence) and frontend (display labels).
   Impact: Potential drift in naming/icons.
   Fix: Document as intentional (current approach) or move display metadata to backend.
   Status: Intentional for now — backend controls availability, frontend controls labels/icons.

---

If you want, I can also add environment setup examples, API documentation, or contributor guidelines.
