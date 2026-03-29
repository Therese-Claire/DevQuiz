import React from 'react';
import { 
    Flag, 
    ShieldAlert, 
    CheckCircle2, 
    History, 
    User, 
    Database, 
    ExternalLink, 
    Filter,
    Clock,
    AlertCircle,
    Archive,
    Trash2,
    Activity
} from 'lucide-react';

const ReportManager = ({
    reports,
    reportStatus,
    setReportStatus,
    reportRange,
    setReportRange,
    handleResolveReport, // This would be the supabase update logic
    loading
}) => {
    return (
        <div className="space-y-10 animate-reveal">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <Flag size={24} className="text-red-500" />
                        Signal Feedback
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Investigate and resolve mission logic discrepencies reported by field engineers.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 backdrop-blur-xl">
                        {['open', 'resolved', 'all'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setReportStatus(status)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                                    ${reportStatus === status ? 'bg-red-500 text-white shadow-lg shadow-red-500/10' : 'text-gray-500 hover:text-white'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-1.5 backdrop-blur-xl">
                        <Clock size={16} className="text-gray-500" />
                        <select
                            className="bg-transparent text-white text-[10px] font-bold uppercase tracking-widest focus:outline-none appearance-none cursor-pointer pr-4"
                            value={reportRange}
                            onChange={(e) => setReportRange(e.target.value)}
                        >
                            <option value="7" className="bg-[#0a0814]">Last 7 Cycles</option>
                            <option value="30" className="bg-[#0a0814]">Last 30 Cycles</option>
                            <option value="90" className="bg-[#0a0814]">Last 90 Cycles</option>
                            <option value="all" className="bg-[#0a0814]">Total Archive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-6">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{reports.length} Signals Captured</span>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                         <div className="flex items-center gap-1.5 text-red-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>{reports.filter(r => r.status === 'open').length} High Priority</span>
                         </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl pb-10">
                    {reports.length === 0 ? (
                        <div className="py-32 text-center">
                            <CheckCircle2 size={40} className="text-green-500/20 mx-auto mb-6" />
                            <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">Signal Clean - No Reports Detected</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {reports.map((r) => (
                                <div key={r.id} className="group p-8 hover:bg-white/[0.03] transition-all flex flex-col md:flex-row gap-8 items-start">
                                    <div className="flex-grow space-y-4">
                                        <div className="flex items-center flex-wrap gap-4">
                                            <div className={`px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest
                                                ${r.status === 'open' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}
                                            `}>
                                                {r.status} Signal
                                            </div>
                                            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <User size={12} />
                                                ID: {r.user_id?.slice(0, 8)}...
                                            </div>
                                            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <Clock size={12} />
                                                {new Date(r.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <Database size={12} />
                                                NODE_ID: {r.question_id}
                                            </div>
                                        </div>

                                        <div className="bg-black/20 border border-white/5 rounded-2xl p-6 relative">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                                <ShieldAlert size={40} strokeWidth={1} />
                                            </div>
                                            <h4 className="text-white font-black text-sm uppercase tracking-tight mb-2">Discrepancy Report</h4>
                                            <p className="text-gray-400 text-sm leading-relaxed italic">"{r.reason}"</p>
                                        </div>

                                        {r.questions && (
                                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 group/node">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Affected Core Logic</div>
                                                    <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-black/40 border border-white/5 text-[8px] font-mono text-gray-400">
                                                        {r.questions.category_id} / {r.questions.topic_id}
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 text-sm font-medium leading-relaxed group-hover/node:text-white transition-colors">
                                                    {r.questions.question}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-3 min-w-[160px]">
                                        {r.status === 'open' ? (
                                            <button 
                                                onClick={() => handleResolveReport(r.id)}
                                                className="flex-grow flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-secondary text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/20"
                                            >
                                                <CheckCircle2 size={16} />
                                                <span>Resolve</span>
                                            </button>
                                        ) : (
                                            <div className="flex-grow flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest cursor-default">
                                                <Activity size={16} />
                                                <span>Resolved</span>
                                            </div>
                                        )}
                                        <button 
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all group/view"
                                            title="Inspect Metadata"
                                        >
                                            <ExternalLink size={16} className="group-hover/view:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportManager;
