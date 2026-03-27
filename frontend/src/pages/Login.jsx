import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;
        try {
            setLoading(true);
            setError('');
            setEmailError('');
            setPasswordError('');
            await loginUser({ email, password });
            navigate('/dashboard');
        } catch (err) {
            if (err.code === 'invalid_login_credentials') {
                setError('Invalid email or password.');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
            <div className="absolute top-16 left-8 w-80 h-80 bg-primary/20 rounded-full blur-[140px] -z-10" />
            <div className="absolute bottom-20 right-6 w-96 h-96 bg-secondary/20 rounded-full blur-[160px] -z-10" />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary text-sm tracking-wide">
                        Welcome back
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        Pick up where you left off
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                        Your streaks, badges, and leaderboard rank are waiting. Log in to keep building momentum.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { title: 'Daily Streaks', desc: 'Stay consistent' },
                            { title: 'Smart Feedback', desc: 'Learn faster' },
                            { title: 'Live Rankings', desc: 'See your rank' },
                        ].map((item) => (
                            <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <div className="text-white font-semibold">{item.title}</div>
                                <div className="text-gray-500 text-sm">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-white">Sign in</h2>
                            <p className="text-gray-400">Access your dashboard and results</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-medium">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                                    placeholder="you@example.com"
                                />
                                {emailError && (
                                    <p className="mt-2 text-sm text-red-400">{emailError}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-medium">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                />
                                {passwordError && (
                                    <p className="mt-2 text-sm text-red-400">{passwordError}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(108,93,211,0.5)] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 text-center text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <div className="mt-6 text-center text-sm text-gray-400">
                            Don&apos;t have an account?{' '}
                            <Link to="/register" className="text-secondary hover:text-white transition-colors font-medium">
                                Create one
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 text-xs text-gray-500 text-center">
                        Your progress is saved securely and only visible to you.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
