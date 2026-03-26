import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] -z-10" />

            <div className="text-center max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary font-medium tracking-wide mb-4">
                    🚀 Level Up Your Coding Skills
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
                    Master Development <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        One Quiz at a Time
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Test your knowledge in HTML, CSS, JavaScript, and more.
                    Challenge yourself and track your progress with our detailed analytics.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
                    <Link to="/register" className="group relative px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 w-full sm:w-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300" />
                        <span className="relative flex items-center justify-center gap-2 text-white font-bold text-lg">
                            Get Started Free
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </Link>
                    <Link to="/login" className="px-8 py-4 rounded-2xl text-white font-bold text-lg border border-white/10 hover:bg-white/5 transition-all w-full sm:w-auto">
                        Existing User?
                    </Link>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
                    {[
                        { icon: '⚡', title: 'Instant Feedback', desc: 'See your results immediately after each question' },
                        { icon: '📊', title: 'Track Progress', desc: 'Detailed statistics to help you identify weak spots' },
                        { icon: '🏆', title: 'Global Leaderboard', desc: 'Compete with developers around the world' }
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors text-left">
                            <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
