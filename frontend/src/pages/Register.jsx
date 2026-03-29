import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import AuthLayout from '../components/auth/AuthLayout';
import { User, Mail, Lock, Eye, EyeOff, Github, Chrome, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !username) return;
        try {
            setLoading(true);
            setError('');
            const sanitizedEmail = email.trim().toLowerCase();
            const sanitizedUsername = username.trim();

            await registerUser({ username: sanitizedUsername, email: sanitizedEmail, password: password });
            await loginUser({ email: sanitizedEmail, password: password });
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration error:', err);
            if (err.status === 429) {
                setError('Rate limit reached. Please wait a few minutes.');
            } else if (err.code === 'email_address_invalid') {
                setError('Invalid email address format.');
            } else {
                setError(err.message || 'Registration failed. Try a different username.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Deploy Portfolio" 
            subtitle="Begin your engineering journey and track your progression."
            alternativeAction={
                <>
                    Already a member?{' '}
                    <Link to="/login" className="text-white font-bold hover:text-secondary transition-colors">
                        Sign In
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm animate-shake">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest ml-1">Engineering Handle</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-secondary transition-colors">
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all placeholder:text-gray-600 text-sm font-medium"
                            placeholder="e.g. LinusTorvalds"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest ml-1">Communication Channel</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-secondary transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all placeholder:text-gray-600 text-sm font-medium"
                            placeholder="engineer@devquiz.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Master Key</label>
                        <span className="text-[10px] text-gray-600 font-mono">8+ Characters</span>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-secondary transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all placeholder:text-gray-600 text-sm font-medium"
                            placeholder="••••••••••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full py-4 bg-white text-black font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden shadow-xl shadow-white/5"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <>
                            <span>Authorize Profile</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <div className="relative py-4 flex items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">or sign up with</span>
                    <div className="flex-grow border-t border-white/5"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <Github size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">GitHub</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <Chrome size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Google</span>
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
