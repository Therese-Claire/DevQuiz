import React from 'react';
import { Trophy, Home, RotateCcw } from 'lucide-react';

export default function ResultCard({ score, totalQuestions, onRetry, onHome }) {
    const percentage = (score / totalQuestions) * 100;
    let message = '';
    let subMessage = '';

    if (percentage === 100) {
        message = 'Perfect Score!';
        subMessage = 'You are a master!';
    } else if (percentage >= 80) {
        message = 'Great Job!';
        subMessage = 'Almost there!';
    } else if (percentage >= 50) {
        message = 'Good Effort!';
        subMessage = 'Keep practicing!';
    } else {
        message = 'Needs Improvement';
        subMessage = 'Don\'t give up!';
    }

    return (
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 text-center animate-fade-in-up transition-all duration-300">
            <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                    <Trophy className="w-12 h-12 text-white" />
                </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{message}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{subMessage}</p>

            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-6 mb-8 transform hover:scale-105 transition-transform duration-200">
                <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide font-bold mb-1">Your Score</div>
                <div className="text-5xl font-extrabold text-primary dark:text-indigo-400">
                    {score} <span className="text-xl text-slate-400 dark:text-slate-500">/ {totalQuestions}</span>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={onRetry}
                    className="w-full bg-primary hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-95"
                >
                    <RotateCcw className="w-5 h-5" />
                    Play Again
                </button>
                <button
                    onClick={onHome}
                    className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </button>
            </div>
        </div>
    );
}
