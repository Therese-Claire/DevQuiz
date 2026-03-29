import React from 'react';
import { 
    LayoutDashboard, 
    Layers, 
    ListChecks, 
    Database, 
    Award, 
    Flag, 
    BarChart3, 
    LogOut, 
    ChevronRight,
    Activity,
    ShieldCheck,
    Cpu
} from 'lucide-react';

const menuItems = [
    { id: 'analytics', label: 'Command Intel', icon: <BarChart3 size={20} />, description: 'System performance metrics' },
    { id: 'categories', label: 'Sector Control', icon: <LayoutDashboard size={20} />, description: 'Root category definitions' },
    { id: 'topics', label: 'Tactical Objectives', icon: <Layers size={20} />, description: 'Module-level topic management' },
    { id: 'questions', label: 'Logic Database', icon: <Database size={20} />, description: 'Question bank administration' },
    { id: 'sets', label: 'Mission Sets', icon: <ListChecks size={20} />, description: 'Curated quiz sequences' },
    { id: 'badges', label: 'Merit Systems', icon: <Award size={20} />, description: 'Achievement protocol' },
    { id: 'reports', label: 'Signal Feedback', icon: <Flag size={20} />, description: 'User-reported discrepencies' },
];

const AdminSidebar = ({ activeTab, onTabChange, onLogout }) => {
    return (
        <aside className="w-80 h-screen bg-[#0d0b1a] border-r border-white/5 flex flex-col relative z-20">
            {/* Logo Section */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-8 group cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                        <Cpu size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-widest uppercase">Admin<span className="text-secondary font-glow">OS</span></h2>
                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Version 4.2.0-Alpha</div>
                    </div>
                </div>

                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                                ${activeTab === item.id 
                                    ? 'bg-white/5 border border-white/10 text-white shadow-xl shadow-black/20' 
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'}`}
                        >
                            <div className={`${activeTab === item.id ? 'text-secondary' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                {item.icon}
                            </div>
                            <div className="flex-grow text-left">
                                <span className="text-sm font-bold block">{item.label}</span>
                                <span className="text-[10px] text-gray-600 group-hover:text-gray-500 font-medium truncate w-32 block">{item.description}</span>
                            </div>
                            {activeTab === item.id && (
                                <ChevronRight size={14} className="text-gray-700" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto p-6 space-y-6">
                {/* System Health Card */}
                <div className="p-5 bg-white/5 border border-white/5 rounded-3xl">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">System Health</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Optimal</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-mono text-gray-600 uppercase mb-1">
                                <span>Core Load</span>
                                <span>24%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-secondary w-[24%]" />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                >
                    <LogOut size={16} />
                    <span>Terminate Session</span>
                </button>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .font-glow { text-shadow: 0 0 10px rgba(108,93,211,0.5); }
            `}} />
        </aside>
    );
};

export default AdminSidebar;
