import React, { useState } from 'react';
import { reportQuestion } from '../services/api';
import { 
    AlertCircle, 
    CheckCircle2, 
    Flag, 
    Send, 
    X, 
    ChevronRight,
    MessageSquareWarning,
    Activity
} from 'lucide-react';

const QuestionCard = ({ questionData, selectedAnswer, onSelectAnswer }) => {
    const [showReport, setShowReport] = useState(false);
    const [reason, setReason] = useState('');
    const [reportStatus, setReportStatus] = useState('');
    const [isReporting, setIsReporting] = useState(false);

    const submitReport = async () => {
        if (!reason.trim()) return;
        try {
            setIsReporting(true);
            await reportQuestion({ questionId: questionData.id, reason });
            setReportStatus('Transmission received. Engineering will review.');
            setReason('');
            setTimeout(() => setShowReport(false), 2000);
        } catch {
            setReportStatus('Signal failure. Could not submit report.');
        } finally {
            setIsReporting(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto animate-reveal">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Activity size={16} className="animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">Active Objective</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-white mb-10 leading-[1.4] tracking-tight">
                    {questionData.question}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                    {questionData.options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        return (
                            <button
                                key={index}
                                onClick={() => onSelectAnswer(option)}
                                className={`
                                    group/option relative p-6 rounded-2xl text-left transition-all duration-300 border flex items-center gap-5
                                    ${isSelected
                                        ? 'bg-primary/20 border-primary text-white shadow-[0_0_30px_rgba(108,93,211,0.2)]'
                                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                                    }
                                `}
                            >
                                <div className={`
                                    w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-mono font-bold border transition-all duration-300
                                    ${isSelected
                                        ? 'bg-primary border-primary text-white scale-110'
                                        : 'bg-black/20 border-white/10 text-gray-500 group-hover/option:text-white group-hover/option:border-white/30'
                                    }
                                `}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span className="font-semibold text-lg flex-grow">{option}</span>
                                {isSelected && (
                                    <div className="text-primary animate-reveal">
                                        <CheckCircle2 size={24} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-8">
                    <button
                        onClick={() => setShowReport(!showReport)}
                        className={`
                            flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-all
                            ${showReport ? 'text-primary' : 'text-gray-500 hover:text-white'}
                        `}
                    >
                        <Flag size={14} />
                        <span>Report Objective Issue</span>
                    </button>
                    
                    {reportStatus && !showReport && (
                        <div className="flex items-center gap-2 text-[10px] font-mono text-secondary uppercase animate-reveal">
                            <AlertCircle size={12} />
                            <span>{reportStatus}</span>
                        </div>
                    )}
                </div>

                {showReport && (
                    <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 animate-reveal">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <MessageSquareWarning size={14} />
                                Technical Discrepancy
                            </h4>
                            <button onClick={() => setShowReport(false)} className="text-gray-500 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>
                        <textarea
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-600 min-h-[100px] resize-none"
                            placeholder="Describe the issue (e.g. incorrect answer, ambiguity...)"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        <div className="flex justify-between items-center mt-5">
                             {reportStatus && <span className="text-[10px] font-mono text-secondary uppercase italic">{reportStatus}</span>}
                             <div className="flex-grow" />
                            <button
                                onClick={submitReport}
                                disabled={!reason.trim() || isReporting}
                                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20"
                            >
                                {isReporting ? 'Transmitting...' : (
                                    <>
                                        <span>Submit Data</span>
                                        <Send size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionCard;
