import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden">
            <div className="absolute top-12 left-8 w-72 h-72 bg-primary/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-16 right-6 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute top-1/2 right-1/3 w-[520px] h-[520px] bg-white/5 rounded-full blur-[140px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary text-sm tracking-wide">
                            Build momentum with daily quizzes
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
                            A focused way to
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                master dev fundamentals
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl">
                            DevQuiz combines quick daily practice with clear progress signals.
                            Pick a topic, answer a set, and watch your accuracy and streaks climb.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="group relative px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 w-full sm:w-auto text-center">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-70 group-hover:opacity-100 blur transition duration-300" />
                                <span className="relative text-white font-bold text-lg">
                                    Start Free
                                </span>
                            </Link>
                            <Link to="/login" className="px-8 py-4 rounded-2xl text-white font-bold text-lg border border-white/10 hover:bg-white/5 transition-all w-full sm:w-auto text-center">
                                I Have an Account
                            </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-6">
                            {[
                                { label: 'Topics', value: '12+' },
                                { label: 'Quizzes', value: '300+' },
                                { label: 'Badges', value: '10+' },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-xs uppercase tracking-widest text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/30 rounded-3xl blur-2xl" />
                        <div className="absolute -bottom-10 right-0 w-32 h-32 bg-primary/30 rounded-3xl blur-2xl" />
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="text-xs uppercase tracking-widest text-gray-400">Daily Set</div>
                                    <div className="text-2xl font-bold text-white">Frontend Foundations</div>
                                </div>
                                <div className="text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full">8 Questions</div>
                            </div>
                            <div className="space-y-4">
                                {['Semantic HTML', 'Flexbox Layouts', 'Async JavaScript'].map((item) => (
                                    <div key={item} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                                        <div className="text-white">{item}</div>
                                        <div className="text-xs text-gray-400">In Progress</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4">
                                <div className="text-gray-400 text-sm mb-2">Weekly Streak</div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-secondary to-primary" style={{ width: '68%' }} />
                                </div>
                                <div className="text-xs text-gray-500 mt-2">Keep the streak alive to unlock badges.</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Instant Feedback',
                            desc: 'Every question shows the correct answer and tips to learn faster.',
                        },
                        {
                            title: 'Progress You Can See',
                            desc: 'Track accuracy, streaks, badges, and topic performance in one dashboard.',
                        },
                        {
                            title: 'Competitive Energy',
                            desc: 'Climb the leaderboard by hitting consistent, high-quality quiz scores.',
                        },
                    ].map((feature) => (
                        <div key={feature.title} className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 border border-white/10 mb-5" />
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </section>

                <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                        <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
                        <div className="space-y-4">
                            {[
                                { step: '01', title: 'Pick a topic', desc: 'Choose HTML, CSS, JS, or a quiz set.' },
                                { step: '02', title: 'Answer and learn', desc: 'Each question explains the correct answer.' },
                                { step: '03', title: 'Track your wins', desc: 'See streaks, badges, and leaderboard rank.' },
                            ].map((item) => (
                                <div key={item.step} className="flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <div className="text-secondary font-bold text-lg">{item.step}</div>
                                    <div>
                                        <div className="text-white font-semibold">{item.title}</div>
                                        <div className="text-gray-400 text-sm">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Built for consistent practice</h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            DevQuiz is designed for 5-10 minute sessions. You will always know where to improve,
                            and the app keeps you engaged with streaks and badges.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {['HTML', 'CSS', 'JavaScript', 'React', 'Node', 'SQL'].map((tag) => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-20">
                    <div className="bg-gradient-to-r from-primary/30 to-secondary/30 border border-white/10 rounded-3xl p-10 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to start your streak?</h2>
                        <p className="text-gray-300 mb-8">
                            Join a growing community of devs leveling up every day.
                        </p>
                        <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold">
                            Create Your Account
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
