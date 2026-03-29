import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, alternativeAction }) => {
    return (
        <div className="min-h-screen bg-[#0a0814] selection:bg-primary selection:text-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] -z-10" />
            
            <div className="w-full max-w-md relative z-10">
                {/* Brand */}
                <div className="flex flex-col items-center mb-12 animate-reveal">
                    <Link to="/" className="flex items-center gap-3 group mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:shadow-[0_0_30px_rgba(108,93,211,0.4)] transition-all duration-500">
                            DQ
                        </div>
                        <span className="text-3xl font-black text-white tracking-tighter">DevQuiz</span>
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 text-xs font-mono tracking-widest uppercase">
                        <Terminal size={12} />
                        <span>Secure Access Protocol</span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-reveal [animation-delay:100ms]">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-white mb-2">{title}</h1>
                        <p className="text-gray-400 text-sm">{subtitle}</p>
                    </div>

                    {children}

                    {alternativeAction && (
                        <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-gray-400">
                            {alternativeAction}
                        </div>
                    )}
                </div>

                {/* Footer Microcopy */}
                <div className="mt-8 text-center animate-reveal [animation-delay:200ms]">
                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-mono">
                        &copy; 2026 DevQuiz • Encrypted End-to-End
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
