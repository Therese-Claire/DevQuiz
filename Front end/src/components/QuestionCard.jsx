import React from 'react';

const QuestionCard = ({ questionData, selectedAnswer, onSelectAnswer }) => {
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
        </div>
    );
};

export default QuestionCard;
