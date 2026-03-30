import React from 'react';
import { Radio, Zap, Trophy, ShieldAlert, Cpu } from 'lucide-react';

const NotificationFeed = () => {
    // Mock signal data - in a real app, this could be a Supabase Realtime subscription
    const signals = [
        { id: 1, type: 'system', message: 'New logic nodes deployed in Kubernetes sector.', time: '2m ago', icon: <Cpu size={14} /> },
        { id: 2, type: 'success', message: 'User "alpha_dev" achieved 100% on System Design.', time: '5m ago', icon: <Trophy size={14} /> },
        { id: 3, type: 'alert', message: 'Global Leaderboard: Shuffle in the Top 10.', time: '12m ago', icon: <ShieldAlert size={14} /> },
        { id: 4, type: 'milestone', message: 'Total mission completions reached 5,000.', time: '20m ago', icon: <Zap size={14} /> },
    ];

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Radio size={14} className="text-secondary animate-pulse" />
                    Signal Stream
                </h3>
                <span className="text-[10px] font-mono text-secondary animate-pulse">LIVE</span>
            </div>

            <div className="space-y-6">
                {signals.map((signal) => (
                    <div key={signal.id} className="group relative pl-6 border-l border-white/5 hover:border-primary/50 transition-colors">
                        <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-[#0a0814] border border-white/10 flex items-center justify-center p-0.5 group-hover:border-primary/50 transition-colors">
                            <div className="w-full h-full rounded-full bg-gray-800 group-hover:bg-primary transition-colors" />
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-600 group-hover:text-gray-400">
                                    {signal.icon}
                                    <span>{signal.type}</span>
                                </div>
                                <span className="text-[9px] font-mono text-gray-700">{signal.time}</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium group-hover:text-white transition-colors">
                                {signal.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 border-t border-white/5 text-[10px] font-mono font-bold text-gray-600 hover:text-primary uppercase tracking-widest transition-colors">
                Decrypt Full Stream
            </button>
        </div>
    );
};

export default NotificationFeed;
