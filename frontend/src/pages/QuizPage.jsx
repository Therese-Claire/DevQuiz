import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories, topicsByCategory } from '../data/quizMetaData';
import QuestionCard from '../components/QuestionCard';
import { fetchQuestionsByCategoryTopic, fetchQuizSetQuestions } from '../services/api';
import { 
    X, 
    ChevronRight, 
    ChevronLeft, 
    Activity, 
    Target, 
    Zap, 
    Loader2,
    ShieldAlert
} from 'lucide-react';

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

    const category = useMemo(() => categories.find(c => c.id === categoryId), [categoryId]);
    const topicName = useMemo(() => topicsByCategory[categoryId]?.find(t => t.id === topicId)?.name, [categoryId, topicId]);

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
                    setError('Failed to establish mission connection.');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        if (setId || (categoryId && topicId)) loadQuestions();
        return () => { isMounted = false; };
    }, [categoryId, topicId, setId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0814] pt-32 pb-12 px-6 flex flex-col items-center">
                <div className="w-full max-w-3xl space-y-8">
                    <div className="h-32 bg-white/5 border border-white/10 rounded-[2.5rem] animate-pulse" />
                    <div className="h-96 bg-white/5 border border-white/10 rounded-[2.5rem] animate-pulse" />
                </div>
                <div className="mt-12 flex items-center gap-3 text-gray-500 font-mono text-xs uppercase tracking-widest">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Syncing Tactical Data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0814] flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 group">
                    <ShieldAlert size={40} />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">mission Aborted</h1>
                <p className="text-gray-500 mb-8 max-w-sm">{error}</p>
                <button 
                    onClick={() => navigate(setId ? '/dashboard' : `/category/${categoryId}`)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all font-bold"
                >
                    <ChevronLeft size={18} />
                    <span>Back to Safe Zone</span>
                </button>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0814] flex flex-col items-center justify-center text-center p-6">
                 <div className="w-20 h-20 rounded-3xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-6">
                    <Target size={40} />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">No Objectives Found</h1>
                <p className="text-gray-500 mb-8 max-w-sm">
                    This sector currently has no tactical objectives assigned. Please select another module.
                </p>
                <button
                    onClick={() => navigate(setId ? `/dashboard` : `/category/${categoryId}`)}
                    className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all font-black text-sm uppercase tracking-widest"
                >
                    {setId ? 'Back to Command' : 'Change Module'}
                </button>
            </div>
        );
    }

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer) {
            const currentQuestion = questions[currentQuestionIndex];
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
                navigate('/result', {
                    state: {
                        score: newScore,
                        total: questions.length,
                        category: setId ? 'Tactical Set' : category.name,
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
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#0a0814] relative overflow-hidden selection:bg-primary selection:text-white">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[140px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[160px] -z-10" />

            <div className="max-w-4xl mx-auto px-6">
                {/* Mission Header */}
                <div className="mb-12 animate-reveal">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 text-white/5 pointer-events-none">
                            <Activity size={100} strokeWidth={1} />
                        </div>
                        
                        <div className="relative z-10 space-y-2">
                             <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">Operational</span>
                                <span className="text-gray-600 font-mono text-[10px] tracking-widest uppercase italic">Real-Time Sync</span>
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight">
                                {setId ? (setInfo?.name || 'Tactical Mission') : topicName}
                            </h2>
                            <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
                                <span className="text-white/40 uppercase font-mono tracking-widest">{setId ? 'Tac-Set' : category?.name}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-700" />
                                <span>Complete all objectives to synchronize progress.</span>
                            </p>
                        </div>

                        <div className="relative z-10 flex flex-col items-end gap-3 min-w-[200px]">
                            <div className="flex justify-between w-full text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
                                <span>Progress</span>
                                <span className="text-white font-black">{currentQuestionIndex + 1} / {questions.length}</span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_15px_rgba(108,93,211,0.5)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                             <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                                Status: {progress < 100 ? 'In Progress' : 'Analysis Required'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Question Interface */}
                <div className="relative z-10">
                    <QuestionCard
                        questionData={currentQuestion}
                        selectedAnswer={selectedAnswer}
                        onSelectAnswer={handleAnswerSelect}
                    />
                </div>

                {/* Controls */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 animate-reveal [animation-delay:200ms]">
                    <button
                        onClick={() => navigate(setId ? '/dashboard' : `/category/${categoryId}`)}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-all font-mono text-xs uppercase tracking-widest group"
                    >
                        <X size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                        <span>Abort Mission</span>
                    </button>
                    
                    <button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                        className={`
                            relative py-5 px-16 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 shadow-xl flex items-center gap-3 overflow-hidden
                            ${selectedAnswer
                                ? 'bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/20 hover:shadow-primary/40 cursor-pointer group'
                                : 'bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed'
                            }
                        `}
                    >
                         {selectedAnswer && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                        )}
                        <span>{currentQuestionIndex === questions.length - 1 ? 'Analyze Results' : 'Next Objective'}</span>
                        <ChevronRight size={18} className={selectedAnswer ? 'group-hover:translate-x-1 transition-transform' : ''} />
                    </button>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}} />
        </div>
    );
};

export default QuizPage;
