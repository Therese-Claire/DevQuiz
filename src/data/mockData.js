/**
 * Mock data for DevQuiz Admin Dashboard
 * Provides sample data for statistics, users, quizzes, and chart data
 */

// ========================================
// OVERVIEW STATISTICS
// ========================================
export const statisticsData = [
  {
    id: 1,
    title: 'Total Users',
    value: '12,458',
    change: '+12.5%',
    changeType: 'positive', // positive, negative, neutral
    icon: 'users',
    color: 'blue'
  },
  {
    id: 2,
    title: 'Active Users',
    value: '3,842',
    change: '+8.2%',
    changeType: 'positive',
    icon: 'userActive',
    color: 'green'
  },
  {
    id: 3,
    title: 'Total Quizzes',
    value: '256',
    change: '+15.3%',
    changeType: 'positive',
    icon: 'quiz',
    color: 'purple'
  },
  {
    id: 4,
    title: 'Total Questions',
    value: '4,892',
    change: '+5.8%',
    changeType: 'positive',
    icon: 'question',
    color: 'orange'
  },
  {
    id: 5,
    title: 'Attempts Today',
    value: '1,247',
    change: '-3.2%',
    changeType: 'negative',
    icon: 'attempt',
    color: 'cyan'
  },
  {
    id: 6,
    title: 'Pass Rate',
    value: '72.8%',
    change: '+2.1%',
    changeType: 'positive',
    icon: 'chart',
    color: 'pink'
  }
];

// ========================================
// USERS DATA
// ========================================
export const usersData = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    avatar: null,
    joinedDate: '2024-01-15',
    quizzesTaken: 45
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'Active',
    avatar: null,
    joinedDate: '2024-02-20',
    quizzesTaken: 32
  },
  {
    id: 3,
    username: 'mike_wilson',
    email: 'mike.wilson@example.com',
    role: 'Moderator',
    status: 'Active',
    avatar: null,
    joinedDate: '2024-03-10',
    quizzesTaken: 28
  },
  {
    id: 4,
    username: 'sarah_johnson',
    email: 'sarah.j@example.com',
    role: 'User',
    status: 'Inactive',
    avatar: null,
    joinedDate: '2024-01-28',
    quizzesTaken: 15
  },
  {
    id: 5,
    username: 'alex_brown',
    email: 'alex.brown@example.com',
    role: 'User',
    status: 'Active',
    avatar: null,
    joinedDate: '2024-04-05',
    quizzesTaken: 52
  },
  {
    id: 6,
    username: 'emily_davis',
    email: 'emily.d@example.com',
    role: 'User',
    status: 'Active',
    avatar: null,
    joinedDate: '2024-03-22',
    quizzesTaken: 38
  },
  {
    id: 7,
    username: 'chris_miller',
    email: 'chris.m@example.com',
    role: 'User',
    status: 'Suspended',
    avatar: null,
    joinedDate: '2024-02-14',
    quizzesTaken: 8
  },
  {
    id: 8,
    username: 'lisa_taylor',
    email: 'lisa.taylor@example.com',
    role: 'Moderator',
    status: 'Active',
    avatar: null,
    joinedDate: '2024-01-08',
    quizzesTaken: 67
  }
];

// ========================================
// QUIZZES DATA
// ========================================
export const quizzesData = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    category: 'Programming',
    difficulty: 'Beginner',
    status: 'Published',
    questions: 25,
    attempts: 1245,
    passRate: 78,
    createdAt: '2024-01-10',
    updatedAt: '2024-06-15'
  },
  {
    id: 2,
    title: 'React Advanced Concepts',
    category: 'Programming',
    difficulty: 'Advanced',
    status: 'Published',
    questions: 30,
    attempts: 892,
    passRate: 64,
    createdAt: '2024-02-18',
    updatedAt: '2024-07-01'
  },
  {
    id: 3,
    title: 'Python Data Structures',
    category: 'Programming',
    difficulty: 'Intermediate',
    status: 'Published',
    questions: 20,
    attempts: 1567,
    passRate: 71,
    createdAt: '2024-01-25',
    updatedAt: '2024-05-20'
  },
  {
    id: 4,
    title: 'CSS Grid & Flexbox',
    category: 'Web Design',
    difficulty: 'Beginner',
    status: 'Draft',
    questions: 15,
    attempts: 0,
    passRate: 0,
    createdAt: '2024-07-10',
    updatedAt: '2024-07-10'
  },
  {
    id: 5,
    title: 'Node.js Backend Development',
    category: 'Programming',
    difficulty: 'Intermediate',
    status: 'Published',
    questions: 28,
    attempts: 734,
    passRate: 69,
    createdAt: '2024-03-05',
    updatedAt: '2024-06-28'
  },
  {
    id: 6,
    title: 'Database Design Principles',
    category: 'Database',
    difficulty: 'Intermediate',
    status: 'Published',
    questions: 22,
    attempts: 456,
    passRate: 75,
    createdAt: '2024-04-12',
    updatedAt: '2024-06-01'
  },
  {
    id: 7,
    title: 'DevOps Essentials',
    category: 'DevOps',
    difficulty: 'Advanced',
    status: 'Review',
    questions: 35,
    attempts: 0,
    passRate: 0,
    createdAt: '2024-06-20',
    updatedAt: '2024-07-05'
  },
  {
    id: 8,
    title: 'TypeScript Basics',
    category: 'Programming',
    difficulty: 'Beginner',
    status: 'Published',
    questions: 18,
    attempts: 1089,
    passRate: 82,
    createdAt: '2024-02-28',
    updatedAt: '2024-05-15'
  }
];

