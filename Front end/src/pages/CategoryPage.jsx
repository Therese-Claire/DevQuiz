import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories, quizData } from '../data/mockQuizData';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const category = categories.find(c => c.id === categoryId);
    const topics = quizData[categoryId]?.topics;

    if (!category || !topics) {
        return <div className="text-white text-center pt-32">Category not found</div>;
    }

    const handleStartQuiz = (topicId) => {
        navigate(`/quiz/${categoryId}/${topicId}`);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
            <div className="max-w-6xl w-full">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>

                <div className="flex items-center gap-4 mb-12 animate-fade-in-up">
                    <span className="text-6xl">{category.icon}</span>
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{category.name} Quizzes</h1>
                        <p className="text-gray-400">{category.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {topics.map((topic) => (
                        <div key={topic.id} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-secondary/50 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-xl font-bold text-white">{topic.name}</h4>
                                <span className="bg-white/10 text-xs px-2 py-1 rounded-md text-gray-300">
                                    {quizData[categoryId].questions[topic.id].length} Qs
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-6 h-10">{topic.description}</p>

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
            </div>
        </div>
    );
};

export default CategoryPage;
