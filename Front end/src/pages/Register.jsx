import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password && username) {
            // Mock register
            login({ username, email });
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/10 blur-[150px] -z-10" />
            <div className="absolute bottom-0 right-0 w-1/2 h-full bg-secondary/10 blur-[150px] -z-10" />

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl animate-fade-in-up">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h2>
                <p className="text-gray-400 text-center mb-8">Start your developer journey today</p>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(237,137,54,0.5)] transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account? {' '}
                    <Link to="/login" className="text-primary hover:text-white transition-colors font-medium">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
