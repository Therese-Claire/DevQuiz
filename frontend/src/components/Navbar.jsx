import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { fetchMyResults } from '../services/api';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [streakDays, setStreakDays] = useState(0);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        let isMounted = true;
        const loadStreak = async () => {
            if (!user) {
                setStreakDays(0);
                return;
            }
            try {
                const data = await fetchMyResults();
                if (isMounted) {
                    setStreakDays(computeStreak(data.results || []));
                }
            } catch {
                if (isMounted) setStreakDays(0);
            }
        };
        loadStreak();
        return () => {
            isMounted = false;
        };
    }, [user?.id]);

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] px-6 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                        D
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        DevQuiz
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-500 dark:text-gray-300 transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    {user ? (
                        <>
                            <Link to="/leaderboard" className="text-gray-300 hover:text-white transition-colors font-medium">
                                Leaderboard
                            </Link>
                            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-gray-200 text-sm">
                                <span className="text-secondary">ðŸ”¥</span>
                                <span>{streakDays} day streak</span>
                            </div>
                            <span className="hidden md:block text-gray-300">Welcome, <span className="text-secondary font-semibold">{user.username}</span></span>
                            <button
                                onClick={handleLogout}
                                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl transition-all duration-300 border border-white/10 font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/30 font-medium"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

function computeStreak(results) {
    if (!results || results.length === 0) return 0;
    const days = new Set(
        results
            .map((r) => new Date(r.created_at || r.createdAt))
            .filter((d) => !Number.isNaN(d.getTime()))
            .map((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime())
    );
    const sortedDays = Array.from(days).sort((a, b) => b - a);
    let streak = 0;
    let current = new Date();
    current = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
    for (const day of sortedDays) {
        if (day === current) {
            streak += 1;
            current -= 24 * 60 * 60 * 1000;
        } else if (day < current) {
            break;
        }
    }
    return streak;
}
