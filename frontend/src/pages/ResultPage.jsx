import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { createResult } from '../services/api';
import { 
    Trophy, 
    Star, 
    RefreshCcw, 
    LayoutDashboard, 
    CheckCircle2, 
    XCircle, 
    Activity,
    Target,
    Zap,
    TrendingUp,
    ShieldCheck,
    ChevronRight,
    Search,
    Loader2
} from 'lucide-react';

const ResultPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const hasPostedRef = useRef(false);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saving, setSaving] = useState(false);

    if (!state) {
        return <Navigate to="/dashboard" />;
    }

    const { score, total, category, topic, categoryId, topicId } = state;
    const percentage = Math.round((score / total) * 100);
    const canSave = Boolean(categoryId && topicId);

    const isSuccess = percentage >= 80;
    const isPass = percentage >= 50;

    useEffect(() => {
        if (!canSave) return;
        if (hasPostedRef.current) return;
        hasPostedRef.current = true;
        setSaving(true);
        createResult({ categoryId, topicId, score, total })
            .then(() => {
                setSaveSuccess(true);
                setSaveError('');
            })
            .catch(() => {
                setSaveError('Failed to synchronize mission data.');
            })
            .finally(() => setSaving(false));
    }, [canSave, categoryId, topicId, score, total]);

    const handleRetrySave = () => {
        if (!canSave) return;
        setSaving(true);
        setSaveError('');
        createResult({ categoryId, topicId, score, total })
            .then(() => {
                setSaveSuccess(true);
                setSaveError('');
            })
            .catch(() => {
                setSaveError('Failed to synchronize mission data.');
            })
            .finally(() => setSaving(false));
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#0a0814] relative overflow-hidden selection:bg-primary selection:text-white">
            {/* Background Glows */}
            <div className={`absolute top-0 left-0 w-[50%] h-[50%] ${isSuccess ? 'bg-secondary/10' : 'bg-primary/10'} rounded-full blur-[160px] -z-10 animate-pulse`} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[140px] -z-10" />

            <div className="max-w-4xl mx-auto px-6">
                <div className="animate-reveal">
                    {/* Mission Debrief Header */}
                    <header className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-500 text-[10px] font-mono tracking-widest uppercase">
                            <Activity size={10} className="text-secondary animate-pulse" />
                            <span>Post-Mission Analysis</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
                            Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">Debrief</span>
                        </h1>
                        <p className="text-gray-400 font-medium">
                            {category} <span className="text-white">/</span> {topic}
                        </p>
                    </header>

                    {/* Main Results Card */}
                    <div className="relative group mb-12">
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${isSuccess ? 'from-secondary via-white to-secondary' : 'from-primary via-white to-primary'} rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000`}></div>
                        <div className="relative bg-[#0d0b1a] border border-white/10 rounded-[3rem] p-10 md:p-16 overflow-hidden flex flex-col items-center text-center">
                            
                            <div className={`w-32 h-32 rounded-3xl mb-10 flex items-center justify-center border shadow-2xl animate-reveal
                                ${isSuccess 
                                    ? 'bg-secondary/10 border-secondary/20 text-secondary' 
                                    : isPass 
                                        ? 'bg-primary/10 border-primary/20 text-primary' 
                                        : 'bg-white/5 border-white/10 text-gray-500'
                                }`}>
                                {isSuccess ? <Trophy size={64} /> : isPass ? <Star size={64} /> : <TrendingUp size={64} />}
                            </div>

                            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                                {isSuccess ? 'Engineering Excellence!' : isPass ? 'Requirement Met' : 'Tactical Iteration Needed'}
                            </h2>
                            <p className="text-gray-500 max-w-sm mb-12 text-lg font-medium">
                                {isSuccess 
                                    ? 'Target parameters achieved with high precision. Domain mastery established.'
                                    : isPass
                                        ? 'Module fundamentals confirmed. Further deep-dive missions recommended.'
                                        : 'Mission parameters not met. Re-engagement required to establish baseline.'
                                }
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md relative z-10">
                                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Efficiency Rating</div>
                                    <div className={`text-5xl font-black ${isSuccess ? 'text-secondary font-glow' : 'text-primary'}`}>{percentage}%</div>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Objectives Met</div>
                                    <div className="text-5xl font-black text-white">{score}<span className="text-xl text-gray-600 ml-1">/ {total}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-12">
                             <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none group-hover:text-white/10 transition-colors">
                                    <Search size={120} strokeWidth={1} />
                                </div>
                                
                                <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                    <ShieldCheck size={24} className="text-secondary" />
                                    Detailed Analysis
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <span className="font-mono text-xs uppercase tracking-widest text-gray-400">Validated</span>
                                            </div>
                                            <span className="text-xl font-black text-white">{score}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <XCircle size={24} />
                                                </div>
                                                <span className="font-mono text-xs uppercase tracking-widest text-gray-400">Rejected</span>
                                            </div>
                                            <span className="text-xl font-black text-white">{total - score}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-black/20 rounded-3xl border border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Mastery Sync Status</span>
                                                {saving ? (
                                                    <div className="flex items-center gap-2 text-primary animate-pulse">
                                                        <Loader2 size={12} className="animate-spin" />
                                                        <span className="text-[10px] font-bold uppercase">Syncing...</span>
                                                    </div>
                                                ) : saveSuccess ? (
                                                    <div className="flex items-center gap-2 text-secondary">
                                                        <CheckCircle2 size={12} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Data Secure</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest italic">Sync Not required</span>
                                                )}
                                            </div>
                                            <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                                Your scores are automatically synced to the global leaderboards to update your percentile.
                                            </p>
                                        </div>
                                        {saveError && (
                                            <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                                <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">{saveError}</span>
                                                <button onClick={handleRetrySave} className="text-[10px] font-bold text-white uppercase tracking-widest p-2 hover:bg-white/10 rounded-lg">Retry Sync</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Mission Controls */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 animate-reveal [animation-delay:200ms]">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group flex items-center justify-center gap-4 bg-white/5 border border-white/10 py-6 rounded-[2rem] text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/30 transition-all active:scale-95"
                        >
                            <LayoutDashboard size={20} className="group-hover:rotate-12 transition-transform" />
                            <span>Command Center</span>
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className={`group flex items-center justify-center gap-4 py-6 rounded-[2rem] text-white font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl
                                ${isSuccess ? 'bg-secondary shadow-secondary/20 hover:shadow-secondary/40' : 'bg-primary shadow-primary/20 hover:shadow-primary/40'}`}
                        >
                            <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                            <span>Re-Engage Target</span>
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .font-glow {
                    text-shadow: 0 0 20px rgba(108,93,211,0.5);
                }
            `}} />
        </div>
    );
};

export default ResultPage;
