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
1. `MONGO_URI=...`
2. `JWT_SECRET=...`

## Environment Setup Examples

Create `Backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/devquiz
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

## Migration Guidance (Existing Users Without Email)

If you already have users in the database created before email was required, you need to add an email for them. Options:

1. One‑time migration script:
   - Add a script that finds users missing `email` and sets a placeholder or derived value.
   - Example approach: `username + "@example.local"` for local development only.

2. Manual update:
   - Update existing users directly in MongoDB with a valid email.
   - Ensure emails are unique and match the new unique index.

3. Enforce re‑registration:
   - Clear old users in dev environments and re‑register with email.

Important: Because `email` is now `required` and `unique`, you must fix existing documents before running in production.

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
   Fix: Move display metadata to backend or document as intentional.

---

If you want, I can also add environment setup examples, API documentation, or contributor guidelines.
