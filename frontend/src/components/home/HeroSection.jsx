import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Package } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-secondary text-xs font-mono mb-8 animate-reveal">
          <Terminal size={14} />
          <span>v2.0.0 — Now with System Design challenges</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tight mb-8 animate-reveal [animation-delay:100ms]">
          Engineering <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">
            Excellence.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12 animate-reveal [animation-delay:200ms]">
          The ultimate knowledge platform for software engineers. 
          Master algorithms, system design, and devops through 
          highly-curated interactive challenges.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-reveal [animation-delay:300ms]">
          <Link 
            to="/register" 
            className="group relative px-10 py-5 bg-white text-black font-black rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span>Start the Challenge</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/login" 
            className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            View Leaderboard
          </Link>
        </div>

        {/* Tech Stack Icons */}
        <div className="mt-24 flex flex-wrap items-center justify-center gap-6 animate-reveal [animation-delay:400ms]">
            {['React', 'Node.js', 'Kubernetes', 'AWS', 'Python', 'Go'].map(tech => (
                <div key={tech} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:bg-white/10 transition-all cursor-default">
                    <Package size={14} className="text-primary" />
                    <span className="font-mono text-xs font-bold uppercase tracking-widest">{tech}</span>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
