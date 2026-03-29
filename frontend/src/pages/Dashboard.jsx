import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories as displayCategories } from '../data/quizMetaData';
import { fetchMetadata, fetchQuizSets } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    BookOpen, 
    Trophy, 
    Target, 
    Flame, 
    ArrowRight, 
    Zap, 
    Code, 
    Palette, 
    Terminal, 
    ShieldCheck, 
    RefreshCw, 
    Layers,
    ChevronRight,
    Star,
    Clock,
    Activity,
    Loader2,
    Search
} from 'lucide-react';

const categoryIconMap = {
    html: <Code className="text-orange-400" size={24} />,
    css: <Palette className="text-blue-400" size={24} />,
    js: <Zap className="text-yellow-400" size={24} />,
    python: <Terminal className="text-green-400" size={24} />,
    software: <ShieldCheck className="text-purple-400" size={24} />,
    agile: <RefreshCw className="text-cyan-400" size={24} />,
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [quizSets, setQuizSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [setsLoading, setSetsLoading] = useState(true);
    const [error, setError] = useState('');
    const [setsError, setSetsError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        let isMounted = true;
        const loadMetadata = async () => {
            try {
                setLoading(true);
                const data = await fetchMetadata();
                const merged = (data.categories || []).map((c) => {
                    const display = displayCategories.find((d) => d.id === c.categoryId);
                    return {
                        id: c.categoryId,
                        name: display?.name || c.categoryId,
                        description: display?.description || 'Deep dive into ' + c.categoryId,
                        icon: categoryIconMap[c.categoryId] || <Layers size={24} />,
                    };
                });
                if (isMounted) {
                    setCategories(merged);
                    setError('');
                }
            } catch (err) {
                if (isMounted) setError('Failed to load mission parameters.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const loadQuizSets = async () => {
            try {
                setSetsLoading(true);
                const data = await fetchQuizSets();
                if (isMounted) {
                    setQuizSets(data || []);
                    setSetsError('');
                }
            } catch (err) {
                if (isMounted) setSetsError('Failed to load tactical sets.');
            } finally {
                if (isMounted) setSetsLoading(false);
            }
        };

        loadMetadata();
        loadQuizSets();
        return () => { isMounted = false; };
    }, []);

    const filteredCategories = useMemo(() => {
        return categories.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categories, searchQuery]);

    const featuredSet = useMemo(() => quizSets[0], [quizSets]);

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#0a0814] relative overflow-hidden selection:bg-primary selection:text-white">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[140px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[160px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-reveal">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit text-gray-500 text-[10px] font-mono tracking-widest uppercase">
                            <Activity size={10} className="text-secondary animate-pulse" />
                            <span>System Operational</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">Center</span>
                        </h1>
                        <p className="text-gray-400 font-medium">
                            Welcome back, <span className="text-white font-bold">{user?.username || 'Engineer'}</span>. Syncing your progress...
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
                        <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-xl border border-white/5">
                            <Flame size={16} className="text-orange-500" />
                            <span className="text-white font-bold text-sm">3 Day Streak</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-xl border border-white/5">
                            <Trophy size={16} className="text-yellow-500" />
                            <span className="text-white font-bold text-sm">1,240 XP</span>
                        </div>
                    </div>
                </header>

                {/* Search & Stats Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12 animate-reveal [animation-delay:100ms]">
                    <div className="lg:col-span-3 relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                            <Search size={20} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Find a module (e.g. JavaScript, Python, Architecture...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-600 font-medium"
                        />
                    </div>
                    <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-0.5 shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all group overflow-hidden">
                        <button 
                            onClick={() => navigate('/leaderboard')}
                            className="w-full h-full bg-[#0a0814]/90 rounded-[14px] px-6 py-4 flex items-center justify-between group-hover:bg-transparent transition-colors"
                        >
                            <div className="text-left">
                                <div className="text-white font-black text-xl">Top 5%</div>
                                <div className="text-gray-400 text-[10px] uppercase font-mono tracking-wider group-hover:text-white/80">Global Rank</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                                <Trophy size={20} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Left Column: Modules */}
                    <div className="lg:col-span-8 space-y-10 animate-reveal [animation-delay:200ms]">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                        <Layers size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">Active Modules</h2>
                                </div>
                                <div className="text-xs font-mono text-gray-600 uppercase tracking-widest">{filteredCategories.length} available</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {loading ? (
                                    Array(4).fill(0).map((_, i) => (
                                        <div key={i} className="h-44 bg-white/5 border border-white/10 rounded-[2rem] animate-pulse" />
                                    ))
                                ) : filteredCategories.length > 0 ? (
                                    filteredCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => navigate(`/category/${cat.id}`)}
                                            className="group relative p-8 rounded-[2rem] border bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-500 text-left overflow-hidden flex flex-col justify-between h-48 hover:-translate-y-1 shadow-sm hover:shadow-xl shadow-primary/5"
                                        >
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                                            
                                            <div className="relative z-10 flex items-start justify-between">
                                                <div className="w-14 h-14 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                                    {cat.icon}
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-500">
                                                    <ChevronRight size={16} className="text-white" />
                                                </div>
                                            </div>
                                            
                                            <div className="relative z-10">
                                                <h3 className="text-xl font-black text-white mb-2 tracking-tight">{cat.name}</h3>
                                                <p className="text-gray-500 text-sm font-medium line-clamp-1">{cat.description}</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-full py-16 text-center bg-white/5 border border-white/5 rounded-[2rem] border-dashed">
                                        <div className="text-gray-500 font-mono text-sm mb-2">&gt; No modules found matching the query</div>
                                        <button onClick={() => setSearchQuery('')} className="text-primary text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Reset Filter</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quiz Sets Sub-section */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-secondary/10 text-secondary border border-secondary/20">
                                        <Target size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">Tactical Sets</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {setsLoading ? (
                                    Array(2).fill(0).map((_, i) => (
                                        <div key={i} className="h-40 bg-white/5 border border-white/10 rounded-[2rem] animate-pulse" />
                                    ))
                                ) : quizSets.map((set) => (
                                    <button
                                        key={set.id}
                                        onClick={() => navigate(`/quiz-set/${set.id}`)}
                                        className="group p-6 rounded-[2rem] border bg-white/5 border-white/10 hover:border-secondary/20 transition-all duration-300 text-left hover:bg-white/10 flex items-center gap-5"
                                    >
                                        <div className="w-16 h-16 shrink-0 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                            <Star size={24} fill="currentColor" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-mono text-secondary uppercase tracking-[0.2em]">{set.difficulty}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{set.questions_count || 10} Tests</span>
                                            </div>
                                            <h3 className="text-lg font-black text-white">{set.name}</h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:border-white group-hover:bg-secondary/20 transition-all">
                                            <ArrowRight size={18} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Profile & Sidebar */}
                    <aside className="lg:col-span-4 space-y-10 animate-reveal [animation-delay:300ms]">
                        {/* Daily Challenge Card */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative bg-[#0d0b1a] border border-white/5 rounded-[2.5rem] p-10 overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 text-primary/10">
                                    <Star size={80} strokeWidth={4} />
                                </div>
                                <div className="relative z-10">
                                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest w-fit mb-6">
                                        Recommended
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-2 leading-tight">Master <br/>Backend Ops</h3>
                                    <p className="text-gray-400 mb-8 max-w-[200px] text-sm leading-relaxed">System design and scalability tests for senior engineers.</p>
                                    
                                    <button 
                                        onClick={() => featuredSet && navigate(`/quiz-set/${featuredSet.id}`)}
                                        className="flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white font-black rounded-2xl w-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                                    >
                                        <span>Begin Operation</span>
                                        <Zap size={18} fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Mini-Card */}
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                                <Clock size={20} className="text-gray-500" />
                                Upcoming Milestones
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'System Design Badge', progress: 85, color: 'bg-primary' },
                                    { label: 'Node.js Mastery', progress: 40, color: 'bg-secondary' },
                                    { label: 'DevOps Fundamental', progress: 15, color: 'bg-orange-500' },
                                ].map((item) => (
                                    <div key={item.label}>
                                        <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                                            <span>{item.label}</span>
                                            <span className="text-white">{item.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${item.color} shadow-[0_0_10px_rgba(108,93,211,0.3)] transition-all duration-1000`} 
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-3 text-xs font-mono text-gray-500 hover:text-white uppercase tracking-[0.2em] transition-colors">View All Progress &gt;</button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
