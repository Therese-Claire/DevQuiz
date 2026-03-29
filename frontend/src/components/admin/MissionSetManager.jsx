import React from 'react';
import { 
    Plus, 
    Save, 
    ListChecks, 
    Activity, 
    Zap, 
    Target, 
    Database, 
    Search,
    ChevronRight,
    ArrowRightCircle,
    Copy,
    Cpu,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';

const MissionSetManager = ({
    quizSets,
    setAssignments,
    setForm,
    setSetForm,
    handleSetCreate,
    selectedSetId,
    setSelectedSetId,
    autoPopulateSet,
    toggleAssignQuestion,
    questions,
    loading
}) => {
    const activeSet = quizSets.find(s => s.id === selectedSetId);
    const assignedCount = setAssignments.filter(a => a.quiz_set_id === selectedSetId).length;

    return (
        <div className="space-y-10 animate-reveal">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <ListChecks size={24} className="text-primary" />
                        Mission Sets
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Curate and sequence high-stakes mission paths for specialized training.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Sets List & Creation */}
                <div className="lg:col-span-4 space-y-10">
                     <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none group-hover:text-primary/10 transition-colors">
                            <Plus size={80} strokeWidth={1} />
                        </div>
                        <h3 className="text-lg font-black text-white mb-8 relative z-10">Initialize Set</h3>
                        <form onSubmit={handleSetCreate} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest pl-2">Set Designation</label>
                                <input 
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all font-medium" 
                                    placeholder="Mission Title" 
                                    value={setForm.name} 
                                    onChange={(e) => setSetForm({ ...setForm, name: e.target.value })} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest pl-2">Difficulty Base</label>
                                <select 
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                                    value={setForm.difficulty} 
                                    onChange={(e) => setSetForm({ ...setForm, difficulty: e.target.value })} 
                                    required 
                                >
                                    <option value="mixed">Mixed Tiers</option>
                                    <option value="easy">L1 - Easy</option>
                                    <option value="medium">L2 - Medium</option>
                                    <option value="hard">L3 - Hard</option>
                                </select>
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
                            >
                                Deploy Mission Set
                            </button>
                        </form>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest pl-2">{quizSets.length} Active Command Sets</h4>
                        {quizSets.map((s) => (
                            <button 
                                key={s.id}
                                onClick={() => setSelectedSetId(s.id)}
                                className={`w-full p-6 rounded-[2rem] border transition-all duration-500 flex items-center justify-between group
                                    ${selectedSetId === s.id ? 'bg-primary/10 border-primary/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}
                                `}
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                                        ${selectedSetId === s.id ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-gray-600 group-hover:text-primary'}
                                    `}>
                                        <Target size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-black tracking-tight group-hover:text-primary transition-colors">{s.name}</div>
                                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mt-0.5">{s.difficulty || 'Mixed'}</div>
                                    </div>
                                </div>
                                <ArrowRightCircle size={20} className={`transition-transform duration-500 ${selectedSetId === s.id ? 'text-primary scale-110' : 'text-gray-800'}`} />
                            </button>
                        ))}
                     </div>
                </div>

                {/* Right: Assignments & Population */}
                <div className="lg:col-span-8">
                     {selectedSetId ? (
                        <div className="space-y-10">
                            <div className="bg-[#0d0b1a] border border-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group/intel">
                                <div className="absolute top-0 right-0 p-8 text-secondary/5 pointer-events-none group-hover/intel:text-secondary/10 transition-colors">
                                    <Cpu size={100} strokeWidth={1} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">Active Matrix</span>
                                        <span className="text-gray-600 font-mono text-[10px] tracking-widest uppercase">ID: {selectedSetId}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white">{activeSet?.name}</h3>
                                    <div className="flex items-center gap-6 mt-6">
                                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Database size={14} className="text-secondary" />
                                            {assignedCount} Nodes Assigned
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10">
                                     <button 
                                        onClick={autoPopulateSet}
                                        disabled={loading}
                                        className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-secondary text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/20"
                                    >
                                        <Copy size={16} />
                                        <span>Auto-Populate Logic</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-4">
                                    <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest underline underline-offset-4">Logic Node Allocation</h4>
                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest italic">Syncing across global database...</span>
                                </div>
                                
                                <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl max-h-[600px] overflow-y-auto no-scrollbar pb-10">
                                    {questions.map((q) => {
                                        const isAssigned = setAssignments.some(a => a.quiz_set_id === selectedSetId && a.question_id === q.id);
                                        return (
                                            <div 
                                                key={q.id}
                                                className={`p-6 border-b border-white/5 last:border-0 flex items-center justify-between transition-all group
                                                    ${isAssigned ? 'bg-secondary/5' : 'hover:bg-white/5'}
                                                `}
                                            >
                                                <div className="flex-grow space-y-2">
                                                    <div className="flex gap-2">
                                                        <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">{q.category_id}</span>
                                                        <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">/</span>
                                                        <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">{q.topic_id}</span>
                                                    </div>
                                                    <p className={`text-sm font-medium leading-relaxed transition-colors ${isAssigned ? 'text-white font-black' : 'text-gray-500'}`}>{q.question}</p>
                                                </div>
                                                <button 
                                                    onClick={() => toggleAssignQuestion(q.id)}
                                                    className={`w-12 h-12 rounded-2xl border transition-all flex items-center justify-center ml-10
                                                        ${isAssigned 
                                                            ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20' 
                                                            : 'bg-white/5 border-white/10 text-gray-800 hover:text-white hover:border-white/20'}
                                                    `}
                                                >
                                                    {isAssigned ? <CheckCircle2 size={24} /> : <Plus size={24} />}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                     ) : (
                        <div className="h-full py-40 flex flex-col items-center justify-center text-center bg-white/5 border border-white/5 rounded-[4rem] border-dashed px-10">
                            <ListChecks size={60} className="text-gray-800 mb-8" />
                            <h3 className="text-2xl font-black text-gray-700 uppercase tracking-tight mb-2">No Command Matrix Selected</h3>
                            <p className="text-gray-600 text-sm max-w-sm leading-relaxed uppercase tracking-widest font-mono text-[10px]">Initialize or select a mission set from the left protocol list to begin node allocation.</p>
                        </div>
                     )}
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default MissionSetManager;
