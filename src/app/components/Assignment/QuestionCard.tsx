"use client";

import React from "react";

// TODO: questions may have multiple formats (e.g., multiple choice, free response), and answer may not be a number
// TODO: allow LateX formatting for questions
// TODO: allow images to be added to questions
type Question = {
    prompt: string;
    correctAnswer: string;
};

type Props = {
    question: Question;
    answer: string;
    onAnswerChange: (value: string) => void;
    onSubmit: () => void;
    feedback: string;
    submitted: boolean;
};

export default function QuestionCard({
    question,
    answer,
    onAnswerChange,
    onSubmit,
    feedback,
    submitted,
}: Props) {
    const isCorrect = feedback.includes("Correct!");
    const hasFeedback = feedback.length > 0;

    return (
        <div className="p-6 space-y-6">
            {/* Question */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <span className="text-blue-600 dark:text-blue-400 text-lg">❓</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Question
                    </h2>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 border border-gray-200 dark:border-slate-600">
                    <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
                        {question.prompt}
                    </p>
                </div>
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <span className="text-green-600 dark:text-green-400 text-lg">✏️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Your Answer
                    </h3>
                </div>
                
                <div className="relative">
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        disabled={submitted}
                        className={`w-full px-4 py-4 rounded-xl border-2 text-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                            submitted
                                ? 'bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400'
                                : hasFeedback
                                ? isCorrect
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600 text-green-900 dark:text-green-100'
                                    : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600 text-red-900 dark:text-red-100'
                                : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white hover:border-blue-400 dark:hover:border-blue-500'
                        }`}
                        placeholder="Type your answer here..."
                    />
                    
                    {submitted && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <span className="text-2xl">
                                {isCorrect ? '✅' : '❌'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    onClick={onSubmit}
                    disabled={submitted || !answer.trim()}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                        submitted
                            ? 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : !answer.trim()
                            ? 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                >
                    {submitted ? (
                        <span className="flex items-center justify-center space-x-2">
                            <span>✓</span>
                            <span>Submitted</span>
                        </span>
                    ) : (
                        <span className="flex items-center justify-center space-x-2">
                            <span>📤</span>
                            <span>Submit Answer</span>
                        </span>
                    )}
                </button>
            </div>

            {/* Feedback */}
            {hasFeedback && (
                <div className={`rounded-xl p-4 border-2 transition-all duration-300 ${
                    isCorrect
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                }`}>
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                            isCorrect
                                ? 'bg-green-100 dark:bg-green-800'
                                : 'bg-red-100 dark:bg-red-800'
                        }`}>
                            <span className={`text-lg ${
                                isCorrect
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}>
                                {isCorrect ? '🎉' : '💡'}
                            </span>
                        </div>
                        <div>
                            <h4 className={`font-semibold ${
                                isCorrect
                                    ? 'text-green-800 dark:text-green-200'
                                    : 'text-red-800 dark:text-red-200'
                            }`}>
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </h4>
                            <p className={`text-sm ${
                                isCorrect
                                    ? 'text-green-700 dark:text-green-300'
                                    : 'text-red-700 dark:text-red-300'
                            }`}>
                                {feedback}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Help Text */}
            {!submitted && (
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        💡 Tip: Make sure to check your spelling and capitalization
                    </p>
                </div>
            )}
        </div>
    );
}