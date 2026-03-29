import React from 'react';
import { Star, Users, Briefcase, Award } from 'lucide-react';

const SocialProof = () => {
    return (
        <section className="py-24 px-6 border-t border-white/5 relative bg-gradient-to-b from-transparent to-[#05040a]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 text-center">
                    {[
                        { icon: Users, value: '50k+', label: 'Active Engineers' },
                        { icon: Star, value: '4.9/5', label: 'Average Score' },
                        { icon: Briefcase, value: '120+', label: 'Partner Companies' },
                        { icon: Award, value: '1M+', label: 'Questions Solved' }
                    ].map((stat, i) => (
                        <div key={stat.label} className="reveal-on-scroll" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-xl bg-white/5 text-secondary">
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                            <div className="text-xs uppercase tracking-widest text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-center space-y-12">
                   <div className="text-gray-500 text-sm font-mono tracking-widest uppercase mb-4">Crafted for engineers from</div>
                   <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
                        {['GOOGLE', 'NETFLIX', 'STRIPE', 'UBER', 'VERCEL', 'META'].map(logo => (
                            <div key={logo} className="text-2xl font-black tracking-tighter text-white select-none whitespace-nowrap">
                                {logo}
                            </div>
                        ))}
                   </div>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
