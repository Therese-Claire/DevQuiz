import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { fetchMyResults, uploadAvatar, updateUsername } from "../services/api";
import { supabase } from "../services/supabase";
import { categories, topicsByCategory } from "../data/quizMetaData";
import { computeStreak, computeTopicPerformance } from "../utils/stats";
import {
    User, Trophy, Activity, Target, Flame, Award,
    History, BarChart, ChevronRight, Star, Clock,
    Zap, BadgeCheck, Radar, Camera, Pencil, Check,
    X, Loader2, LayoutDashboard, ExternalLink, Cpu,
    XCircle, CheckCircle2
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCategoryName(id) {
    return categories.find(c => c.id === id)?.name || id;
}

function getTopicName(catId, topId) {
    return topicsByCategory[catId]?.find(t => t.id === topId)?.name || topId;
}

function formatDate(value) {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-GB", {
        month: "short", day: "numeric", year: "numeric"
    });
}

function computeBadgeProgress({ results, streakDays, badges }) {
    const earned = new Set((badges || []).map(b => b.badge_id));
    const totalQuizzes = results.length;
    const perfectCount = results.filter(r => {
        const pct = r.percentage ?? (r.total > 0 ? Math.round((r.score / r.total) * 100) : 0);
        return pct === 100;
    }).length;

    const defs = [
        {
            id: "first_quiz",
            title: "First Contact",
            subtitle: `${Math.min(totalQuizzes, 1)}/1 executed`,
            progress: Math.min(totalQuizzes / 1, 1),
        },
        {
            id: "perfect_score",
            title: "Absolute Zero",
            subtitle: `${Math.min(perfectCount, 1)}/1 precision`,
            progress: Math.min(perfectCount / 1, 1),
        },
        {
            id: "hot_streak_3",
            title: "Stability Phase",
            subtitle: `${Math.min(streakDays, 3)}/3 day core`,
            progress: Math.min(streakDays / 3, 1),
        },
    ];

    return defs.map(d => ({
        ...d,
        completed: earned.has(d.id),
        progress: earned.has(d.id) ? 1 : d.progress,
        subtitle: earned.has(d.id) ? "Objective Secured" : d.subtitle,
    }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// ─── Avatar Upload Component ──────────────────────────────────────────────────

function AvatarUpload({ currentUrl, onUploaded }) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [err, setErr] = useState("");

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setErr("");
        setUploading(true);
        try {
            const url = await uploadAvatar(file);
            onUploaded(url);
        } catch (ex) {
            setErr(ex.message || "Upload failed.");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-[2rem] blur opacity-25 group-hover:opacity-75 transition duration-1000" />
            <div className="relative w-32 h-32 rounded-[2rem] bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                {currentUrl ? (
                    <img src={currentUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <User size={48} className="text-gray-400" />
                )}
                {/* Upload overlay */}
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
                    title="Change photo"
                >
                    {uploading
                        ? <Loader2 size={22} className="text-white animate-spin" />
                        : <Camera size={22} className="text-white" />
                    }
                    <span className="text-[10px] text-white font-mono uppercase tracking-widest">
                        {uploading ? "Uploading" : "Change"}
                    </span>
                </button>
                {/* Badge chip */}
                <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-tl-xl border-t border-l border-white/20">
                    <BadgeCheck size={16} className="text-white" />
                </div>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFile}
            />
            {err && (
                <div className="absolute top-full mt-2 left-0 right-0 text-center text-[10px] font-mono text-red-400 uppercase tracking-widest whitespace-nowrap">
                    {err}
                </div>
            )}
        </div>
    );
}

// ─── Username Edit ────────────────────────────────────────────────────────────

