import { Routes, Route, Navigate } from 'react-router-dom';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import AdminDashboard from './pages/AdminDashboard';
import CategoryPage from './pages/CategoryPage';
import { useAuth } from './context/AuthContext';
import NotAuthorized from './pages/NotAuthorized';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl px-10 py-8 shadow-2xl text-center">
          <div className="w-10 h-10 border-4 border-white/20 border-t-secondary rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white font-semibold">Loading your session</div>
          <div className="text-gray-400 text-sm">Please wait a moment</div>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl px-10 py-8 shadow-2xl text-center">
          <div className="w-10 h-10 border-4 border-white/20 border-t-secondary rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white font-semibold">Checking access</div>
          <div className="text-gray-400 text-sm">Hold tight</div>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/not-authorized" />;
  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#110e1b] dark:text-white transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/category/:categoryId"
              element={
                <ProtectedRoute>
                  <CategoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:categoryId/:topicId"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result"
              element={
                <ProtectedRoute>
                  <ResultPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="/not-authorized" element={<NotAuthorized />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
