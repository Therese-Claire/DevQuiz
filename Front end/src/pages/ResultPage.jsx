import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const ResultPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return <Navigate to="/dashboard" />;
    }

    const { score, total, category, topic } = state;
    const percentage = Math.round((score / total) * 100);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 text-center max-w-lg w-full animate-fade-in-up">
                {percentage >= 80 ? (
                    <span className="text-6xl mb-6 block">🏆</span>
                ) : percentage >= 50 ? (
                    <span className="text-6xl mb-6 block">👏</span>
                ) : (
                    <span className="text-6xl mb-6 block">📚</span>
                )}

                <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
                <p className="text-gray-300 mb-8">{category}: {topic}</p>

                <div className="bg-white/5 rounded-2xl p-8 mb-8 border border-white/10 relative overflow-hidden">
                    <div className={`text-6xl font-black mb-2 ${percentage >= 50 ? 'text-secondary' : 'text-primary'}`}>
                        {percentage}%
                    </div>
                    <p className="text-xl text-gray-200">
                        You scored <span className="font-bold text-white">{score}</span> out of <span className="font-bold text-white">{total}</span>
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/dashboard"
                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all duration-300 border border-white/10"
                    >
                        Back to Dashboard
                    </Link>
                    <button
                        onClick={() => navigate(-1)} // Naive replay, ideally navigate specifically to quiz start
                        className="bg-primary hover:bg-primary/80 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/50"
                    >
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
