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

## Roadmap Ideas

1. Connect frontend to backend for real data.
2. Add authentication login and role‑based access control.
3. Store quiz history per user.
4. Admin management for quizzes and questions.
5. Add leaderboards and performance analytics.

### Additional Review Findings (Latest Sweep)

1. Results are never posted to the backend.
   Impact: Profile stats and recent activity will always be empty.
   Where: `frontend/src/pages/QuizPage.jsx`, `frontend/src/pages/ResultPage.jsx`, `Backend/routes/result.routes.js`
   Fix: POST results to `/api/results` when a quiz completes, then read them in Profile.

2. Login uses email → username inference, but registration ignores email.
   Impact: Users may register with an email that is never stored; login may fail if username differs.
   Where: `frontend/src/pages/Register.jsx`, `frontend/src/pages/Login.jsx`, `Backend/controllers/auth.controller.js`
   Fix: Decide on username vs email; store and authenticate consistently.

3. Root `package.json` is a stray dependency.
   Impact: Confusing install target; installs dependencies outside the real app folders.
   Where: `package.json`
   Fix: Remove it or document its purpose; prefer using `frontend/package.json` and `Backend/package.json`.

4. Mock data file still exists after API integration.
   Impact: Confusing source of truth; contributors may edit the wrong data source.
   Where: `frontend/src/data/mockQuizData.js`
   Fix: Move to backend seed data or delete and document the new source of truth.

5. Categories/topics are frontend‑only metadata while backend only stores questions.
   Impact: Data can drift between frontend and backend.
   Where: `frontend/src/data/quizMetaData.js`, `Backend/models/question.js`
   Fix: Add backend endpoints for categories/topics or generate metadata from the DB.

6. Firebase service file is unused and contains placeholder keys.
   Impact: Dead code and confusion about auth direction.
   Where: `frontend/src/services/firebase.js`
   Fix: Remove it or wire it into the app with real config.

7. Category page loads counts by fetching all questions in a category.
   Impact: Can be slow on large datasets.
   Where: `frontend/src/pages/CategoryPage.jsx`
   Fix: Add a backend counts endpoint, e.g. `/api/questions/counts`.

8. Unused/duplicate quiz components remain.
   Impact: Maintenance overhead and confusion.
   Where: `frontend/src/components/Quiz.jsx`, `QuizCard.jsx`, `ResultCard.jsx`, `ThemeToggle.jsx`
   Fix: Remove or wire them into the UI.

9. Profile page filename casing is inconsistent.
   Impact: Can break imports on case‑sensitive systems.
   Where: `frontend/src/pages/profile.jsx`
   Fix: Rename to `Profile.jsx` and update imports.

10. Error handling is inconsistent across controllers.
    Impact: Error responses may not always match the standardized shape.
    Where: `Backend/controllers/auth.controller.js`, `Backend/controllers/question.controller.js`
    Fix: Use `httpError` + `next()` consistently in all controllers.

11. Question endpoints lack pagination.
    Impact: Large payloads for big datasets.
    Where: `Backend/controllers/question.controller.js`
    Fix: Add `page` and `limit` query params with defaults.

---

If you want, I can also add environment setup examples, API documentation, or contributor guidelines.