// ========================================
// CATEGORIES DATA
// ========================================
export const categoriesData = [
  { id: 1, name: 'Programming', quizCount: 45, color: '#3b82f6' },
  { id: 2, name: 'Web Design', quizCount: 28, color: '#8b5cf6' },
  { id: 3, name: 'Database', quizCount: 18, color: '#f59e0b' },
  { id: 4, name: 'DevOps', quizCount: 15, color: '#10b981' },
  { id: 5, name: 'Mobile Development', quizCount: 22, color: '#ef4444' },
  { id: 6, name: 'Data Science', quizCount: 12, color: '#06b6d4' }
];

// ========================================
// CHART DATA - LINE CHART (Attempts over time)
// ========================================
export const lineChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Quiz Attempts',
      data: [245, 312, 289, 378, 425, 356, 298],
      color: '#3b82f6'
    }
  ]
};

// ========================================
// CHART DATA - BAR CHART (Category distribution)
// ========================================
export const barChartData = {
  labels: ['Programming', 'Web Design', 'Database', 'DevOps', 'Mobile', 'Data Science'],
  datasets: [
    {
      label: 'Quizzes per Category',
      data: [45, 28, 18, 15, 22, 12],
      colors: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4']
    }
  ]
};

// ========================================
// CHART DATA - PIE CHART (Pass vs Fail)
// ========================================
export const pieChartData = {
  labels: ['Passed', 'Failed'],
  datasets: [
    {
      data: [72.8, 27.2],
      colors: ['#10b981', '#ef4444']
    }
  ]
};

// ========================================
// NAVIGATION ITEMS
// ========================================
export const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'users', label: 'Users', icon: 'users' },
  { id: 'quizzes', label: 'Quizzes', icon: 'quiz' },
  { id: 'questions', label: 'Questions', icon: 'question' },
  { id: 'categories', label: 'Categories', icon: 'category' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'reports', label: 'Reports', icon: 'reports' },
  { id: 'settings', label: 'Settings', icon: 'settings' }
];

// ========================================
// NOTIFICATIONS DATA
// ========================================
export const notificationsData = [
  {
    id: 1,
    title: 'New User Registration',
    message: 'john_doe has joined DevQuiz',
    time: '5 min ago',
    read: false,
    type: 'user'
  },
  {
    id: 2,
    title: 'Quiz Completed',
    message: 'JavaScript Fundamentals passed by 15 users',
    time: '1 hour ago',
    read: false,
    type: 'quiz'
  },
  {
    id: 3,
    title: 'New Quiz Published',
    message: 'React Advanced Concepts is now live',
    time: '3 hours ago',
    read: true,
    type: 'quiz'
  },
  {
    id: 4,
    title: 'System Update',
    message: 'Server maintenance scheduled for tonight',
    time: '1 day ago',
    read: true,
    type: 'system'
  }
];

// ========================================
// ADMIN USER DATA
// ========================================
export const adminUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@devquiz.com',
  role: 'Super Admin',
  avatar: null
};

// ========================================
// DIFFICULTY LEVELS
// ========================================
export const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

// ========================================
// STATUS OPTIONS
// ========================================
export const statusOptions = ['Published', 'Draft', 'Review', 'Archived'];

// ========================================
// ROLE OPTIONS
// ========================================
export const roleOptions = ['Admin', 'Moderator', 'User'];
