import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizData, categories } from '../data/mockQuizData';
import QuestionCard from '../components/QuestionCard';

const QuizPage = () => {
    const { categoryId, topicId } = useParams();
    const navigate = useNavigate();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const category = categories.find(c => c.id === categoryId);
    const questions = quizData[categoryId]?.questions[topicId];
    const topicName = quizData[categoryId]?.topics.find(t => t.id === topicId)?.name;

    if (!questions) {
        return <div className="text-white text-center pt-32">Quiz not found</div>;
    }

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer) {
            const currentQuestion = questions[currentQuestionIndex];

            // Calculate Score (Pass to result page to show details)
            let newScore = score;
            if (selectedAnswer === currentQuestion.correctAnswer) {
                newScore = score + 1;
                setScore(newScore);
            }

            const nextQuestion = currentQuestionIndex + 1;
            if (nextQuestion < questions.length) {
                setCurrentQuestionIndex(nextQuestion);
                setSelectedAnswer(null);
            } else {
                // Navigate to Results
                navigate('/result', {
                    state: {
                        score: newScore,
                        total: questions.length,
                        category: category.name,
                        topic: topicName
                    }
                });
            }
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
            <div className="w-full max-w-3xl">
                {/* HUD */}
                <div className="w-full flex justify-between items-end mb-8 px-4">
                    <div>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
                            {category.name} / {topicName}
                        </span>
                        <h2 className="text-3xl font-bold text-white">
                            Question {currentQuestionIndex + 1}<span className="text-lg text-gray-500 font-medium">/{questions.length}</span>
                        </h2>
                    </div>
                    <div className="flex flex-col items-end">
                        {/* Progress Bar */}
                        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500 ease-out"
                                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <QuestionCard
                    questionData={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onSelectAnswer={handleAnswerSelect}
                />

                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                        className={`
                py-4 px-12 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg
                ${selectedAnswer
                                ? 'bg-secondary hover:bg-secondary/80 text-white hover:scale-105 hover:shadow-secondary/30 cursor-pointer'
                                : 'bg-white/5 text-gray-500 cursor-not-allowed'
                            }
                `}
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
