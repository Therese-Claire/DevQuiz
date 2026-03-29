import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const CategoryShowcase = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const categories = [
        { name: 'Backend', items: ['Microservices', 'Database Scaling', 'Caching Strategies'] },
        { name: 'Frontend', items: ['React Internals', 'Web Vitals', 'CSS Architecture'] },
        { name: 'Infrastructure', items: ['Kubernetes', 'Terraform', 'Docker Networking'] },
        { name: 'System Design', items: ['Load Balancing', 'Consistency Models', 'Message Queues'] },
    ];

    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/2">
                        <h2 className="text-4xl font-bold text-white mb-8">Choose your specialized path.</h2>
                        <div className="space-y-4">
                            {categories.map((c, i) => (
                                <button
                                    key={c.name}
                                    onClick={() => setActiveIndex(i)}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                                        activeIndex === i 
                                        ? 'bg-white/10 border-primary shadow-[0_0_20px_rgba(108,93,211,0.2)]' 
                                        : 'bg-transparent border-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xl font-bold ${activeIndex === i ? 'text-white' : 'text-gray-400'}`}>
                                            {c.name}
                                        </span>
                                        {activeIndex === i && (
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="relative aspect-square">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                            <div className="relative h-full bg-white/5 border border-white/10 rounded-[3rem] p-10 overflow-hidden backdrop-blur-2xl">
                                <div className="flex items-center gap-2 mb-6">
                                    <ChevronRight size={18} className="text-primary" />
                                    <span className="text-sm font-black text-white uppercase tracking-tighter">Selected Modules</span>
                                </div>
                                <div className="space-y-6">
                                    {categories[activeIndex].items.map((item, idx) => (
                                        <div 
                                            key={item} 
                                            className="p-6 rounded-2xl bg-black/40 border border-white/5 animate-reveal"
                                            style={{ animationDelay: `${idx * 100}ms` }}
                                        >
                                            <div className="text-white font-bold mb-1">{item}</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest">Advanced Challenge</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute bottom-8 left-10 right-10 p-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-center font-bold text-sm">
                                    Explore Topic
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;
