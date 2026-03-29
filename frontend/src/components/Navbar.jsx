import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { fetchMyResults } from '../services/api';
import { Flame, Sun, Moon, LogOut, LayoutDashboard, Trophy } from 'lucide-react';

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
        <nav className="fixed top-0 w-full z-50 px-6 py-6 md:px-12">
            <div className="max-w-7xl mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl px-6 py-4 flex justify-between items-center transition-all duration-500">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:shadow-[0_0_20px_rgba(108,93,211,0.4)] transition-all duration-300">
                        DQ
                    </div>
                    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500 tracking-tighter">
                        DevQuiz
                    </span>
                </Link>

                <div className="flex items-center gap-4 md:gap-8">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4 md:gap-8">
                            <Link to="/leaderboard" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium">
                                <Trophy size={18} />
                                <span>Ranks</span>
                            </Link>
                            
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold">
                                <Flame size={16} fill="currentColor" />
                                <span>{streakDays}</span>
                            </div>

                            <Link to="/dashboard" className="hidden lg:flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-colors">
                                <LayoutDashboard size={18} />
                                <span>{user.username}</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all border border-white/5"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 md:gap-6">
                            <Link to="/login" className="text-gray-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="bg-white text-black px-6 py-2.5 rounded-xl transition-all duration-300 font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                            >
                                Get Started
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
