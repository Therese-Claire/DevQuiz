import React from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    CheckCircle2, 
    Activity, 
    Calendar, 
    ArrowUpRight, 
    ArrowDownRight,
    Download,
    Filter,
    Clock,
    Zap,
    Cpu
} from 'lucide-react';

const AnalyticsDashboard = ({
    analytics,
    analyticsLoading,
    analyticsRange,
    setAnalyticsRange,
    analyticsCategory,
    setAnalyticsCategory,
    analyticsTopic,
    setAnalyticsTopic,
    categories,
    availableTopics,
    exportAnalyticsCsv
}) => {
    return (
        <div className="space-y-10 animate-reveal">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <BarChart3 size={24} className="text-secondary" />
                        Command Intel
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Real-time performance metrics and user engagement telemetry.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 backdrop-blur-xl">
                        {[
                            { label: '7D', value: '7' },
                            { label: '30D', value: '30' },
                            { label: '90D', value: '90' },
                            { label: 'ALL', value: 'all' }
                        ].map((range) => (
                            <button
                                key={range.value}
                                onClick={() => setAnalyticsRange(range.value)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                                    ${analyticsRange === range.value ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-gray-500 hover:text-white'}`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                    icon={<Users size={20} />} 
                    label="Active Agents" 
                    value={analytics.reduce((acc, r) => acc + r.active_users, 0)} 
                    trend="+12%" 
                    isUp={true}
                    color="text-primary"
                />
                <KPICard 
                    icon={<CheckCircle2 size={20} />} 
                    label="Missions Completed" 
                    value={analytics.reduce((acc, r) => acc + r.quiz_completions, 0)} 
                    trend="+5%" 
                    isUp={true}
                    color="text-secondary"
                />
                <KPICard 
                    icon={<Activity size={20} />} 
                    label="Avg Accuracy" 
                    value="78.4%" 
                    trend="-2%" 
                    isUp={false}
                    color="text-orange-500"
                />
                <KPICard 
                    icon={<Zap size={20} />} 
                    label="XP Generated" 
                    value="1.2M" 
                    trend="+24%" 
                    isUp={true}
                    color="text-yellow-500"
                />
            </div>

            {/* Main Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 text-secondary/5 pointer-events-none group-hover:text-secondary/10 transition-colors">
                        <TrendingUp size={100} strokeWidth={1} />
                    </div>
                    
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Mission Completion Velocity</h3>
                        <button 
                            onClick={() => exportAnalyticsCsv(analytics)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-500 hover:text-white hover:border-white/20 transition-all text-[10px] font-bold uppercase tracking-widest"
                        >
                            <Download size={14} />
                            <span>Export Telemetry</span>
                        </button>
                    </div>

                    <div className="h-[300px] flex items-end justify-between gap-2 relative z-10">
                         {analyticsLoading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <Activity size={40} className="text-secondary animate-pulse opacity-20" />
                            </div>
                         ) : analytics.length === 0 ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center opacity-30">
                                <Clock size={40} className="mb-4" />
                                <p className="text-[10px] font-mono uppercase tracking-widest">Awaiting Signal Data...</p>
                            </div>
                         ) : (
                            analytics.map((r, i) => (
                                <div key={i} className="flex-grow flex flex-col items-center group/bar">
                                    <div 
                                        className="w-full max-w-[40px] bg-secondary/20 border-t border-secondary/40 rounded-t-lg transition-all duration-700 hover:bg-secondary/40 hover:shadow-[0_0_20px_rgba(108,93,211,0.2)] relative"
                                        style={{ height: `${r.completionsPct}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-secondary text-white text-[8px] font-black px-2 py-1 rounded-md whitespace-nowrap">
                                            {r.quiz_completions} Comps
                                        </div>
                                    </div>
                                    <div className="mt-4 text-[8px] font-mono text-gray-600 uppercase tracking-widest rotate-45 origin-left">{r.day.slice(5)}</div>
                                </div>
                            ))
                         )}
                    </div>
                </div>

                <div className="lg:col-span-4 bg-[#0d0b1a] border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-black text-white mb-8 border-b border-white/5 pb-6 flex items-center gap-2">
                            <Filter size={18} className="text-primary" />
                            Sector Filtering
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-gray-600 uppercase tracking-widest pl-2">Parent Sector</label>
                                <select 
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                                    value={analyticsCategory}
                                    onChange={(e) => { setAnalyticsCategory(e.target.value); setAnalyticsTopic(''); }}
                                >
                                    <option value="" className="bg-[#0a0814]">Global Matrix</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id} className="bg-[#0a0814]">{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-gray-600 uppercase tracking-widest pl-2">Objective Node</label>
                                <select 
                                    className={`w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-secondary/50 transition-all appearance-none cursor-pointer ${!analyticsCategory ? 'opacity-30 pointer-events-none' : ''}`}
                                    value={analyticsTopic}
                                    onChange={(e) => setAnalyticsTopic(e.target.value)}
                                    disabled={!analyticsCategory}
                                >
                                    <option value="" className="bg-[#0a0814]">All Area Nodes</option>
                                    {availableTopics.filter(t => t.category_id === analyticsCategory).map((t) => (
                                        <option key={t.id} value={t.id} className="bg-[#0a0814]">{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-primary/10 border border-primary/20 rounded-3xl relative overflow-hidden group/status">
                         <div className="absolute top-0 right-0 p-4 text-primary/10 group-hover/status:scale-110 transition-transform">
                            <Cpu size={40} />
                         </div>
                         <h4 className="text-sm font-black text-white mb-2 relative z-10">AI Deployment</h4>
                         <p className="text-[10px] text-gray-400 leading-relaxed mb-6 relative z-10">
                            Neural analysis suggests increasing <span className="text-primary font-bold">Backend Ops</span> difficulty nodes.
                         </p>
                         <button className="w-full py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20 relative z-10">
                            Sync Strategy
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function KPICard({ icon, label, value, trend, isUp, color }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative group hover:border-white/20 transition-all">
            <div className={`w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center mb-6 ${color} shadow-inner group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                <div className="flex items-end justify-between">
                    <h4 className="text-3xl font-black text-white">{value}</h4>
                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{trend}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsDashboard;
