import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

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
