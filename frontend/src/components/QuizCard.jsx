import React from 'react';

export default function QuizCard({ questionData, questionNumber, totalQuestions, onAnswer }) {
    const { question, options, category } = questionData;

    return (
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
            {/* Header */}
            <div className="bg-primary p-6 text-white flex justify-between items-center relative overflow-hidden">
                {/* Decorative circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>

                <div className="z-10">
                    <span className="text-secondary font-bold uppercase tracking-wider text-xs md:text-sm bg-white/20 px-2 py-1 rounded-full">{category} Quiz</span>
                    <h2 className="text-xl md:text-2xl font-semibold mt-2">Question {questionNumber} <span className="text-sm font-normal opacity-80">/ {totalQuestions}</span></h2>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5">
                <div
                    className="bg-secondary h-1.5 transition-all duration-500 ease-out"
                    style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                ></div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-6 leading-relaxed">
                    {question}
                </h3>

                <div className="space-y-3">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => onAnswer(option)}
                            className="w-full text-left p-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 hover:border-primary hover:bg-violet-50 dark:hover:bg-slate-700/50 transition-all duration-200 group flex items-center"
                        >
                            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300 font-bold flex flex-shrink-0 items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-slate-700 dark:text-slate-200 font-medium text-lg">{option}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
