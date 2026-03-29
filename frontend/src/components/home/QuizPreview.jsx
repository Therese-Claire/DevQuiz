import React from 'react';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

const QuizPreview = () => {
    return (
        <section className="py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="reveal-on-scroll">
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                        Real challenges for <br />
                        <span className="text-primary">Real Engineers.</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        We don't ask about syntax. We ask about the decisions that make or break a production system. 
                        Experience immediate feedback and learn the "why" behind every answer.
                    </p>
                    <div className="space-y-4">
                        {[
                            'Detailed explanations for every question',
                            'Interactive progress tracking',
                            'Context-aware difficulty scaling',
                            'Modern developer-centric UI'
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3 text-white">
                                <div className="text-primary"><CheckCircle2 size={20} /></div>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative group perspective-1000 reveal-on-scroll [animation-delay:200ms]">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-50" />
                    <div className="relative bg-[#110e1b] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl transition-transform duration-700 group-hover:rotate-x-2 group-hover:rotate-y-[-2deg]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <HelpCircle size={20} />
                            </div>
                            <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">Question 12/20 • System Design</div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-8">
                            Which strategy is most effective for mitigating the "Thundering Herd" problem in a high-traffic cache invalidation scenario?
                        </h3>

                        <div className="space-y-4">
                            {[
                                { label: 'A', text: 'Increase cache expiration time' },
                                { label: 'B', text: 'Implement probabilistic early recomputation' },
                                { label: 'C', text: 'Switch to a Write-Through cache' },
                                { label: 'D', text: 'Horizontal scaling of the app layer' }
                            ].map((opt, idx) => (
                                <div 
                                    key={opt.label} 
                                    className={`p-5 rounded-2xl border transition-all duration-300 ${
                                        idx === 1 
                                        ? 'bg-primary/20 border-primary text-white' 
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`font-mono font-bold ${idx === 1 ? 'text-white' : 'text-gray-500'}`}>{opt.label}</span>
                                        <span className="font-medium text-sm md:text-base">{opt.text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="text-xs font-mono text-primary mb-2 uppercase select-none tracking-widest animate-pulse">Checking answer...</div>
                            <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-sm text-gray-300">
                                <strong>Success:</strong> Correct. Using an early recomputation lock ensures only one worker refreshes the cache.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuizPreview;
