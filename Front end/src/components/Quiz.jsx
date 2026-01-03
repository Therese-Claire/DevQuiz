import React, { useState } from 'react';
import { categories, quizData } from '../data/mockQuizData';
import QuestionCard from './QuestionCard';

const Quiz = () => {
    const [currentCategory, setCurrentCategory] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const handleCategorySelect = (categoryId) => {
        setCurrentCategory(categoryId);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer(null);
    };

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer) {
            const currentQuizData = quizData[currentCategory];
            const currentQuestion = currentQuizData[currentQuestionIndex];

            if (selectedAnswer === currentQuestion.correctAnswer) {
                setScore(prev => prev + 1);
            }

            const nextQuestion = currentQuestionIndex + 1;
            if (nextQuestion < currentQuizData.length) {
                setCurrentQuestionIndex(nextQuestion);
                setSelectedAnswer(null);
            } else {
                setShowScore(true);
            }
        }
    };

    const restartQuiz = () => {
        setCurrentCategory(null);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer(null);
    };

    // Category Selection View
    if (!currentCategory) {
        return (
            <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
                    Welcome to <span className="text-secondary">TaskQuiz</span>
                </h1>
                <p className="text-gray-300 text-lg mb-12 text-center max-w-md">
                    Challenge yourself with our curated quizzes. Select a category to begin your journey.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.id)}
                            className="group bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(108,93,211,0.3)] flex flex-col items-center gap-4"
                        >
                            <span className="text-6xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                                {cat.icon}
                            </span>
                            <span className="text-2xl font-bold text-white group-hover:text-secondary transition-colors">
                                {cat.name}
                            </span>
                            <span className="text-sm text-gray-400 bg-black/20 px-4 py-1 rounded-full">
                                {quizData[cat.id].length} Questions
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Result View
    if (showScore) {
        return (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 text-center max-w-lg w-full mx-4 animate-fade-in-up">
                <div className="mb-8">
                    <span className="text-6xl mb-4 block">🏆</span>
                    <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
                    <p className="text-gray-300">Here is your performance</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-8 mb-8 border border-white/10">
                    <div className="text-6xl font-black text-secondary mb-2">
                        {Math.round((score / quizData[currentCategory].length) * 100)}%
                    </div>
                    <p className="text-xl text-gray-200">
                        You scored <span className="font-bold text-white">{score}</span> out of <span className="font-bold text-white">{quizData[currentCategory].length}</span>
                    </p>
                </div>

                <button
                    onClick={restartQuiz}
                    className="bg-primary hover:bg-primary/80 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/50 w-full text-lg"
                >
                    Play Again
                </button>
            </div>
        );
    }

    // Question View
    const currentQuizData = quizData[currentCategory];
    const currentQuestion = currentQuizData[currentQuestionIndex];

    return (
        <div className="w-full flex flex-col items-center max-w-3xl mx-auto">
            {/* HUD */}
            <div className="w-full flex justify-between items-end mb-8 px-4">
                <div>
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Question</span>
                    <h2 className="text-3xl font-bold text-white">
                        {currentQuestionIndex + 1}<span className="text-lg text-gray-500 font-medium">/{currentQuizData.length}</span>
                    </h2>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-secondary uppercase tracking-wider mb-1">{categories.find(c => c.id === currentCategory).name}</span>
                    {/* Progress Bar */}
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500 ease-out"
                            style={{ width: `${((currentQuestionIndex + 1) / currentQuizData.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <QuestionCard
                questionData={currentQuestion}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={handleAnswerSelect}
            />

            <button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className={`
          mt-8 py-4 px-12 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg
          ${selectedAnswer
                        ? 'bg-secondary hover:bg-secondary/80 text-white hover:scale-105 hover:shadow-secondary/30 cursor-pointer'
                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }
        `}
            >
                {currentQuestionIndex === currentQuizData.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
        </div>
    );
};

export default Quiz;
