# Backend Implementation Guide

This document serves as a blueprint for the backend developer to build the API and database structure required to support the DevQuiz Admin Dashboard.

## Recommended Tech Stack & Plugins

To ensure a robust, scalable, and modern backend, we recommend the following stack:

- **Runtime**: **Node.js** (v18+)
- **Framework**: **Express.js** (Fast, unopinionated, minimalist web framework)
- **Database**: **PostgreSQL** (Relational database for structured user and quiz data)
- **ORM**: **Prisma** (Next-generation Node.js and TypeScript ORM)
- **Authentication**: **JWT (jsonwebtoken)** + **bcrypt** (for password hashing)
- **Validation**: **Zod** or **Joi** (Schema validation)
- **CORS**: **cors** (Middleware to enable Cross-Origin Resource Sharing)

## Database Schema (Variables)

Below are the required data models based on the frontend `mockData.js`.

### 1. Users Table

Stores administrative and regular user accounts.

| Variable Name   | Type       | Description                             | nullable               |
| :-------------- | :--------- | :-------------------------------------- | :--------------------- |
| `id`            | UUID / Int | Primary Key                             | No                     |
| `username`      | String     | Unique username                         | No                     |
| `email`         | String     | Unique email address                    | No                     |
| `password_hash` | String     | Hashed password                         | No                     |
| `role`          | Enum       | `'Admin'`, `'Moderator'`, `'User'`      | No (Default: 'User')   |
| `status`        | Enum       | `'Active'`, `'Inactive'`, `'Suspended'` | No (Default: 'Active') |
| `avatar_url`    | String     | URL to profile image                    | Yes                    |
| `joined_at`     | DateTime   | Timestamp of registration               | No                     |
| `quizzes_taken` | Int        | Count of quizzes completed              | No (Default: 0)        |

### 2. Quizzes Table

Stores quiz metadata and configuration.

| Variable Name     | Type       | Description                                        | nullable              |
| :---------------- | :--------- | :------------------------------------------------- | :-------------------- |
| `id`              | UUID / Int | Primary Key                                        | No                    |
| `title`           | String     | Title of the quiz                                  | No                    |
| `category_id`     | Int        | Foreign Key to Categories                          | No                    |
| `difficulty`      | Enum       | `'Beginner'`, `'Intermediate'`, `'Advanced'`       | No                    |
| `status`          | Enum       | `'Published'`, `'Draft'`, `'Review'`, `'Archived'` | No (Default: 'Draft') |
| `description`     | Text       | Short description of the quiz                      | Yes                   |
| `total_questions` | Int        | Number of questions in quiz                        | No (Default: 0)       |
| `total_attempts`  | Int        | Number of times taken                              | No (Default: 0)       |
| `pass_rate`       | Float      | Calculated percentage (0-100)                      | No (Default: 0.0)     |
| `created_at`      | DateTime   | Timestamp of creation                              | No                    |
| `updated_at`      | DateTime   | Timestamp of last update                           | No                    |

### 3. Categories Table

Categorization for quizzes.

| Variable Name | Type   | Description                         | nullable |
| :------------ | :----- | :---------------------------------- | :------- |
| `id`          | Int    | Primary Key                         | No       |
| `name`        | String | Category name (e.g., 'Programming') | No       |
| `color`       | String | Hex color code (e.g., '#3b82f6')    | No       |

### 4. Notifications Table

System and activity notifications for admins.

| Variable Name | Type       | Description                        | nullable            |
| :------------ | :--------- | :--------------------------------- | :------------------ |
| `id`          | Int        | Primary Key                        | No                  |
| `user_id`     | UUID / Int | Target user (null for system-wide) | Yes                 |
| `title`       | String     | Notification header                | No                  |
| `message`     | String     | Body text                          | No                  |
| `type`        | Enum       | `'user'`, `'quiz'`, `'system'`     | No                  |
| `is_read`     | Boolean    | Read status                        | No (Default: false) |
| `created_at`  | DateTime   | Timestamp                          | No                  |

## API Endpoints

The frontend expects RESTful endpoints. All responses should be in JSON format.

### 1. Authentication

- `POST /api/auth/login`: Authenticate admin/user and return JWT.
- `GET /api/auth/me`: Validate token and return current user details.

### 2. Dashboard Statistics

- `GET /api/stats/overview`: Returns aggregated data for the 6 overview cards (Total Users, Active Users, etc.).
- `GET /api/stats/charts`: Returns formatted data for Line, Bar, and Pie charts.

### 3. User Management

- `GET /api/users`: List users with implementation of **search** (`?q=...`) and **pagination** (`?page=1&limit=10`).
- `POST /api/users`: Create a new user.
- `PUT /api/users/:id`: Update user details (role, status).
- `DELETE /api/users/:id`: Remove or soft-delete a user.

### 4. Quiz Management

- `GET /api/quizzes`: List quizzes with **filtering** (`?status=Published`), **search**, and **pagination**.
- `POST /api/quizzes`: Create a new quiz.
- `PUT /api/quizzes/:id`: Update quiz details.
- `DELETE /api/quizzes/:id`: Archive or delete a quiz.

### 5. Categories

- `GET /api/categories`: List all categories for dropdown menus.

### 6. Notifications

- `GET /api/notifications`: List recent notifications.
- `PUT /api/notifications/:id/read`: Mark a notification as read.

## Implementation Notes

1.  **Pagination**: The frontend components are built to handle pagination. APIs listing Users and Quizzes **must** return total pages/count metadata.
2.  **Search**: Search logic should be case-insensitive and look at multiple fields (e.g., Username and Email for users; Title and Category for quizzes).
3.  **Status Codes**: Use standard HTTP codes (`200` OK, `201` Created, `400` Bad Request, `401` Unauthorized, `500` Server Error).
