import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories as displayCategories } from '../data/quizMetaData';
import { fetchMetadata, fetchQuizSets } from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [quizSets, setQuizSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [setsLoading, setSetsLoading] = useState(true);
    const [error, setError] = useState('');
    const [setsError, setSetsError] = useState('');

    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };

    useEffect(() => {
        let isMounted = true;
        const loadMetadata = async () => {
            try {
                setLoading(true);
                const data = await fetchMetadata();
                const merged = (data.categories || []).map((c) => {
                    const display = displayCategories.find((d) => d.id === c.categoryId);
                    return display || {
                        id: c.categoryId,
                        name: c.categoryId,
                        icon: '🧩',
                        description: 'Quiz category',
                    };
                });
                if (isMounted) {
                    setCategories(merged);
                    setError('');
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load categories.');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        const loadQuizSets = async () => {
            try {
                setSetsLoading(true);
                const data = await fetchQuizSets();
                if (isMounted) {
                    setQuizSets(data || []);
                    setSetsError('');
                }
            } catch (err) {
                if (isMounted) setSetsError('Failed to load quiz sets.');
            } finally {
                if (isMounted) setSetsLoading(false);
            }
        };
        loadMetadata();
        loadQuizSets();
        return () => {
            isMounted = false;
        };
    }, []);

    const featured = useMemo(() => categories.slice(0, 6), [categories]);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
            <div className="absolute top-16 left-8 w-72 h-72 bg-primary/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-16 right-6 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
                    <div className="space-y-5">
                        <div className="text-xs uppercase tracking-widest text-gray-500">Your learning hub</div>
                        <h1 className="text-4xl md:text-5xl font-black text-white">
                            Pick a path and start building momentum
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                            Choose a category to dive into focused topics, or pick a curated quiz set to practice
                            by difficulty.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {['Streaks', 'Badges', 'Leaderboards', 'Analytics'].map((pill) => (
                                <span key={pill} className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-sm">
                                    {pill}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-sm uppercase tracking-widest text-gray-400">Today&apos;s focus</div>
                            <div className="text-xs text-gray-300 bg-white/10 px-3 py-1 rounded-full">Quick set</div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-2">Frontend Fundamentals</div>
                        <div className="text-gray-400 mb-6">Warm up with a short, high-impact quiz set.</div>
                        <button
                            onClick={() => quizSets[0] && navigate(`/quiz-set/${quizSets[0].id}`)}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold"
                            disabled={!quizSets[0]}
                        >
                            Start Today&apos;s Set
                        </button>
                    </div>
                </section>

                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Browse Categories</h2>
                            <p className="text-gray-400">Explore topics and build your roadmap</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {loading && (
                            <>
                                <div className="h-40 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                                <div className="h-40 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                                <div className="h-40 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                            </>
                        )}
                        {!loading && featured.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className="group relative p-8 rounded-3xl border bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left overflow-hidden hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/10 transition-colors" />
                                <span className="text-4xl mb-4 block">{cat.icon}</span>
                                <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                                <p className="text-gray-400 text-sm">{cat.description}</p>
                            </button>
                        ))}
                    </div>
                    {error && (
                        <div className="text-center text-sm text-red-400 mt-4">
                            {error}
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Quiz Sets</h2>
                            <p className="text-gray-400">Practice by difficulty or take curated sets</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {setsLoading && (
                            <>
                                <div className="h-40 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                                <div className="h-40 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                                <div className="h-40 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                            </>
                        )}
                        {!setsLoading && quizSets.map((set) => (
                            <button
                                key={set.id}
                                onClick={() => navigate(`/quiz-set/${set.id}`)}
                                className="group relative p-8 rounded-3xl border bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left overflow-hidden hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/10 transition-colors" />
                                <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">{set.difficulty}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{set.name}</h3>
                                <p className="text-gray-400 text-sm">{set.description || 'Curated quiz set'}</p>
                            </button>
                        ))}
                    </div>
                    {setsError && (
                        <div className="text-center text-sm text-red-400 mt-4">
                            {setsError}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
