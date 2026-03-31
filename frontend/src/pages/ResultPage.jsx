import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { createResult, createQuizSetResult } from '../services/api';
import { useAuth } from '../context/useAuth';
import { 
    Trophy, 
    Star, 
    RefreshCcw, 
    LayoutDashboard, 
    CheckCircle2, 
    XCircle, 
    Activity,
    TrendingUp,
    ShieldCheck,
    ChevronRight,
    ChevronDown,
    Clock,
    Loader2
} from 'lucide-react';

function formatTime(seconds) {
    if (!seconds) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

const ResultPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const hasPostedRef = useRef(false);
    const { refreshStats } = useAuth();
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const { score, total, category, topic, categoryId, topicId, setId, sessionResults = [], totalTime } = state || {};
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    const isSuccess = percentage >= 80;
    const isPass = percentage >= 50;

    const saveResult = async () => {
        if (!state) return;
        setSaving(true);
        try {
            if (setId) {
                // Quiz Set completion
                await createQuizSetResult({ setId, score, total });
            } else if (categoryId && topicId) {
                // Standard topic quiz
                await createResult({ categoryId, topicId, score, total });
            }
            setSaveSuccess(true);
            setSaveError('');
            // Refresh global rank + score in context so dashboard reflects instantly
            if (refreshStats) refreshStats();
        } catch {
            setSaveError('Failed to synchronize mission data.');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!state) return;
        if (hasPostedRef.current) return;
        hasPostedRef.current = true;
        saveResult();
    }, [state]);

    if (!state) return <Navigate to="/dashboard" />;

    // Re-engage navigation: back to the exact quiz route
    const reEngageRoute = setId
        ? `/quiz-set/${setId}`
        : categoryId && topicId
            ? `/quiz/${categoryId}/${topicId}`
            : '/dashboard';

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#0a0814] relative overflow-hidden selection:bg-primary selection:text-white">
            <div className={`absolute top-0 left-0 w-[50%] h-[50%] ${isSuccess ? 'bg-secondary/10' : 'bg-primary/10'} rounded-full blur-[160px] -z-10 animate-pulse`} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[140px] -z-10" />

            <div className="max-w-4xl mx-auto px-6">
                <div className="animate-reveal">
                    {/* Header */}
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

                    {/* Main Result Card */}
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

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-xl relative z-10">
                                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Efficiency Rating</div>
                                    <div className={`text-5xl font-black ${isSuccess ? 'text-secondary' : 'text-primary'}`} style={isSuccess ? { textShadow: '0 0 20px rgba(108,93,211,0.5)' } : {}}>{percentage}%</div>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Objectives Met</div>
                                    <div className="text-5xl font-black text-white">{score}<span className="text-xl text-gray-600 ml-1">/ {total}</span></div>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">Time Elapsed</div>
                                    <div className="text-4xl font-black text-white flex items-center gap-2 justify-center">
                                        <Clock size={24} className="text-primary shrink-0" />
                                        {formatTime(totalTime)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Panel */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group mb-8">
                        <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                            <ShieldCheck size={24} className="text-secondary" />
                            Detailed Analysis
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <span className="font-mono text-xs uppercase tracking-widest text-gray-400">Validated</span>
                                    </div>
                                    <span className="text-xl font-black text-white">{score}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                                            <XCircle size={24} />
                                        </div>
                                        <span className="font-mono text-xs uppercase tracking-widest text-gray-400">Rejected</span>
                                    </div>
                                    <span className="text-xl font-black text-white">{total - score}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-6 bg-black/20 rounded-3xl border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Mastery Sync Status</span>
                                        {saving ? (
                                            <div className="flex items-center gap-2 text-primary animate-pulse">
                                                <Loader2 size={12} className="animate-spin" />
                                                <span className="text-[10px] font-bold uppercase">Syncing...</span>
                                            </div>
                                        ) : saveSuccess ? (
                                            <div className="flex items-center gap-2 text-green-400">
                                                <CheckCircle2 size={12} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Data Secure</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest italic">Pending</span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                        Your scores are automatically synced to the global leaderboards to update your percentile.
                                    </p>
                                </div>
                                {saveError && (
                                    <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                        <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">{saveError}</span>
                                        <button onClick={saveResult} className="text-[10px] font-bold text-white uppercase tracking-widest p-2 hover:bg-white/10 rounded-lg">Retry</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Per-Question Breakdown */}
                    {sessionResults.length > 0 && (
                        <div className="mb-12 bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                            <button
                                onClick={() => setShowBreakdown(s => !s)}
                                className="w-full flex items-center justify-between p-8 text-left hover:bg-white/5 transition-colors group"
                            >
                                <span className="text-xl font-black text-white flex items-center gap-3">
                                    <Activity size={20} className="text-primary" />
                                    Question Review
                                    <span className="text-sm font-mono text-gray-500 font-normal">{score}/{total} correct</span>
                                </span>
                                <ChevronDown size={20} className={`text-gray-500 transition-transform duration-300 ${showBreakdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showBreakdown && (
                                <div className="px-8 pb-8 space-y-4 animate-reveal">
                                    {sessionResults.map((r, i) => (
                                        <div
                                            key={i}
                                            className={`p-6 rounded-2xl border ${r.isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${r.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                    {r.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-semibold mb-3 leading-relaxed text-sm">{r.question}</p>
                                                    <div className="flex flex-col sm:flex-row gap-3 text-xs font-mono">
                                                        <span className={`px-3 py-1.5 rounded-lg ${r.isCorrect ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                            Your answer: {r.selected}
                                                        </span>
                                                        {!r.isCorrect && (
                                                            <span className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                                                                Correct: {r.correctAnswer}
                                                            </span>
                                                        )}
                                                        <span className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-500 border border-white/5 ml-auto flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {r.timeSpent}s
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mission Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-reveal [animation-delay:200ms]">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group flex items-center justify-center gap-4 bg-white/5 border border-white/10 py-6 rounded-[2rem] text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/30 transition-all active:scale-95"
                        >
                            <LayoutDashboard size={20} className="group-hover:rotate-12 transition-transform" />
                            <span>Command Center</span>
                        </button>
                        <button
                            onClick={() => navigate(reEngageRoute)}
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
        </div>
    );
};

export default ResultPage;
