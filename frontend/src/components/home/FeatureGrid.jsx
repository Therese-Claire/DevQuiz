import React from 'react';
import { Cpu, Layout, Server, Gauge, Code2, Globe } from 'lucide-react';

const icons = {
  cpu: Cpu,
  layout: Layout,
  server: Server,
  gauge: Gauge,
  code: Code2,
  globe: Globe
};

const FeatureGrid = () => {
  const features = [
    {
      icon: 'cpu',
      title: 'Algorithms & Patterns',
      desc: 'Master Big O, sorting, and core data structures for elite performance.'
    },
    {
      icon: 'server',
      title: 'System Design',
      desc: 'Learn to build scalable, distributed systems that handle millions of RPS.'
    },
    {
      icon: 'layout',
      title: 'Frontend Mastery',
      desc: 'Deep dive into rendering cycles, state management, and accessibility.'
    },
    {
      icon: 'gauge',
      title: 'DevOps & SRE',
      desc: 'Provisioning, CI/CD pipelines, and high-availability infrastructure.'
    },
    {
      icon: 'code',
      title: 'Clean Code',
      desc: 'Principles of DRY, SOLID, and maintainable software architecture.'
    },
    {
      icon: 'globe',
      title: 'Security First',
      desc: 'Understand OWASP, JWT, OAuth, and modern web security protocols.'
    }
  ];

  return (
    <section className="py-24 px-6 bg-black/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Engineered for Depth</h2>
          <p className="text-gray-400">No trivia. Only the concepts that actually matter in your career.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = icons[f.icon];
            return (
              <div 
                key={f.title} 
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
