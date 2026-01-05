# DevQuiz Admin Dashboard

A modern Admin Dashboard for the DevQuiz quiz platform built with React and plain CSS, featuring a dark theme design with blue-purple gradients and orange accents.

## Design System

### Color Palette

| Token              | Value     | Usage                     |
| ------------------ | --------- | ------------------------- |
| `--bg-primary`     | `#0f172a` | Main background           |
| `--bg-secondary`   | `#1e293b` | Card backgrounds          |
| `--gradient-start` | `#3b82f6` | Primary gradient (blue)   |
| `--gradient-end`   | `#8b5cf6` | Primary gradient (purple) |
| `--accent`         | `#f59e0b` | Accent color (orange)     |
| `--text-heading`   | `#f8fafc` | Headings                  |
| `--text-body`      | `#cbd5e1` | Body text                 |
| `--text-muted`     | `#94a3b8` | Muted text                |

### Typography & Spacing

- **Font**: Inter (Google Fonts)
- **Border radius**: 12-16px
- **Card shadows**: `0 4px 20px rgba(0, 0, 0, 0.3)`

## Project Structure

```
DevQuiz/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar/
│   │   ├── TopNavbar/
│   │   ├── OverviewCards/
│   │   ├── AnalyticsSection/
│   │   ├── QuizManagement/
│   │   ├── UserManagement/
│   │   ├── ModalForms/
│   │   ├── Charts/
│   │   └── Toast/
│   ├── data/
│   │   └── mockData.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Implemented Components

### Core Layout

- **Sidebar**: Fixed left sidebar with navigation items, active state highlighting, and mobile responsiveness.
- **TopNavbar**: Admin avatar, name display, notification bell, and profile dropdown.

### Dashboard

- **OverviewCards**: 6 statistic cards in responsive grid with hover lift animations and gradient accents.
- **AnalyticsSection**: Container for charts (Line, Bar, Pie) displaying quiz data.

### Management Modules

- **QuizManagement**: Data table with search, filtering, difficulty badges, and visual pass rate bars.
- **UserManagement**: Data table with user search, role/status display, and pagination.
- **ModalForms**: Overlay modal for creating/editing content with form validation.

### UX Components

- **Toast**: Auto-dismissing notification system (Success, Error, Info).

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Therese-Claire/DevQuiz.git
   cd DevQuiz
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## View Site

The application is designed to be fully responsive and modern.
[View Site Locally](http://localhost:5173/)
