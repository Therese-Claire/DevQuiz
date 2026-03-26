import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories, topicsByCategory } from '../data/quizMetaData';
import QuestionCard from '../components/QuestionCard';
import { fetchQuestionsByCategoryTopic } from '../services/api';

const QuizPage = () => {
    const { categoryId, topicId } = useParams();
    const navigate = useNavigate();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const category = categories.find(c => c.id === categoryId);
    const topicName = topicsByCategory[categoryId]?.find(t => t.id === topicId)?.name;

    useEffect(() => {
        let isMounted = true;
        const loadQuestions = async () => {
            try {
                setLoading(true);
                const data = await fetchQuestionsByCategoryTopic(categoryId, topicId);
                if (isMounted) {
                    setQuestions(data.questions || []);
                    setError('');
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setSelectedAnswer(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load quiz questions.');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        if (categoryId && topicId) loadQuestions();
        return () => {
            isMounted = false;
        };
    }, [categoryId, topicId]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
                <div className="w-full max-w-3xl">
                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 animate-pulse">
                        <div className="h-4 w-40 bg-white/10 rounded mb-4" />
                        <div className="h-8 w-64 bg-white/10 rounded mb-8" />
                        <div className="space-y-4">
                            <div className="h-14 bg-white/10 rounded-2xl" />
                            <div className="h-14 bg-white/10 rounded-2xl" />
                            <div className="h-14 bg-white/10 rounded-2xl" />
                            <div className="h-14 bg-white/10 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-white text-center pt-32">{error}</div>;
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
                <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/20 text-center max-w-lg w-full animate-fade-in-up">
                    <div className="text-5xl mb-4">📭</div>
                    <h2 className="text-2xl font-bold text-white mb-2">No questions found</h2>
                    <p className="text-gray-400 mb-6">
                        This topic doesn’t have any questions yet. Please choose another topic.
                    </p>
                    <button
                        onClick={() => navigate(`/category/${categoryId}`)}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-white/10"
                    >
                        Back to Topics
                    </button>
                </div>
            </div>
        );
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
