import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/useAuth";
import { fetchMyResults } from "../services/api";
import { supabase } from "../services/supabase";
import { categories, topicsByCategory } from "../data/quizMetaData";
import { 
    User, 
    Trophy, 
    Activity, 
    Target, 
    Flame, 
    ShieldCheck, 
    Award, 
    History, 
    BarChart, 
    ExternalLink,
    ChevronRight,
    Star,
    Layers,
    Clock,
    Zap,
    Cpu,
    BadgeCheck,
    Radar
} from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;
        const loadResults = async () => {
            try {
                setLoading(true);
                const data = await fetchMyResults();
                if (isMounted) {
                    setResults(data.results || []);
                    setError("");
                }
            } catch (err) {
                if (isMounted) setError("Failed to synchronize mission stats.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        const loadBadges = async () => {
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData.user?.id;
            if (!userId) return;
            const { data } = await supabase
                .from('user_badges')
                .select('badge_id, badges(name, description, icon)')
                .eq('user_id', userId);
            if (isMounted) setBadges(data || []);
        };
        loadResults();
        loadBadges();
        return () => { isMounted = false; };
    }, []);

    const totalQuizzes = results.length;
    const totalScore = results.reduce((acc, r) => acc + (r.score || 0), 0);
    const totalQuestions = results.reduce((acc, r) => acc + (r.total || 0), 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    const bestPercentage = results.length > 0
        ? Math.max(...results.map((r) => r.percentage || Math.round((r.score / r.total) * 100)))
        : 0;

    const streakDays = computeStreak(results);
    const topicPerformance = computeTopicPerformance(results);
    const badgeProgress = computeBadgeProgress({ results, streakDays, badges });

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#0a0814] relative overflow-hidden selection:bg-primary selection:text-white">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[140px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[160px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Header Profile Section */}
                <header className="relative mb-12 animate-reveal">
                    <div className="relative bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl flex flex-col md:flex-row md:items-center gap-10">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-[2rem] blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                            <div className="relative w-32 h-32 rounded-[2rem] bg-black/40 border border-white/10 flex items-center justify-center text-4xl shadow-inner overflow-hidden">
                                <User size={48} className="text-gray-400 group-hover:text-white transition-colors" />
                                <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-tl-xl border-t border-l border-white/20">
                                    <BadgeCheck size={16} className="text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">Senior Engineer</span>
                                <span className="text-gray-600 font-mono text-xs tracking-widest uppercase">Lvl 42</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                {user?.username || "Guest User"}
                            </h1>
                            <div className="flex flex-wrap gap-6 mt-6">
                                <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-[10px] font-mono">
                                    <Flame size={14} className="animate-pulse" />
                                    <span>{streakDays} Day Continuous Sync</span>
                                </div>
                                <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-[10px] font-mono">
                                    <Zap size={14} />
                                    <span>1,240 XP Gained</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-black/20 p-2 rounded-2xl border border-white/5">
                            <div className="px-6 py-4 rounded-xl bg-white/5 border border-white/5 text-center min-w-[100px]">
                                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Rank</div>
                                <div className="text-xl font-black text-white">#12</div>
                            </div>
                            <div className="px-6 py-4 rounded-xl bg-primary/10 border border-primary/10 text-center min-w-[100px]">
                                <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">Percentile</div>
                                <div className="text-xl font-black text-white">Top 4%</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Left Column: Stats & Performance */}
                    <div className="lg:col-span-8 space-y-10 animate-reveal [animation-delay:100ms]">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <QuickStat icon={<Target className="text-primary" />} label="Quizzes Executed" value={loading ? "..." : String(totalQuizzes)} />
                            <QuickStat icon={<Activity className="text-secondary" />} label="Logic Accuracy" value={loading ? "..." : `${accuracy}%`} />
                            <QuickStat icon={<Trophy className="text-yellow-500" />} label="Peak Precision" value={loading ? "..." : `${bestPercentage}%`} />
                        </div>

                        {/* Analysis Hub */}
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-10 text-white/5 pointer-events-none">
                                <Radar size={120} strokeWidth={1} />
                            </div>
                            
                            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                                <BarChart size={24} className="text-primary" />
                                Domain Proficiency
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {loading ? (
                                    Array(2).fill(0).map((_, i) => (
                                        <div key={i} className="space-y-4">
                                            <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse" />
                                            <div className="h-2 w-full bg-white/5 rounded-full animate-pulse" />
                                        </div>
                                    ))
                                ) : topicPerformance.length > 0 ? (
                                    topicPerformance.slice(0, 6).map((t, idx) => (
                                        <div key={`${t.categoryId}-${t.topicId}`} className="space-y-3 group">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{getCategoryName(t.categoryId)}</div>
                                                    <div className="text-white font-bold group-hover:text-primary transition-colors">{getTopicName(t.categoryId, t.topicId)}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-black text-white">{t.avg}%</div>
                                                    <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{t.count} Missions</div>
                                                </div>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div 
                                                    className="h-full bg-primary shadow-[0_0_10px_rgba(108,93,211,0.3)] transition-all duration-1000" 
                                                    style={{ width: `${t.avg}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center bg-black/20 border border-white/5 border-dashed rounded-[2rem]">
                                        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">No Domain Data Analyzed</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Activity Logs */}
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <History size={24} className="text-secondary" />
                                    Mission Logs
                                </h2>
                                <button className="text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-2">
                                    View Full Archive <ExternalLink size={12} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="h-20 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
                                    ))
                                ) : results.length > 0 ? (
                                    results.slice(0, 5).map((result) => (
                                        <div
                                            key={result._id}
                                            className="group flex items-center justify-between bg-white/5 border border-white/5 rounded-[1.5rem] p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <Cpu size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold group-hover:text-primary transition-colors">
                                                        {getCategoryName(result.categoryId)} <span className="text-gray-600 mx-2">/</span> {getTopicName(result.categoryId, result.topicId)}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Score: {result.score}/{result.total}</div>
                                                        <div className="w-1 h-1 rounded-full bg-gray-800" />
                                                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{formatDate(result.createdAt)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-xl font-black ${Math.round((result.score / result.total) * 100) >= 80 ? 'text-secondary' : 'text-white/60'}`}>
                                                    {Math.round((result.score / result.total) * 100)}%
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-10 text-gray-600 font-mono text-xs uppercase tracking-widest">Empty Signal - No Missions Detected</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Achievements & Badges */}
                    <aside className="lg:col-span-4 space-y-10 animate-reveal [animation-delay:200ms]">
                        {/* Badges Section */}
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-10 text-yellow-500/5 group-hover:text-yellow-500/10 transition-colors pointer-events-none">
                                <Award size={100} strokeWidth={1} />
                            </div>
                            
                            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                                <Award size={24} className="text-yellow-500" />
                                Core Badges
                            </h2>

                            <div className="space-y-6">
                                {badgeProgress.map((b) => (
                                    <div key={b.id} className="relative group/badge">
                                        <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${b.completed ? 'bg-secondary/10 border-secondary/30' : 'bg-white/5 border-white/10'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${b.completed ? 'bg-secondary/20 text-secondary' : 'bg-black/20 text-gray-700'}`}>
                                                        {b.completed ? <Star fill="currentColor" size={24} /> : <Zap size={24} />}
                                                    </div>
                                                    <div>
                                                        <div className={`font-black tracking-tight ${b.completed ? 'text-white' : 'text-gray-500'}`}>{b.title}</div>
                                                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{b.subtitle}</div>
                                                    </div>
                                                </div>
                                                {b.completed && <BadgeCheck size={20} className="text-secondary" />}
                                            </div>
                                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${b.completed ? 'bg-secondary' : 'bg-primary/40'}`}
                                                    style={{ width: `${Math.round(b.progress * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-10 pt-8 border-t border-white/5">
                                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">Legacy Artifacts</h3>
                                {badges.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {badges.slice(0, 4).map((b, i) => (
                                            <div key={i} className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-2xl group/legacy">
                                                <div className="text-3xl mb-2 grayscale group-hover/legacy:grayscale-0 transition-all duration-500 group-hover/legacy:scale-110">{b.badges?.icon || '🏅'}</div>
                                                <div className="text-[10px] font-bold text-white text-center uppercase tracking-widest truncate w-full">{b.badges?.name || b.badge_id}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest text-center py-4">No Legacy Artifacts Found</p>
                                )}
                            </div>
                        </div>

                        {/* System Status / Promotion */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative bg-[#0d0b1a] border border-white/5 rounded-[3rem] p-10 overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 text-primary/10">
                                    <Radar size={80} strokeWidth={4} />
                                </div>
                                <h3 className="text-xl font-black text-white mb-4 relative z-10">Next Evolution</h3>
                                <p className="text-gray-400 text-sm mb-8 leading-relaxed relative z-10">
                                    Unlock 5 more modules to achieve <span className="text-white font-black">Lead Architect</span> status.
                                </p>
                                <button
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 relative z-10"
                                >
                                    <span>Sync Skills</span>
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

function QuickStat({ icon, label, value }) {
    return (
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center text-center group hover:bg-white/10 hover:border-white/20 transition-all">
            <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                {icon}
            </div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-2xl font-black text-white">{value}</div>
        </div>
    );
}

function getCategoryName(categoryId) {
    return categories.find((c) => c.id === categoryId)?.name || categoryId;
}

function getTopicName(categoryId, topicId) {
    return topicsByCategory[categoryId]?.find((t) => t.id === topicId)?.name || topicId;
}

function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function computeStreak(results) {
    if (!results || results.length === 0) return 0;
    const days = new Set(
        results
            .map((r) => new Date(r.createdAt))
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

function computeTopicPerformance(results) {
    const map = new Map();
    for (const r of results) {
        const key = `${r.category_id || r.categoryId}|${r.topic_id || r.topicId}`;
        const categoryId = r.category_id || r.categoryId;
        const topicId = r.topic_id || r.topicId;
        const percentage = r.percentage || Math.round((r.score / r.total) * 100);
        const current = map.get(key) || { categoryId, topicId, total: 0, count: 0 };
        current.total += percentage;
        current.count += 1;
        map.set(key, current);
    }
    return Array.from(map.values())
        .map((t) => ({ ...t, avg: Math.round(t.total / t.count) }))
        .sort((a, b) => b.avg - a.avg);
}

function computeBadgeProgress({ results, streakDays, badges }) {
    const earned = new Set((badges || []).map((b) => b.badge_id));
    const totalQuizzes = results.length;
    const perfectCount = results.filter((r) => {
        const percentage = r.percentage ?? Math.round((r.score / r.total) * 100);
        return percentage === 100;
    }).length;

    const definitions = [
        {
            id: 'first_quiz',
            title: 'First Contact',
            subtitle: `${Math.min(totalQuizzes, 1)}/1 executed`,
            progress: Math.min(totalQuizzes / 1, 1),
        },
        {
            id: 'perfect_score',
            title: 'Absolute Zero',
            subtitle: `${Math.min(perfectCount, 1)}/1 precision`,
            progress: Math.min(perfectCount / 1, 1),
        },
        {
            id: 'hot_streak_3',
            title: 'Stability Phase',
            subtitle: `${Math.min(streakDays, 3)}/3 day core`,
            progress: Math.min(streakDays / 3, 1),
        },
    ];

    return definitions.map((d) => ({
        ...d,
        completed: earned.has(d.id),
        progress: earned.has(d.id) ? 1 : d.progress,
        subtitle: earned.has(d.id) ? 'Objective Secured' : d.subtitle,
    }));
}
