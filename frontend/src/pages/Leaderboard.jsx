import React, { useEffect, useMemo, useState } from 'react';
import { fetchLeaderboard, fetchMetadata } from '../services/api';
import { categories as displayCategories, topicsByCategory as displayTopics } from '../data/quizMetaData';
import { useAuth } from '../context/AuthContext';
import { 
    Trophy, 
    Star, 
    Crown, 
    Filter, 
    Download, 
    Search, 
    User, 
    Globe, 
    Activity,
    ChevronDown,
    ChevronRight,
    FileJson,
    FileSpreadsheet,
    Loader2,
    ShieldAlert,
    Timer,
    Zap
} from 'lucide-react';

const timeTabs = [
    { label: 'All Time', value: 'all' },
    { label: 'Weekly', value: '7' },
    { label: 'Monthly', value: '30' },
];

const Leaderboard = () => {
    const { user } = useAuth();
    const [categoryId, setCategoryId] = useState('');
    const [topicId, setTopicId] = useState('');
    const [timeFilter, setTimeFilter] = useState('all');
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [availableTopics, setAvailableTopics] = useState([]);

    useEffect(() => {
        const loadTopics = async () => {
            try {
                const meta = await fetchMetadata();
                const backendTopics = meta.topicsByCategory?.[categoryId] || [];
                const merged = backendTopics.map((t) => {
                    const display = displayTopics[categoryId]?.find((d) => d.id === t.topicId);
                    return display || { id: t.topicId, name: t.topicId };
                });
                setAvailableTopics(merged);
            } catch (e) {
                console.error("Failed to fetch topics metadata");
            }
        };
        if (categoryId) loadTopics();
        else setAvailableTopics([]);
    }, [categoryId]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const since = timeFilter === 'all' 
                    ? null 
                    : new Date(Date.now() - Number(timeFilter) * 24 * 60 * 60 * 1000).toISOString();
                const data = await fetchLeaderboard({ categoryId, topicId, since });
                setRows(data);
            } catch (e) {
                setError('Failed to establish connection to global rankings.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [categoryId, topicId, timeFilter]);

    const userRank = useMemo(() => {
        if (!user?.id || rows.length === 0) return null;
        const idx = rows.findIndex((r) => r.user_id === user.id);
        if (idx === -1) return null;
        return idx + 1;
    }, [rows, user?.id]);

    const exportJson = () => {
        const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devquiz_leaderboard_${categoryId || 'all'}_${topicId || 'all'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportCsv = () => {
        const headers = ['rank', 'username', 'user_id', 'category_id', 'topic_id', 'avg_percentage', 'total_score'];
        const csvRows = [
            headers.join(','),
            ...rows.map((r, idx) => ([
                idx + 1,
                r.username || 'User',
                r.user_id,
                r.category_id,
                r.topic_id,
                r.avg_percentage,
                r.total_score,
            ].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')))
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devquiz_leaderboard_${categoryId || 'all'}_${topicId || 'all'}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#0a0814] relative overflow-hidden selection:bg-primary selection:text-white">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[140px] -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[160px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                
                {/* Header Section */}
                <div className="relative mb-12 animate-reveal">
                    <div className="relative bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="w-24 h-24 shrink-0 rounded-[2.5rem] bg-black/40 border border-white/10 flex items-center justify-center shadow-inner group transition-all duration-700">
                                <Globe size={40} className="text-secondary animate-pulse" />
                            </div>
                            <div className="space-y-4 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <span className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">Global Network</span>
                                    <span className="text-gray-600 font-mono text-xs tracking-widest uppercase">{rows.length} Active Profiles</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                                    Ranking <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500 opacity-50">Protocol</span>
                                </h1>
                            </div>
                        </div>

                        {userRank && (
                            <div className="flex flex-col items-center md:items-end gap-3 min-w-[200px] p-6 bg-primary/10 rounded-[2rem] border border-primary/20 shadow-[0_0_30px_rgba(108,93,211,0.1)]">
                                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">Your Tactical Standings</div>
                                <div className="text-4xl font-black text-white flex items-baseline gap-2">
                                    <span className="text-primary text-2xl">#</span>{userRank}
                                </div>
                                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Global Percentile: Top {( (userRank / rows.length) * 100).toFixed(1)}%</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Filters & Export */}
                    <div className="lg:col-span-12 flex flex-wrap items-center justify-between gap-6 animate-reveal [animation-delay:100ms]">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                                {timeTabs.map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() => setTimeFilter(tab.value)}
                                        className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${timeFilter === tab.value ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-1.5 backdrop-blur-xl">
                                <Filter size={16} className="text-gray-500" />
                                <select
                                    className="bg-transparent text-white text-xs font-bold uppercase tracking-widest focus:outline-none appearance-none cursor-pointer pr-4"
                                    value={categoryId}
                                    onChange={(e) => { setCategoryId(e.target.value); setTopicId(''); }}
                                >
                                    <option value="" className="bg-[#0a0814]">All Sectors</option>
                                    {displayCategories.map((c) => (
                                        <option key={c.id} value={c.id} className="bg-[#0a0814]">{c.name}</option>
                                    ))}
                                </select>
                                <div className="w-[1px] h-4 bg-white/10 mx-2" />
                                <select
                                    className={`bg-transparent text-white text-xs font-bold uppercase tracking-widest focus:outline-none appearance-none cursor-pointer pr-4 ${!categoryId ? 'opacity-30 pointer-events-none' : ''}`}
                                    value={topicId}
                                    onChange={(e) => setTopicId(e.target.value)}
                                    disabled={!categoryId}
                                >
                                    <option value="" className="bg-[#0a0814]">All Objectives</option>
                                    {availableTopics.map((t) => (
                                        <option key={t.id} value={t.id} className="bg-[#0a0814]">{t.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="text-gray-500 ml-1" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={exportCsv}
                                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-gray-500 hover:text-white hover:border-white/20 transition-all text-[10px] font-mono font-bold uppercase tracking-widest group"
                            >
                                <FileSpreadsheet size={16} className="group-hover:scale-110 transition-transform" />
                                <span>Export CSV</span>
                            </button>
                            <button
                                onClick={exportJson}
                                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-gray-500 hover:text-white hover:border-white/20 transition-all text-[10px] font-mono font-bold uppercase tracking-widest group"
                            >
                                <FileJson size={16} className="group-hover:scale-110 transition-transform" />
                                <span>Export JSON</span>
                            </button>
                        </div>
                    </div>

                    {/* Leaderboard Table */}
                    <div className="lg:col-span-12 animate-reveal [animation-delay:200ms]">
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl relative">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-10 py-6 border-b border-white/10 bg-white/[0.02] text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">
                                <div className="col-span-1">Rank</div>
                                <div className="col-span-5 md:col-span-6">Engineer</div>
                                <div className="col-span-3 md:col-span-3 text-right">Technical Sector</div>
                                <div className="col-span-3 md:col-span-2 text-right">Mastery Rating</div>
                            </div>

                            <div className="max-h-[800px] overflow-y-auto no-scrollbar pb-10">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <div key={i} className="px-10 py-8 border-b border-white/5 flex items-center gap-10">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl animate-pulse" />
                                            <div className="flex-1 space-y-3">
                                                <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse" />
                                                <div className="h-2 w-full bg-white/5 rounded-full animate-pulse" />
                                            </div>
                                        </div>
                                    ))
                                ) : error ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6">
                                            <ShieldAlert size={32} />
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Signal Interrupted</h3>
                                        <p className="text-gray-500 text-sm max-w-xs">{error}</p>
                                    </div>
                                ) : rows.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mb-6">
                                            <Search size={32} />
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">No Results Found</h3>
                                        <p className="text-gray-500 text-sm max-w-xs">Try adjusting your filters to broaden the search parameters.</p>
                                    </div>
                                ) : (
                                    rows.slice(0, 50).map((r, idx) => {
                                        const isCurrentUser = r.user_id === user?.id;
                                        const rank = idx + 1;
                                        return (
                                            <div
                                                key={`${r.user_id}-${r.category_id}-${r.topic_id}-${idx}`}
                                                className={`grid grid-cols-12 gap-4 px-10 py-6 items-center border-b border-white/5 transition-all group hover:bg-white/[0.03]
                                                    ${isCurrentUser ? 'bg-primary/10 border-primary/20 relative z-10 shadow-[0_0_30px_rgba(108,93,211,0.1)]' : ''}
                                                `}
                                            >
                                                <div className="col-span-1 flex items-center">
                                                    {rank === 1 ? (
                                                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                                            <Crown size={16} />
                                                        </div>
                                                    ) : rank === 2 ? (
                                                        <div className="w-8 h-8 rounded-lg bg-gray-300/20 border border-gray-300/40 flex items-center justify-center text-gray-300 shadow-[0_0_15px_rgba(209,213,219,0.2)]">
                                                            <Trophy size={16} />
                                                        </div>
                                                    ) : rank === 3 ? (
                                                        <div className="w-8 h-8 rounded-lg bg-orange-400/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.2)]">
                                                            <Trophy size={16} />
                                                        </div>
                                                    ) : (
                                                        <span className="text-xl font-black text-gray-700 font-mono group-hover:text-white/40 transition-colors pl-1">
                                                            {rank < 10 ? `0${rank}` : rank}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="col-span-5 md:col-span-6 flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform
                                                        ${isCurrentUser ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-black/40 border-white/10 text-gray-500'}
                                                    `}>
                                                        <User size={20} />
                                                    </div>
                                                    <div className="truncate">
                                                        <div className="text-white font-black tracking-tight group-hover:text-primary transition-colors flex items-center gap-2">
                                                            <span>{r.username || 'Anonymous Engineer'}</span>
                                                            {isCurrentUser && <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[8px] font-black uppercase tracking-widest">You</span>}
                                                        </div>
                                                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">Profile UID: {r.user_id.slice(0, 8)}...</div>
                                                    </div>
                                                </div>

                                                <div className="col-span-3 md:col-span-3 text-right">
                                                    <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest truncate">{r.category_id || 'Global'}</div>
                                                    <div className="text-xs font-bold text-gray-600 truncate">{r.topic_id || 'Special Ops'}</div>
                                                </div>

                                                <div className="col-span-3 md:col-span-2 text-right space-y-1">
                                                    <div className={`text-2xl font-black  ${rank <= 3 ? 'text-secondary font-glow' : 'text-white'}`}>
                                                        {r.avg_percentage}%
                                                    </div>
                                                    <div className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest">{r.total_score} Total Pts</div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Meta stats footer */}
                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-reveal [animation-delay:300ms]">
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                                    <Timer size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Time Sync</div>
                                    <div className="text-white font-black uppercase tracking-widest">Real-Time</div>
                                </div>
                            </div>
                            <Activity size={24} className="text-secondary opacity-50 animate-pulse" />
                        </div>
                        
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Total XP Moved</div>
                                    <div className="text-white font-black uppercase tracking-widest">14.2M</div>
                                </div>
                            </div>
                        </div>

                         <div className="bg-white/5 border border-white/5 rounded-3xl p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                    <Crown size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Top Sector</div>
                                    <div className="text-white font-black uppercase tracking-widest">Backend Ops</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .font-glow { text-shadow: 0 0 15px rgba(108,93,211,0.5); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default Leaderboard;
