import React from 'react';
import { 
    Plus, 
    Save, 
    Trash2, 
    RotateCcw, 
    Archive, 
    Layers, 
    Search,
    ChevronRight,
    BadgeCheck,
    Box
} from 'lucide-react';

const CategoryManager = ({ 
    categories, 
    categoryForm, 
    setCategoryForm, 
    handleCategoryCreate, 
    editingCategoryId, 
    setEditingCategoryId,
    deleteCategory, 
    restoreCategory, 
    categoryTab, 
    setCategoryTab,
    selectedCategories,
    setSelectedCategories,
    bulkArchiveCategories,
    loading
}) => {
    const filteredCategories = categories.filter(c => 
        categoryTab === 'archived' ? c.is_archived : !c.is_archived
    );

    return (
        <div className="space-y-10 animate-reveal">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <Box size={24} className="text-primary" />
                        Sector Configuration
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage the root hierarchies of the DevQuiz mission modules.</p>
                </div>
                
                <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 backdrop-blur-xl">
                    {['active', 'archived'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setCategoryTab(tab);
                                setSelectedCategories(new Set());
                            }}
                            className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                                ${categoryTab === tab ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Creation Form */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none group-hover:text-primary/10 transition-colors">
                    <Plus size={80} strokeWidth={1} />
                </div>
                
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-2">
                    {editingCategoryId ? 'Modify Sector Parameters' : 'Initialize New Sector'}
                </h3>

                <form onSubmit={handleCategoryCreate} className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                    <div className="md:col-span-3 space-y-2">
                         <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Sector ID</label>
                         <input 
                            className={`w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-all ${editingCategoryId ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            placeholder="e.g. backend_ops" 
                            value={categoryForm.id} 
                            onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })} 
                            required 
                            disabled={!!editingCategoryId}
                        />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                         <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Sector Label</label>
                         <input 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-all" 
                            placeholder="Display Name" 
                            value={categoryForm.name} 
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} 
                            required 
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                         <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Icon ID</label>
                         <input 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-all" 
                            placeholder="Emoji or ID" 
                            value={categoryForm.icon} 
                            onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} 
                        />
                    </div>
                    <div className="md:col-span-3 space-y-2 flex flex-col justify-end">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary text-white rounded-2xl py-4 font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            {editingCategoryId ? <Save size={16} /> : <Plus size={16} />}
                            <span>{editingCategoryId ? 'Update Sector' : 'Deploy Sector'}</span>
                        </button>
                    </div>
                    <div className="md:col-span-12 space-y-2">
                         <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Operational Briefing</label>
                         <textarea 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-all min-h-[100px] resize-none" 
                            placeholder="Briefly describe the domain focus..." 
                            value={categoryForm.description} 
                            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} 
                        />
                    </div>
                    {editingCategoryId && (
                         <div className="md:col-span-12 flex justify-end">
                            <button 
                                type="button"
                                onClick={() => {
                                    setEditingCategoryId(null);
                                    setCategoryForm({ id: '', name: '', icon: '', description: '' });
                                }}
                                className="text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-widest underline underline-offset-4 transition-all"
                            >
                                Cancel Intelligence Update
                            </button>
                         </div>
                    )}
                </form>
            </div>

            {/* List & Actions */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{selectedCategories.size} Units Selected</span>
                        {categoryTab === 'active' && selectedCategories.size > 0 && (
                            <button 
                                onClick={bulkArchiveCategories}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                            >
                                <Archive size={12} />
                                <span>Bulk Archive</span>
                            </button>
                        )}
                    </div>
                    <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{filteredCategories.length} Total Records Loaded</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCategories.length === 0 ? (
                        <div className="md:col-span-2 py-20 text-center bg-white/5 border border-white/5 rounded-[3rem] border-dashed">
                             <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">Zero Sector Records Found</p>
                        </div>
                    ) : filteredCategories.map((c) => (
                        <div 
                            key={c.id} 
                            className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col justify-between h-52 overflow-hidden
                                ${isCategorySelected(selectedCategories, c.id) ? 'bg-primary/10 border-primary/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                            <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-white/10 pointer-events-none transition-colors">
                                <Layers size={80} strokeWidth={1} />
                            </div>

                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded-lg border-white/10 bg-black/40 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                        checked={selectedCategories.has(c.id)}
                                        onChange={(e) => {
                                            const next = new Set(selectedCategories);
                                            if (e.target.checked) next.add(c.id);
                                            else next.delete(c.id);
                                            setSelectedCategories(next);
                                        }}
                                    />
                                    <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                                        {c.icon || <Box size={24} className="text-gray-600" />}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black tracking-tight group-hover:text-primary transition-colors">{c.name}</h4>
                                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">{c.id}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                     {!c.is_archived ? (
                                        <>
                                            <button 
                                                onClick={() => {
                                                    setCategoryForm({ id: c.id, name: c.name || '', icon: c.icon || '', description: c.description || '' });
                                                    setEditingCategoryId(c.id);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all"
                                                title="Edit IQ Intel"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                            <button 
                                                onClick={() => deleteCategory(c.id)}
                                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                title="Archive Sector"
                                            >
                                                <Archive size={18} />
                                            </button>
                                        </>
                                     ) : (
                                        <button 
                                            onClick={() => restoreCategory(c.id)}
                                            className="px-4 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center gap-2 text-secondary hover:bg-secondary hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            <RotateCcw size={14} />
                                            <span>Restore Access</span>
                                        </button>
                                     )}
                                </div>
                            </div>

                            <div className="relative z-10">
                                <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">{c.description || 'No operational briefing available for this sector.'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const isCategorySelected = (set, id) => set.has(id);

export default CategoryManager;
