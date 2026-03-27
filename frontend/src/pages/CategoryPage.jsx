import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories as displayCategories, topicsByCategory as displayTopics } from '../data/quizMetaData';
import { fetchMetadata, fetchCounts } from '../services/api';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const category = useMemo(() => displayCategories.find(c => c.id === categoryId), [categoryId]);

    useEffect(() => {
        let isMounted = true;
        const loadMetadata = async () => {
            try {
                setLoading(true);
                const [meta, countsResp] = await Promise.all([
                    fetchMetadata(),
                    fetchCounts(categoryId),
                ]);
                const backendTopics = meta.topicsByCategory?.[categoryId] || [];
                const countsByTopic = (countsResp.counts || []).reduce((acc, t) => {
                    acc[t.topicId] = t.count;
                    return acc;
                }, {});
                const merged = backendTopics.map((t) => {
                    const display = displayTopics[categoryId]?.find((d) => d.id === t.topicId);
                    return display || {
                        id: t.topicId,
                        name: t.topicId,
                        description: 'Quiz topic',
                    };
                }).map((t) => ({
                    ...t,
                    count: countsByTopic[t.id] || 0,
                }));
                if (isMounted) {
                    setTopics(merged);
                    setError('');
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load topics. Please try again.');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        if (categoryId) loadMetadata();
        return () => {
            isMounted = false;
        };
    }, [categoryId]);

    if (!category) {
        return <div className="text-white text-center pt-32">Category not found</div>;
    }

    const handleStartQuiz = (topicId) => {
        navigate(`/quiz/${categoryId}/${topicId}`);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-12 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-[140px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 mb-10 backdrop-blur-xl shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-3xl">
                            {category.icon}
                        </div>
                        <div className="flex-1">
                            <div className="text-xs uppercase tracking-widest text-gray-500">Category</div>
                            <h1 className="text-4xl font-black text-white mb-2">{category.name}</h1>
                            <p className="text-gray-400 max-w-2xl">{category.description}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-300">
                            {topics.length} topics
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8">
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Choose a topic</h2>
                            <div className="text-sm text-gray-400">Jump into a focused quiz</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {loading && (
                                <>
                                    <div className="h-40 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                                    <div className="h-40 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                                    <div className="h-40 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                                    <div className="h-40 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                                </>
                            )}
                            {!loading && topics.map((topic) => (
                                <div key={topic.id} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-secondary/50 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-xl font-bold text-white">{topic.name}</h4>
                                        <span className="bg-white/10 text-xs px-2 py-1 rounded-md text-gray-300">
                                            {`${topic.count || 0} Qs`}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-6 min-h-[40px]">{topic.description}</p>

                                    <button
                                        onClick={() => handleStartQuiz(topic.id)}
                                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2 group-hover:bg-secondary group-hover:border-secondary"
                                    >
                                        Start Quiz
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        {!loading && topics.length === 0 && (
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center text-gray-400">
                                No topics available yet.
                            </div>
                        )}
                    </div>

                    <aside className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-3">Practice tips</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li>Warm up with short sets before tackling advanced topics.</li>
                                <li>Track streaks in your profile to stay consistent.</li>
                                <li>Report any broken questions directly from the quiz.</li>
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 rounded-3xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-3">Ready for a challenge?</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Jump into a quiz set for a focused, timed experience.
                            </p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full py-3 rounded-xl bg-white text-gray-900 font-semibold"
                            >
                                View Quiz Sets
                            </button>
                        </div>
                    </aside>
                </div>

                {error && (
                    <div className="mt-6 text-center text-sm text-red-400">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
