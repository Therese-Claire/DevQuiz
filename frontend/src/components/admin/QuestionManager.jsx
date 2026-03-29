import React from 'react';
import { 
    Plus, 
    Save, 
    Archive, 
    RotateCcw, 
    Database, 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    Filter, 
    Cpu, 
    ShieldAlert,
    ExternalLink,
    Grid,
    CheckCircle2,
    Calendar,
    ArrowUpDown
} from 'lucide-react';

const QuestionManager = ({
    questions,
    categories,
    topics,
    questionForm,
    setQuestionForm,
    handleQuestionCreate,
    editingQuestionId,
    setEditingQuestionId,
    deleteQuestion,
    restoreQuestion,
    questionTab,
    setQuestionTab,
    selectedQuestions,
    setSelectedQuestions,
    bulkArchiveQuestions,
    bulkUnarchiveQuestions,
    questionPage,
    setQuestionPage,
    questionTotal,
    questionSearch,
    setQuestionSearch,
    filterCategory,
    setFilterCategory,
    filterTopic,
    setFilterTopic,
    loading
}) => {
    const totalPages = Math.ceil(questionTotal / 50);
    const filteredTopics = topics.filter(t => t.category_id === questionForm.category_id);
    const availableFilterTopics = topics.filter(t => t.category_id === filterCategory);

    return (
        <div className="space-y-10 animate-reveal">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <Database size={24} className="text-secondary" />
                        Logic Database
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage the core question bank and mission intelligence.</p>
                </div>
                
                <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 backdrop-blur-xl">
                    {['active', 'archived', 'all'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setQuestionTab(tab);
                                setSelectedQuestions(new Set());
                                setQuestionPage(1);
                            }}
                            className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                                ${questionTab === tab ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Creation / Edit Form */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-secondary/5 pointer-events-none group-hover:text-secondary/10 transition-colors">
                    <Plus size={80} strokeWidth={1} />
                </div>
                
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-2">
                    {editingQuestionId ? 'Update Intelligence Node' : 'Initialize Logic Node'}
                </h3>

                <form onSubmit={handleQuestionCreate} className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Sector</label>
                        <select 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-secondary/50 transition-all appearance-none cursor-pointer"
                            value={questionForm.category_id} 
                            onChange={(e) => setQuestionForm({ ...questionForm, category_id: e.target.value, topic_id: '' })} 
                            required 
                        >
                            <option value="">Select Sector</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Objective</label>
                        <select 
                            className={`w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-secondary/50 transition-all appearance-none cursor-pointer ${!questionForm.category_id ? 'opacity-30 pointer-events-none' : ''}`}
                            value={questionForm.topic_id} 
                            onChange={(e) => setQuestionForm({ ...questionForm, topic_id: e.target.value })} 
                            required 
                            disabled={!questionForm.category_id}
                        >
                            <option value="">Select Objective</option>
                            {filteredTopics.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Difficulty Tier</label>
                        <select 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-secondary/50 transition-all appearance-none cursor-pointer"
                            value={questionForm.difficulty} 
                            onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })} 
                            required 
                        >
                            <option value="easy">Easy (L1)</option>
                            <option value="medium">Medium (L2)</option>
                            <option value="hard">Hard (L3)</option>
                        </select>
                    </div>
                    
                    <div className="md:col-span-12 space-y-2">
                        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Core Logic (The Question)</label>
                        <textarea 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-secondary/50 transition-all min-h-[120px] resize-none" 
                            placeholder="Type the question content here (supports markdown-lite)..." 
                            value={questionForm.question} 
                            onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })} 
                            required
                        />
                    </div>

                    <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                        {questionForm.options.map((opt, idx) => (
                            <div key={idx} className="space-y-2">
                                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Option {idx + 1}</label>
                                <div className="flex gap-3">
                                    <input 
                                        className="flex-grow bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-secondary/50 transition-all" 
                                        placeholder={`Scenario ${idx + 1}`} 
                                        value={opt} 
                                        onChange={(e) => {
                                            const next = [...questionForm.options];
                                            next[idx] = e.target.value;
                                            setQuestionForm({ ...questionForm, options: next });
                                        }} 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setQuestionForm({ ...questionForm, correct_answer: opt })}
                                        className={`px-4 rounded-xl border transition-all ${questionForm.correct_answer === opt && opt !== '' ? 'bg-secondary border-secondary text-white' : 'bg-white/5 border-white/10 text-gray-700 hover:text-white'}`}
                                        title="Set as Correct Terminal"
                                    >
                                        <CheckCircle2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="md:col-span-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-white/5">
                        <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Marked Solution:</span>
                            <span className="text-white font-bold">{questionForm.correct_answer || 'None Selected'}</span>
                        </div>
                        <div className="flex gap-4">
                            {editingQuestionId && (
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setEditingQuestionId(null);
                                        setQuestionForm({ category_id: '', topic_id: '', question: '', options: ['', '', '', ''], correct_answer: '', difficulty: 'medium' });
                                    }}
                                    className="px-6 py-4 rounded-2xl text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-widest underline underline-offset-4 transition-all"
                                >
                                    Cancel intelligence Sync
                                </button>
                            )}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-10 bg-secondary text-white rounded-2xl py-4 font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/30 flex items-center justify-center gap-2"
                            >
                                {editingQuestionId ? <Save size={16} /> : <Plus size={16} />}
                                <span>{editingQuestionId ? 'Update Command' : 'Deploy Command'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Tactical Search & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-reveal [animation-delay:100ms]">
                <div className="md:col-span-5 relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-secondary transition-colors">
                        <Search size={18} />
                    </div>
                    <input 
                        className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] pl-14 pr-6 py-4 text-white text-sm focus:outline-none focus:border-secondary/50 transition-all font-medium placeholder:text-gray-600" 
                        placeholder="Search mission logic database..." 
                        value={questionSearch}
                        onChange={(e) => { setQuestionSearch(e.target.value); setQuestionPage(1); }}
                    />
                </div>
                <div className="md:col-span-3 flex items-center gap-3 bg-white/5 border border-white/10 rounded-[1.5rem] px-5 py-2">
                    <Filter size={16} className="text-gray-600" />
                    <select 
                        className="flex-grow bg-transparent text-white text-xs font-bold uppercase tracking-widest focus:outline-none appearance-none cursor-pointer"
                        value={filterCategory}
                        onChange={(e) => { setFilterCategory(e.target.value); setFilterTopic(''); setQuestionPage(1); }}
                    >
                        <option value="" className="bg-[#0a0814]">All Sectors</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id} className="bg-[#0a0814]">{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="md:col-span-4 flex items-center gap-3 bg-white/5 border border-white/10 rounded-[1.5rem] px-5 py-2">
                    <Grid size={16} className="text-gray-600" />
                    <select 
                        className={`flex-grow bg-transparent text-white text-xs font-bold uppercase tracking-widest focus:outline-none appearance-none cursor-pointer ${!filterCategory ? 'opacity-30 pointer-events-none' : ''}`}
                        value={filterTopic}
                        onChange={(e) => { setFilterTopic(e.target.value); setQuestionPage(1); }}
                        disabled={!filterCategory}
                    >
                        <option value="" className="bg-[#0a0814]">All Objectives</option>
                        {availableFilterTopics.map((t) => (
                            <option key={t.id} value={t.id} className="bg-[#0a0814]">{t.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* List & Bulk Actions */}
            <div className="space-y-6 animate-reveal [animation-delay:200ms]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{selectedQuestions.size} Nodes Selected</span>
                         {selectedQuestions.size > 0 && (
                            <div className="flex gap-2">
                                {questionTab !== 'archived' && (
                                    <button 
                                        onClick={bulkArchiveQuestions}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                                    >
                                        <Archive size={12} />
                                        <span>Mass Archive</span>
                                    </button>
                                )}
                                {questionTab === 'archived' && (
                                    <button 
                                        onClick={bulkUnarchiveQuestions}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-lg shadow-secondary/10"
                                    >
                                        <RotateCcw size={12} />
                                        <span>Mass Restore</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{questionTotal} Total Logic Nodes</div>
                        
                        {/* Pagination */}
                        <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl">
                            <button 
                                onClick={() => setQuestionPage(Math.max(1, questionPage - 1))}
                                disabled={questionPage === 1}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-white disabled:opacity-20 transition-all hover:bg-white/5"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="px-3 text-[10px] font-mono text-white font-bold tracking-widest">
                                {questionPage} <span className="text-gray-700 mx-1">/</span> {totalPages || 1}
                            </span>
                            <button 
                                onClick={() => setQuestionPage(Math.min(totalPages, questionPage + 1))}
                                disabled={questionPage >= totalPages}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-white disabled:opacity-20 transition-all hover:bg-white/5"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
                    <div className="max-h-[800px] overflow-y-auto no-scrollbar">
                        {questions.length === 0 ? (
                            <div className="py-32 text-center">
                                <Search size={40} className="text-gray-800 mx-auto mb-6" />
                                <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">Atmosphere Empty - No Nodes Detected</p>
                            </div>
                        ) : questions.map((q) => (
                            <div 
                                key={q.id} 
                                className={`group border-b border-white/5 last:border-0 p-8 flex items-start gap-8 transition-all hover:bg-white/[0.03]
                                    ${selectedQuestions.has(q.id) ? 'bg-secondary/10 border-l-4 border-l-secondary' : 'bg-transparent border-l-4 border-l-transparent'}
                                `}
                            >
                                <input 
                                    type="checkbox" 
                                    className="mt-1 w-5 h-5 rounded-lg border-white/10 bg-black/40 text-secondary focus:ring-secondary/20 transition-all cursor-pointer"
                                    checked={selectedQuestions.has(q.id)}
                                    onChange={(e) => {
                                        const next = new Set(selectedQuestions);
                                        if (e.target.checked) next.add(q.id);
                                        else next.delete(q.id);
                                        setSelectedQuestions(next);
                                    }}
                                />
                                
                                <div className="flex-grow space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[8px] font-mono text-gray-600 uppercase tracking-widest">{q.category_id}</div>
                                        <div className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[8px] font-mono text-gray-600 uppercase tracking-widest">{q.topic_id}</div>
                                        {q.difficulty && (
                                            <div className={`px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest
                                                ${q.difficulty === 'hard' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                                                  q.difficulty === 'medium' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 
                                                  'bg-green-500/10 border-green-500/20 text-green-500'}
                                            `}>
                                                {q.difficulty}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-white font-medium leading-relaxed group-hover:text-secondary transition-colors line-clamp-2">{q.question}</p>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    {!q.is_archived ? (
                                        <>
                                            <button 
                                                onClick={() => {
                                                    // In a real app we'd fetch the full question with options here,
                                                    // but the current AdminDashboard logic assumes options are available or 
                                                    // would need to be updated. For this modernization, we'll trigger the edit.
                                                    setEditingQuestionId(q.id);
                                                    setQuestionForm({
                                                        category_id: q.category_id,
                                                        topic_id: q.topic_id,
                                                        question: q.question,
                                                        options: q.options || ['', '', '', ''],
                                                        correct_answer: q.correct_answer || '',
                                                        difficulty: q.difficulty || 'medium'
                                                    });
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all"
                                                title="Modify Logic"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                            <button 
                                                onClick={() => deleteQuestion(q.id)}
                                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                title="Archive Node"
                                            >
                                                <Archive size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => restoreQuestion(q.id)}
                                            className="px-4 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-gray-500 hover:bg-secondary hover:text-white hover:border-secondary transition-all text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            <RotateCcw size={14} />
                                            <span>Restore Access</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default QuestionManager;
