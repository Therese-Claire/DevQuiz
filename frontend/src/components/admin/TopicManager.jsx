import React from 'react';
import { 
    Plus, 
    Save, 
    Archive, 
    RotateCcw, 
    Layers, 
    Box, 
    Search, 
    ChevronRight,
    Filter,
    Activity,
    BookOpen,
    Trash2
} from 'lucide-react';

const TopicManager = ({ 
    topics, 
    categories, 
    topicForm, 
    setTopicForm, 
    handleTopicCreate, 
    editingTopicKey, 
    setEditingTopicKey,
    deleteTopic, 
    restoreTopic, 
    topicTab, 
    setTopicTab,
    selectedTopics,
    setSelectedTopics,
    bulkArchiveTopics,
    loading
}) => {
    const filteredTopics = topics.filter(t => 
        topicTab === 'archived' ? t.is_archived : !t.is_archived
    );

    return (
        <div className="space-y-10 animate-reveal">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <Layers size={24} className="text-secondary" />
                        Tactical Objectives
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Configure the granular learning modules within each sector.</p>
                </div>
                
                <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 backdrop-blur-xl">
                    {['active', 'archived'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setTopicTab(tab);
                                setSelectedTopics(new Set());
                            }}
                            className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                                ${topicTab === tab ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Creation Form */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-secondary/5 pointer-events-none group-hover:text-secondary/10 transition-colors">
                    <Plus size={80} strokeWidth={1} />
                </div>
                
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-2">
                    {editingTopicKey ? 'Modify Objective Parameters' : 'Deploy New Objective'}
                </h3>

                <form onSubmit={handleTopicCreate} className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                    <div className="md:col-span-4 space-y-2">
                         <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Root Sector</label>
                         <select 
                            className={`w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-secondary/50 transition-all appearance-none cursor-pointer ${editingTopicKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                            value={topicForm.category_id} 
                            onChange={(e) => setTopicForm({ ...topicForm, category_id: e.target.value })} 
                            required 
                            disabled={!!editingTopicKey}
                        >
                            <option value="" className="bg-[#0d0b1a]">Unassigned</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id} className="bg-[#0d0b1a]">{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-4 space-y-2">
                         <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Objective ID</label>
                         <input 
                            className={`w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-secondary/50 transition-all ${editingTopicKey ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            placeholder="e.g. database_schema" 
                            value={topicForm.id} 
                            onChange={(e) => setTopicForm({ ...topicForm, id: e.target.value })} 
                            required 
                            disabled={!!editingTopicKey}
                        />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                         <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Display Title</label>
                         <input 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-secondary/50 transition-all" 
                            placeholder="Public Label" 
                            value={topicForm.name} 
                            onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })} 
                            required 
                        />
                    </div>
                    <div className="md:col-span-9 space-y-2">
                         <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Content Intelligence</label>
                         <textarea 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-secondary/50 transition-all min-h-[100px] resize-none" 
                            placeholder="Detailed objective description..." 
                            value={topicForm.description} 
                            onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })} 
                        />
                    </div>
                    <div className="md:col-span-3 space-y-2 flex flex-col justify-end">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-secondary text-white rounded-2xl py-4 font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/30 flex items-center justify-center gap-2"
                        >
                            {editingTopicKey ? <Save size={16} /> : <Plus size={16} />}
                            <span>{editingTopicKey ? 'Sync Protocol' : 'Push protocol'}</span>
                        </button>
                    </div>
                    {editingTopicKey && (
                         <div className="md:col-span-12 flex justify-end">
                            <button 
                                type="button"
                                onClick={() => {
                                    setEditingTopicKey(null);
                                    setTopicForm({ id: '', category_id: '', name: '', description: '' });
                                }}
                                className="text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-widest underline underline-offset-4 transition-all"
                            >
                                Abort Deployment Update
                            </button>
                         </div>
                    )}
                </form>
            </div>

            {/* List & Filtering */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{selectedTopics.size} Objectives Isolated</span>
                        {topicTab === 'active' && selectedTopics.size > 0 && (
                            <button 
                                onClick={bulkArchiveTopics}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                            >
                                <Archive size={12} />
                                <span>Bulk Purge</span>
                            </button>
                        )}
                    </div>
                    <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{filteredTopics.length} Objectives in Matrix</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTopics.length === 0 ? (
                        <div className="md:col-span-3 py-24 text-center bg-white/5 border border-white/5 rounded-[3rem] border-dashed">
                             <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">Atmosphere Empty - No Objectives Detected</p>
                        </div>
                    ) : filteredTopics.map((t) => (
                        <div 
                            key={`${t.category_id}:${t.id}`} 
                            className={`group relative p-8 rounded-[2rem] border transition-all duration-500 flex flex-col justify-between h-60 overflow-hidden
                                ${selectedTopics.has(`${t.category_id}:${t.id}`) ? 'bg-secondary/10 border-secondary/40' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                        >
                            <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-white/10 pointer-events-none transition-colors">
                                <Filter size={100} strokeWidth={1} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                     <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded-lg border-white/10 bg-black/40 text-secondary focus:ring-secondary/20 transition-all cursor-pointer"
                                        checked={selectedTopics.has(`${t.category_id}:${t.id}`)}
                                        onChange={(e) => {
                                            const next = new Set(selectedTopics);
                                            const key = `${t.category_id}:${t.id}`;
                                            if (e.target.checked) next.add(key);
                                            else next.delete(key);
                                            setSelectedTopics(next);
                                        }}
                                    />
                                    <div className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/5 text-[8px] font-mono text-gray-500 uppercase tracking-widest">{t.category_id}</div>
                                </div>
                                
                                <h4 className="text-white font-black tracking-tight group-hover:text-secondary transition-colors truncate">{t.name}</h4>
                                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mt-0.5">{t.id}</p>
                                
                                <p className="text-gray-500 text-xs mt-4 line-clamp-3 leading-relaxed">{t.description || 'Global intelligence missing for this tactical objective.'}</p>
                            </div>

                            <div className="flex items-center justify-end gap-2 relative z-10 pt-4">
                                 {!t.is_archived ? (
                                    <>
                                        <button 
                                            onClick={() => {
                                                setTopicForm({ id: t.id, category_id: t.category_id, name: t.name || '', description: t.description || '' });
                                                setEditingTopicKey(`${t.category_id}:${t.id}`);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all"
                                            title="Reconfig Parameters"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                        <button 
                                            onClick={() => deleteTopic(t.category_id, t.id)}
                                            className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            title="Archive Objective"
                                        >
                                            <Archive size={16} />
                                        </button>
                                    </>
                                 ) : (
                                    <button 
                                        onClick={() => restoreTopic(t.category_id, t.id)}
                                        className="px-4 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-gray-500 hover:bg-secondary hover:text-white hover:border-secondary transition-all text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        <RotateCcw size={12} />
                                        <span>Restore Access</span>
                                    </button>
                                 )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopicManager;
