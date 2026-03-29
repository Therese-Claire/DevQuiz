import React from 'react';
import { 
    Award, 
    Plus, 
    Save, 
    Trash2, 
    Star, 
    Zap, 
    ShieldCheck, 
    History,
    ChevronRight,
    Edit3
} from 'lucide-react';

const BadgeManager = ({
    badges,
    badgeForm,
    setBadgeForm,
    handleBadgeCreate,
    editingBadgeId,
    setEditingBadgeId,
    deleteBadge,
    loading
}) => {
    return (
        <div className="space-y-10 animate-reveal">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <Award size={24} className="text-yellow-500" />
                        Merit Systems
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Configure and deploy achievement artifacts for specialized engineering feats.</p>
                </div>
            </div>

            {/* Creation Form */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-yellow-500/5 pointer-events-none group-hover:text-yellow-500/10 transition-colors">
                    <Award size={80} strokeWidth={1} />
                </div>
                
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-2">
                    {editingBadgeId ? 'Reconfigure Achievement Artifact' : 'Forge New Achievement Artifact'}
                </h3>

                <form onSubmit={handleBadgeCreate} className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                    <div className="md:col-span-3 space-y-2">
                         <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Artifact ID</label>
                         <input 
                            className={`w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-yellow-500/50 transition-all ${editingBadgeId ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            placeholder="e.g. cloud_master" 
                            value={badgeForm.id} 
                            onChange={(e) => setBadgeForm({ ...badgeForm, id: e.target.value })} 
                            required 
                            disabled={!!editingBadgeId}
                        />
                    </div>
                    <div className="md:col-span-6 space-y-2">
                         <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Artifact Designation</label>
                         <input 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-yellow-500/50 transition-all" 
                            placeholder="Public Recognition Label" 
                            value={badgeForm.name} 
                            onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })} 
                            required 
                        />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                         <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Icon Symbol</label>
                         <input 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-yellow-500/50 transition-all" 
                            placeholder="Emoji or SVG Ref" 
                            value={badgeForm.icon} 
                            onChange={(e) => setBadgeForm({ ...badgeForm, icon: e.target.value })} 
                        />
                    </div>
                    <div className="md:col-span-9 space-y-2">
                         <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block pl-2">Merit Description</label>
                         <textarea 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-yellow-500/50 transition-all min-h-[100px] resize-none" 
                            placeholder="Describe the requirements for this accomplishment..." 
                            value={badgeForm.description} 
                            onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })} 
                        />
                    </div>
                    <div className="md:col-span-3 space-y-2 flex flex-col justify-end">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-yellow-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl py-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-2"
                        >
                            {editingBadgeId ? <Save size={16} /> : <Plus size={16} />}
                            <span>{editingBadgeId ? 'Update Artifact' : 'Forge Artifact'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {badges.length === 0 ? (
                    <div className="md:col-span-3 py-24 text-center bg-white/5 border border-white/5 rounded-[3rem] border-dashed">
                         <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">No Merit Artifacts Forged</p>
                    </div>
                ) : badges.map((b) => (
                    <div 
                        key={b.id} 
                        className="group relative bg-[#13111c] border border-white/5 rounded-[2.5rem] p-8 hover:bg-white/5 hover:border-white/10 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 text-yellow-500/5 group-hover:text-yellow-500/10 pointer-events-none transition-colors">
                            <Star size={100} strokeWidth={1} />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-black/40 border border-white/5 flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                                {b.icon || '🏅'}
                            </div>
                            
                            <div>
                                <h4 className="text-xl font-black text-white group-hover:text-yellow-500 transition-colors uppercase tracking-tight">{b.name}</h4>
                                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">ID: {b.id}</div>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 min-h-[40px]">{b.description || 'Achievement criteria not documented.'}</p>

                            <div className="flex gap-2 w-full pt-4">
                                <button 
                                    onClick={() => {
                                        setBadgeForm({ id: b.id, name: b.name || '', description: b.description || '', icon: b.icon || '' });
                                        setEditingBadgeId(b.id);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="flex-grow flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all text-[10px] font-bold uppercase tracking-widest"
                                >
                                    <Edit3 size={14} />
                                    <span>Sync</span>
                                </button>
                                <button 
                                    onClick={() => deleteBadge(b.id)}
                                    className="w-12 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                                    title="Dismantle Artifact"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BadgeManager;
