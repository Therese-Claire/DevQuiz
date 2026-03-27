import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !username) return;
        try {
            setLoading(true);
            setError('');
            await registerUser({ username, email, password });
            await loginUser({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
            <div className="absolute top-10 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-[140px] -z-10" />
            <div className="absolute bottom-16 left-8 w-96 h-96 bg-primary/20 rounded-full blur-[160px] -z-10" />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6 order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary text-sm tracking-wide">
                        Create your account
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        Start building your dev streak
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                        Join DevQuiz and get daily practice, clear progress tracking, and badges that celebrate wins.
                    </p>
                    <div className="space-y-4">
                        {[
                            { title: 'Personalized stats', desc: 'Track accuracy, streaks, and topic mastery.' },
                            { title: 'Curated quiz sets', desc: 'Take focused sets by difficulty.' },
                            { title: 'Community energy', desc: 'Climb the leaderboard and compare progress.' },
                        ].map((item) => (
                            <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <div className="text-white font-semibold">{item.title}</div>
                                <div className="text-gray-500 text-sm">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full order-1 lg:order-2">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-white">Create account</h2>
                            <p className="text-gray-400">It only takes a minute</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-medium">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all placeholder:text-gray-600"
                                    placeholder="DevMaster"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-medium">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all placeholder:text-gray-600"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-medium">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                />
                                <div className="mt-2 text-xs text-gray-500">Use 8+ characters for a stronger password.</div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(237,137,54,0.5)] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : 'Create Account'}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 text-center text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <div className="mt-6 text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:text-white transition-colors font-medium">
                                Log in
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 text-xs text-gray-500 text-center">
                        By creating an account, you agree to our terms and privacy policy.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
