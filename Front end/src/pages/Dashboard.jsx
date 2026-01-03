import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/mockQuizData';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
            <div className="max-w-6xl w-full">
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400 mb-12">Select a category to explore topics</p>

                {/* Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-in-up">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className="group relative p-8 rounded-3xl border bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left overflow-hidden hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(108,93,211,0.3)]"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/10 transition-colors" />

                            <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                            <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                            <p className="text-gray-400 text-sm">{cat.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
