import React, { useState } from 'react';
import { reportQuestion } from '../services/api';

const QuestionCard = ({ questionData, selectedAnswer, onSelectAnswer }) => {
    const [showReport, setShowReport] = useState(false);
    const [reason, setReason] = useState('');
    const [reportStatus, setReportStatus] = useState('');

    const submitReport = async () => {
        if (!reason.trim()) return;
        try {
            await reportQuestion({ questionId: questionData.id, reason });
            setReportStatus('Report submitted.');
            setReason('');
            setShowReport(false);
        } catch {
            setReportStatus('Failed to submit report.');
        }
    };
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 w-full max-w-2xl mx-4">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
                {questionData.question}
            </h3>
            <div className="flex flex-col gap-4">
                {questionData.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectAnswer(option)}
                        className={`
              p-5 rounded-2xl text-left transition-all duration-300 border-2 font-medium text-lg flex items-center
              ${selectedAnswer === option
                                ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(108,93,211,0.5)] scale-[1.02]'
                                : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/30 hover:scale-[1.01]'
                            }
            `}
                    >
                        <span className={`
              w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold border
              ${selectedAnswer === option
                                ? 'bg-white text-primary border-white'
                                : 'border-white/30 text-white/50'
                            }
            `}>
                            {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                    </button>
                ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
                <button
                    onClick={() => setShowReport((s) => !s)}
                    className="text-gray-300 hover:text-white transition-colors"
                >
                    Report question
                </button>
                {reportStatus && <span>{reportStatus}</span>}
            </div>
            {showReport && (
                <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                    <textarea
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                        placeholder="What’s wrong with this question?"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <div className="flex justify-end mt-3">
                        <button
                            onClick={submitReport}
                            className="bg-secondary text-white px-4 py-2 rounded-xl"
                        >
                            Submit Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;
