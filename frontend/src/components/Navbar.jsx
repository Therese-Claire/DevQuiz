import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/ThemeContext';
import { fetchMyResults } from '../services/api';
import { 
    LayoutDashboard, 
    Trophy, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    Bell,
    User,
    ChevronDown,
    Zap,
    Flame, 
    Sun, 
    Moon 
} from 'lucide-react';
import { computeStreak } from '../utils/stats';

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
        <nav className="fixed top-0 w-full z-50 px-4 py-2 md:px-8">
            <div className="max-w-7xl mx-auto bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl px-5 py-2.5 flex justify-between items-center transition-all duration-500 hover:bg-black/40">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:shadow-[0_0_15px_rgba(108,93,211,0.3)] transition-all duration-300">
                        DQ
                    </div>
                    <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400 tracking-tighter">
                        DevQuiz
                    </span>
                </Link>

                <div className="flex items-center gap-3 md:gap-6">
                    <button
                        onClick={toggleTheme}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all border border-white/5"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4 md:gap-8">
                            <Link to="/leaderboard" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium">
                                <Trophy size={18} />
                                <span>Ranks</span>
                            </Link>

                            <Link to="/profile" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium">
                                <User size={18} />
                                <span>Profile</span>
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