function UsernameEditor({ initialValue, onSaved }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");

    const handleSave = async () => {
        if (value.trim().length < 3) { setErr("Min 3 characters"); return; }
        setSaving(true); setErr("");
        try {
            await updateUsername(value.trim());
            onSaved(value.trim());
            setEditing(false);
        } catch (ex) {
            setErr(ex.message || "Save failed");
        } finally {
            setSaving(false);
        }
    };

    if (!editing) {
        return (
            <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{initialValue || "Engineer"}</h1>
                <button
                    onClick={() => { setValue(initialValue); setEditing(true); }}
                    className="p-2 rounded-xl text-gray-600 hover:text-white hover:bg-white/10 transition-all"
                    title="Edit username"
                >
                    <Pencil size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <input
                autoFocus
                value={value}
                maxLength={32}
                onChange={e => { setValue(e.target.value); setErr(""); }}
                onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
                className="text-2xl font-black bg-white/5 border border-primary/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary/30 w-48"
            />
            <button onClick={handleSave} disabled={saving} className="p-2 rounded-xl text-green-400 hover:bg-green-500/10 transition-all">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            </button>
            <button onClick={() => setEditing(false)} className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                <X size={16} />
            </button>
            {err && <span className="text-[10px] font-mono text-red-400 uppercase">{err}</span>}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAllLogs, setShowAllLogs] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadResults = async () => {
            try {
                setLoading(true);
                const data = await fetchMyResults();
                if (isMounted) { setResults(data.results || []); setError(""); }
            } catch {
                if (isMounted) setError("Failed to synchronize mission stats.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const loadBadges = async () => {
            const { data: { user: sessionUser } } = await supabase.auth.getUser();
            const userId = sessionUser?.id;
            if (!userId) return;
            const { data } = await supabase
                .from("user_badges")
                .select("badge_id, badges(name, description, icon)")
                .eq("user_id", userId);
            if (isMounted) setBadges(data || []);
        };

        loadResults();
        loadBadges();
        return () => { isMounted = false; };
    }, []);

    // ── Computed values ────────────────────────────────────────────
    const totalQuizzes = results.length;
    const totalScore = results.reduce((acc, r) => acc + (r.score || 0), 0);
    const totalQuestions = results.reduce((acc, r) => acc + (r.total || 0), 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    const bestPercentage = results.length > 0
        ? Math.max(...results.map(r => r.percentage ?? (r.total > 0 ? Math.round((r.score / r.total) * 100) : 0)))
        : 0;
    const streakDays = computeStreak(results);
    const badgeProgress = computeBadgeProgress({ results, streakDays, badges });

    // Topic performance as array sorted by avg desc
    const topicPerfObj = useMemo(() => computeTopicPerformance(results), [results]);
    const topicPerformance = useMemo(() =>
        Object.values(topicPerfObj)
            .map(t => ({ ...t, avg: Math.round(t.scores.reduce((a, b) => a + b, 0) / t.scores.length) }))
            .sort((a, b) => b.avg - a.avg),
        [topicPerfObj]
    );

    const visibleResults = showAllLogs ? results : results.slice(0, 5);

    const handleAvatarUploaded = (url) => {
        updateProfile({ avatarUrl: url });
    };

    const handleUsernameSaved = (newName) => {
        updateProfile({ username: newName });
    };

    const tierColor = (pct) => {
        if (pct >= 80) return "bg-green-500";
        if (pct >= 50) return "bg-primary";
        return "bg-red-500/60";
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#0a0814] relative overflow-hidden selection:bg-primary selection:text-white">
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[140px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[160px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-10">

                {/* ── Profile Header ──────────────────────────────── */}
                <header className="relative mb-12 animate-reveal">
                    <div className="relative bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl flex flex-col md:flex-row md:items-center gap-10">

                        <AvatarUpload
                            currentUrl={user?.avatarUrl}
                            onUploaded={handleAvatarUploaded}
                        />

                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                                    {user?.isAdmin ? "System Admin" : "Engineer"}
                                </span>
                            </div>
                            <UsernameEditor
                                initialValue={user?.username}
                                onSaved={handleUsernameSaved}
                            />
                            <div className="flex flex-wrap gap-6 mt-6">
                                <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-[10px] font-mono">
                                    <Flame size={14} className="animate-pulse" />
                                    <span>{streakDays} Day Streak</span>
                                </div>
                                <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-[10px] font-mono">
                                    <Zap size={14} />
                                    <span>{(user?.totalScore || 0).toLocaleString()} XP Total</span>
                                </div>
                            </div>
                        </div>

                        {/* Live rank & percentile from context */}
                        <div className="flex items-center gap-4 bg-black/20 p-2 rounded-2xl border border-white/5">
                            <div className="px-6 py-4 rounded-xl bg-white/5 border border-white/5 text-center min-w-[100px]">
                                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Global Rank</div>
                                <div className="text-xl font-black text-white">
                                    {user?.rank ? `#${user.rank}` : "—"}
                                </div>
                            </div>
                            <div className="px-6 py-4 rounded-xl bg-primary/10 border border-primary/10 text-center min-w-[100px]">
                                <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">Percentile</div>
                                <div className="text-xl font-black text-white">
                                    {user?.percentile != null ? `Top ${Math.max(1, Math.round(100 - user.percentile))}%` : "—"}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* ── Left Column ─────────────────────────────── */}
                    <div className="lg:col-span-8 space-y-10 animate-reveal [animation-delay:100ms]">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <QuickStat icon={<Target className="text-primary" />} label="Quizzes" value={loading ? "…" : totalQuizzes} />
                            <QuickStat icon={<Activity className="text-secondary" />} label="Accuracy" value={loading ? "…" : `${accuracy}%`} />
                            <QuickStat icon={<Trophy className="text-yellow-500" />} label="Peak Score" value={loading ? "…" : `${bestPercentage}%`} />
                            <QuickStat icon={<CheckCircle2 className="text-green-500" />} label="Answered" value={loading ? "…" : totalQuestions} />
                        </div>

                        {/* Domain Proficiency */}
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
                                    Array(4).fill(0).map((_, i) => (
                                        <div key={i} className="space-y-4">
                                            <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse" />
                                            <div className="h-2 w-full bg-white/5 rounded-full animate-pulse" />
                                        </div>
                                    ))
                                ) : topicPerformance.length > 0 ? (
                                    topicPerformance.slice(0, 8).map(t => (
                                        <div key={`${t.categoryId}-${t.topicId}`} className="space-y-3 group">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                                                        {getCategoryName(t.categoryId)}
                                                    </div>
                                                    <div className="text-white font-bold group-hover:text-primary transition-colors">
                                                        {getTopicName(t.categoryId, t.topicId)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-black text-white">{t.avg}%</div>
                                                    <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{t.totalAttempts} Runs</div>
                                                </div>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className={`h-full ${tierColor(t.avg)} shadow-[0_0_10px_rgba(108,93,211,0.3)] transition-all duration-1000`}
                                                    style={{ width: `${t.avg}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center bg-black/20 border border-white/5 border-dashed rounded-[2rem]">
                                        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">No Domain Data — Execute Your First Mission</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mission Logs */}
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <History size={24} className="text-secondary" />
                                    Mission Logs
                                </h2>
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                    {results.length} total
                                </span>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="h-20 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
                                    ))
                                ) : results.length > 0 ? (
                                    <>
                                        {visibleResults.map((result) => {
                                            const pct = result.percentage ?? (result.total > 0 ? Math.round((result.score / result.total) * 100) : 0);
                                            return (
                                                <div
                                                    key={result.id}   // ← Fixed: was result._id
                                                    className="group flex items-center justify-between bg-white/5 border border-white/5 rounded-[1.5rem] p-6 hover:bg-white/10 hover:border-white/20 transition-all"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${pct >= 80 ? 'bg-green-500/10 border-green-500/20 text-green-400' : pct >= 50 ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                                            <Cpu size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-bold group-hover:text-primary transition-colors">
                                                                {getCategoryName(result.category_id)} <span className="text-gray-600 mx-2">/</span> {getTopicName(result.category_id, result.topic_id)}
                                                            </p>
                                                            <div className="flex items-center gap-4 mt-1">
                                                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                                                    {result.score}/{result.total} correct
                                                                </span>
                                                                <span className="w-1 h-1 rounded-full bg-gray-800" />
                                                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                                                    {formatDate(result.created_at)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`text-xl font-black ${pct >= 80 ? 'text-green-400' : pct >= 50 ? 'text-white/70' : 'text-red-400'}`}>
                                                        {pct}%
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {results.length > 5 && (
                                            <button
                                                onClick={() => setShowAllLogs(v => !v)}
                                                className="w-full flex items-center justify-center gap-2 py-4 text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-widest border border-white/5 rounded-[1.5rem] hover:bg-white/5 transition-all"
                                            >
                                                <ExternalLink size={12} />
                                                {showAllLogs ? "Collapse Logs" : `Show All ${results.length} Logs`}
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-center py-10 text-gray-600 font-mono text-xs uppercase tracking-widest">
                                        Empty Signal — No Missions Detected
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column ─────────────────────────────── */}
                    <aside className="lg:col-span-4 space-y-10 animate-reveal [animation-delay:200ms]">

                        {/* Badges */}
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 text-yellow-500/5 group-hover:text-yellow-500/10 transition-colors pointer-events-none">
                                <Award size={100} strokeWidth={1} />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                                <Award size={24} className="text-yellow-500" />
                                Core Badges
                            </h2>

                            <div className="space-y-6">
                                {badgeProgress.map(b => (
                                    <div key={b.id} className="relative">
                                        <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${b.completed ? "bg-secondary/10 border-secondary/30" : "bg-white/5 border-white/10"}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${b.completed ? "bg-secondary/20 text-secondary" : "bg-black/20 text-gray-700"}`}>
                                                        {b.completed ? <Star fill="currentColor" size={24} /> : <Zap size={24} />}
                                                    </div>
                                                    <div>
                                                        <div className={`font-black tracking-tight ${b.completed ? "text-white" : "text-gray-500"}`}>{b.title}</div>
                                                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{b.subtitle}</div>
                                                    </div>
                                                </div>
                                                {b.completed && <BadgeCheck size={20} className="text-secondary" />}
                                            </div>
                                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${b.completed ? "bg-secondary" : "bg-primary/40"}`}
                                                    style={{ width: `${Math.round(b.progress * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Legacy Artifacts from DB */}
                            {badges.length > 0 && (
                                <div className="mt-10 pt-8 border-t border-white/5">
                                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">Legacy Artifacts</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {badges.map((b, i) => (
                                            <div key={i} className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-2xl group/legacy">
                                                <div className="text-3xl mb-2 grayscale group-hover/legacy:grayscale-0 transition-all duration-500 group-hover/legacy:scale-110">
                                                    {b.badges?.icon || "🏅"}
                                                </div>
                                                <div className="text-[10px] font-bold text-white text-center uppercase tracking-widest truncate w-full">
                                                    {b.badges?.name || b.badge_id}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                            <div className="relative bg-[#0d0b1a] border border-white/5 rounded-[3rem] p-10 overflow-hidden space-y-4">
                                <div className="absolute top-0 right-0 p-8 text-primary/10">
                                    <Radar size={80} strokeWidth={4} />
                                </div>
                                <h3 className="text-xl font-black text-white relative z-10">Quick Actions</h3>
                                <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                                    Keep your profile sharp. Head to the Command Center to start a new training mission.
                                </p>
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 relative z-10"
                                >
                                    <LayoutDashboard size={18} />
                                    <span>Command Center</span>
                                </button>
                                <button
                                    onClick={() => navigate("/leaderboard")}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all relative z-10"
                                >
                                    <Trophy size={18} />
                                    <span>View Leaderboard</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
