import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories as displayCategories, topicsByCategory as displayTopics } from '../data/quizMetaData';
import { fetchMetadata, fetchCounts, fetchCategoryStats, fetchTopicMastery } from '../services/api';
import { 
    ArrowLeft, 
    ChevronRight, 
    BookOpen, 
    Target, 
    Info, 
    Zap, 
    Code, 
    Palette, 
    Terminal, 
    ShieldCheck, 
    RefreshCw, 
    Layers,
    ListChecks,
    Activity,
    Clock,
    Trophy
} from 'lucide-react';

const categoryIconMap = {
    html: <Code className="text-orange-400" size={32} />,
    css: <Palette className="text-blue-400" size={32} />,
    js: <Zap className="text-yellow-400" size={32} />,
    python: <Terminal className="text-green-400" size={32} />,
    software: <ShieldCheck className="text-purple-400" size={32} />,
    agile: <RefreshCw className="text-cyan-400" size={32} />,
};

const CategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [categoryStats, setCategoryStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const category = useMemo(() => displayCategories.find(c => c.id === categoryId), [categoryId]);

    useEffect(() => {
        let isMounted = true;
        const loadCategoryData = async () => {
            try {
                setLoading(true);
                const [meta, countsResp, stats, mastery] = await Promise.all([
                    fetchMetadata(),
                    fetchCounts(categoryId),
                    fetchCategoryStats(categoryId),
                    fetchTopicMastery(categoryId)
                ]);

                const backendTopics = meta.topicsByCategory?.[categoryId] || [];
                const countsByTopic = (countsResp.counts || []).reduce((acc, t) => {
                    acc[t.topicId] = t.count;
                    return acc;
                }, {});

                const masteryMap = (mastery || []).reduce((acc, m) => {
                    acc[m.topic_id] = { bestScore: m.best_score, attempts: m.attempts };
                    return acc;
                }, {});

                const merged = backendTopics.map((t) => {
                    const display = displayTopics[categoryId]?.find((d) => d.id === t.topicId);
                    return display || {
                        id: t.topicId,
                        name: t.topicId,
                        description: 'Specialized deep dive module.',
                    };
                }).map((t) => ({
                    ...t,
                    count: countsByTopic[t.id] || 0,
                    mastery: masteryMap[t.id] || { bestScore: 0, attempts: 0 }
                }));

                if (isMounted) {
                    setTopics(merged);
                    setCategoryStats(stats);
                    setError('');
                }
            } catch (err) {
                console.error('Category data sync error:', err);
                if (isMounted) setError('Failed to synchronize mission telemetry.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        if (categoryId) loadCategoryData();
        return () => { isMounted = false; };
    }, [categoryId]);

    const avgScore = categoryStats?.avgScore || 0;
    const isHighVolatility = (categoryStats?.totalMissions || 0) < 5;

    if (!category) {
        return (
            <div className="min-h-screen bg-[#0a0814] flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 group hover:scale-110 transition-transform duration-500">
                    <Info size={40} />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Target Unreachable</h1>
                <p className="text-gray-500 mb-8 max-w-sm">The category parameter provided does not match our current systems metadata.</p>
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all font-bold"
                >
                    <ArrowLeft size={18} />
                    <span>Return to Command Center</span>
                </button>
            </div>
        );
    }

    const handleStartQuiz = (topicId) => {
        navigate(`/quiz/${categoryId}/${topicId}`);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#0a0814] relative overflow-hidden selection:bg-primary selection:text-white">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[140px] -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[160px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="group mb-12 flex items-center gap-3 text-gray-500 hover:text-white transition-all font-mono text-xs uppercase tracking-widest"
                >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span>Back to Command</span>
                </button>

                {/* Hero Header */}
                <div className="relative mb-20 animate-reveal">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-white/5 to-secondary/20 rounded-[3rem] blur-xl opacity-50" />
                    <div className="relative bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl flex flex-col md:flex-row md:items-center gap-10">
                        <div className="w-24 h-24 shrink-0 rounded-[2rem] bg-black/40 border border-white/10 flex items-center justify-center shadow-inner group transition-all duration-700">
                           {categoryIconMap[categoryId] || <Layers size={32} className="text-primary" />}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">Module Focus</span>
                                <span className="text-gray-600 font-mono text-xs tracking-widest">{topics.length} Tactical Objectives</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                                {category.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500 opacity-50">Intelligence</span>
                            </h1>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl font-medium">
                                {category.description} Deep dive into specialized sub-modules to sharpen your engineering edge.
                            </p>
                        </div>
                        <div className="hidden lg:flex flex-col gap-3 p-6 bg-black/20 rounded-3xl border border-white/5 min-w-[200px]">
                            <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                <span>Average Accuracy</span>
                                <span className="text-white">{avgScore}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary transition-all duration-1000 shadow-[0_0_10px_rgba(108,93,211,0.5)]" 
                                    style={{ width: `${avgScore}%` }}
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <Activity size={12} className={isHighVolatility ? "text-orange-400 animate-pulse" : "text-green-400"} />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                                    {isHighVolatility ? 'High Volatility' : 'System Stable'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Topic Selection */}
                    <div className="lg:col-span-8 space-y-8 animate-reveal [animation-delay:100ms]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-secondary/10 text-secondary border border-secondary/20">
                                <ListChecks size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Technical Objectives</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="h-48 bg-white/5 border border-white/10 rounded-[2.5rem] animate-pulse" />
                                ))
                            ) : topics.length > 0 ? (
                                topics.map((topic) => (
                                    <button
                                        key={topic.id}
                                        onClick={() => handleStartQuiz(topic.id)}
                                        className="group relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-secondary/30 transition-all duration-500 text-left overflow-hidden flex flex-col justify-between h-56 hover:-translate-y-1 shadow-sm hover:shadow-xl shadow-secondary/5"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-10 -mt-10 blur-3xl group-hover:bg-secondary/20 transition-all duration-700" />
                                        
                                        <div className="relative z-10 flex items-start justify-between">
                                            <div className="flex flex-col gap-2">
                                                <div className="px-3 py-1 rounded-full bg-black/40 border border-white/5 text-[9px] font-mono font-bold text-gray-400 group-hover:text-white transition-all w-fit">
                                                    {topic.count || 0} Questions
                                                </div>
                                                {topic.mastery?.bestScore > 0 && (
                                                    <div className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-[9px] font-mono font-bold text-secondary group-hover:bg-secondary/20 transition-all w-fit flex items-center gap-1">
                                                        <Trophy size={10} />
                                                        <span>Best: {topic.mastery.bestScore}%</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-500">
                                                <ChevronRight size={18} className="text-white" />
                                            </div>
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-secondary transition-colors">{topic.name}</h3>
                                            <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">{topic.description}</p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center bg-white/5 border border-white/5 rounded-[3rem] border-dashed">
                                    <div className="text-gray-500 font-mono text-sm mb-4 tracking-widest uppercase">Target parameters empty</div>
                                    <p className="text-gray-600 max-w-xs mx-auto text-sm">No tactical objectives have been assigned to this module yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mission Sidebar */}
                    <aside className="lg:col-span-4 space-y-10 animate-reveal [animation-delay:200ms]">
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 text-secondary/5 group-hover:text-secondary/10 transition-colors">
                                <Target size={80} />
                            </div>
                            
                            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                                <Info size={20} className="text-primary" />
                                Mission Prep
                            </h3>

                            {categoryStats?.latestResult && categoryStats.latestResult.score !== null && (
                                <div className="mb-8 p-6 bg-primary/5 border border-primary/20 rounded-3xl">
                                    <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-2">Latest Signal</div>
                                    <div className="flex items-end justify-between">
                                        <div className="text-3xl font-black text-white">{categoryStats.latestResult.score}%</div>
                                        <div className="text-[10px] font-mono text-gray-500">
                                            {categoryStats.latestResult.date ? new Date(categoryStats.latestResult.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${categoryStats.latestResult.score}%` }} />
                                    </div>
                                </div>
                            )}

                            <ul className="space-y-6">
                                {[
                                    { icon: <Clock size={16} />, text: 'Target 2 minutes per complex problem.' },
                                    { icon: <Activity size={16} />, text: 'Efficiency is tracked for leaderboard rank.' },
                                    { icon: <Trophy size={16} />, text: 'Unlocking 90%+ unlocks legacy badges.' }
                                ].map((tip, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="mt-1 text-gray-500">{tip.icon}</div>
                                        <p className="text-gray-400 text-sm font-medium leading-relaxed">{tip.text}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-primary rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative bg-[#0d0b1a] border border-white/5 rounded-[3rem] p-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                                        <BookOpen size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-white">Tac-Sets</h3>
                                </div>
                                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                    Feel like taking a broader challenge? Tactical sets combine multiple objectives into one mission.
                                </p>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    <span>Browse Sets</span>
                                    <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>

                {error && (
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest font-mono">
                            <Activity size={12} />
                            <span>Signal Lost: {error}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
