import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories, topicsByCategory } from '../data/quizMetaData';
import QuestionCard from '../components/QuestionCard';
import { fetchQuestionsByCategoryTopic, fetchQuizSetQuestions } from '../services/api';

const QuizPage = () => {
    const { categoryId, topicId, setId } = useParams();
    const navigate = useNavigate();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [setInfo, setSetInfo] = useState(null);

    const category = categories.find(c => c.id === categoryId);
    const topicName = topicsByCategory[categoryId]?.find(t => t.id === topicId)?.name;

    useEffect(() => {
        let isMounted = true;
        const loadQuestions = async () => {
            try {
                setLoading(true);
                let data;
                if (setId) {
                    data = await fetchQuizSetQuestions(setId);
                } else {
                    data = await fetchQuestionsByCategoryTopic(categoryId, topicId);
                }
                if (isMounted) {
                    setQuestions(data.questions || []);
                    setSetInfo(data.set || null);
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
        if (setId || (categoryId && topicId)) loadQuestions();
        return () => {
            isMounted = false;
        };
    }, [categoryId, topicId, setId]);

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
                        onClick={() => navigate(setId ? `/dashboard` : `/category/${categoryId}`)}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-white/10"
                    >
                        {setId ? 'Back to Dashboard' : 'Back to Topics'}
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
                        category: setId ? 'Quiz Set' : category.name,
                        topic: setId ? (setInfo?.name || 'Quiz Set') : topicName,
                        setId: setId || null,
                        categoryId,
                        topicId
                    }
                });
            }
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-16 right-8 w-80 h-80 bg-secondary/20 rounded-full blur-[140px] -z-10" />

            <div className="w-full max-w-4xl mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                                {setId ? 'Quiz Set' : 'Category'}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white">
                                {setId ? (setInfo?.name || 'Loading...') : category.name}
                            </h2>
                            <p className="text-gray-400 mt-2">
                                {setId ? 'Focused practice with curated questions.' : topicName}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-400">Progress</div>
                            <div className="text-xl text-white font-semibold">
                                {currentQuestionIndex + 1} / {questions.length}
                            </div>
                            <div className="mt-2 w-40 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500 ease-out"
                                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <QuestionCard
                    questionData={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onSelectAnswer={handleAnswerSelect}
                />

                <div className="flex items-center justify-between mt-8">
                    <button
                        onClick={() => navigate(setId ? '/dashboard' : `/category/${categoryId}`)}
                        className="px-5 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Exit Quiz
                    </button>
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
