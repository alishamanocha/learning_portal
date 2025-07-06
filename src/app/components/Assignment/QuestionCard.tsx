"use client";

import React, { useState } from "react";
import { Question } from "../../types/firestore";

// TODO: questions may have multiple formats (e.g., multiple choice, free response), and answer may not be a number
// TODO: allow LateX formatting for questions
// TODO: allow images to be added to questions

type Props = {
    question: Question;
    answer: string | string[] | boolean | Record<string, string>;
    onAnswerChange: (value: string | string[] | boolean | Record<string, string>) => void;
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

    const renderAnswerInput = () => {
        switch (question.type) {
            case 'free_response':
                return (
                    <input
                        type="text"
                        value={typeof answer === 'string' ? answer : ''}
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
                );

            case 'multiple_choice':
                return (
                    <div className="space-y-3">
                        {question.options?.map((option, index) => (
                            <label
                                key={index}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    submitted
                                        ? 'bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600'
                                        : typeof answer === 'string' && answer === option
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                                        : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="multiple-choice"
                                    value={option}
                                    checked={typeof answer === 'string' && answer === option}
                                    onChange={(e) => onAnswerChange(e.target.value)}
                                    disabled={submitted}
                                    className="mr-3"
                                />
                                <span className="text-lg text-gray-900 dark:text-white">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'multiple_choice_multiple':
                const selectedAnswers = Array.isArray(answer) ? answer : [];
                return (
                    <div className="space-y-3">
                        {question.options?.map((option, index) => (
                            <label
                                key={index}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    submitted
                                        ? 'bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600'
                                        : selectedAnswers.includes(option)
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                                        : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={selectedAnswers.includes(option)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            onAnswerChange([...selectedAnswers, option]);
                                        } else {
                                            onAnswerChange(selectedAnswers.filter(a => a !== option));
                                        }
                                    }}
                                    disabled={submitted}
                                    className="mr-3"
                                />
                                <span className="text-lg text-gray-900 dark:text-white">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'true_false':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {['True', 'False'].map((option) => (
                            <label
                                key={option}
                                className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    submitted
                                        ? 'bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600'
                                        : typeof answer === 'boolean' && answer === (option === 'True')
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                                        : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="true-false"
                                    value={option}
                                    checked={typeof answer === 'boolean' && answer === (option === 'True')}
                                    onChange={(e) => onAnswerChange(e.target.value === 'True')}
                                    disabled={submitted}
                                    className="mr-3"
                                />
                                <span className="text-lg text-gray-900 dark:text-white">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'matching':
                const matchingAnswer = typeof answer === 'object' && !Array.isArray(answer) ? answer as Record<string, string> : {};
                return (
                    <div className="space-y-4">
                        {question.pairs?.map((pair, index) => (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                                <div className="flex-1">
                                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                                        {pair.left}
                                    </span>
                                </div>
                                <div className="text-2xl text-gray-400">→</div>
                                <div className="flex-1">
                                    <select
                                        value={matchingAnswer[pair.left] || ''}
                                        onChange={(e) => {
                                            const newAnswer = { ...matchingAnswer };
                                            newAnswer[pair.left] = e.target.value;
                                            onAnswerChange(newAnswer);
                                        }}
                                        disabled={submitted}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Select...</option>
                                        {question.pairs?.map((p, i) => (
                                            <option key={i} value={p.right}>
                                                {p.right}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return (
                    <input
                        type="text"
                        value={typeof answer === 'string' ? answer : ''}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        disabled={submitted}
                        className="w-full px-4 py-4 rounded-xl border-2 text-lg"
                        placeholder="Type your answer here..."
                    />
                );
        }
    };

    const isAnswerValid = () => {
        switch (question.type) {
            case 'free_response':
                return typeof answer === 'string' && answer.trim().length > 0;
            case 'multiple_choice':
                return typeof answer === 'string' && answer.length > 0;
            case 'multiple_choice_multiple':
                return Array.isArray(answer) && answer.length > 0;
            case 'true_false':
                return typeof answer === 'boolean';
            case 'matching':
                if (typeof answer === 'object' && !Array.isArray(answer)) {
                    const matchingAnswer = answer as Record<string, string>;
                    return question.pairs?.every(pair => matchingAnswer[pair.left]) || false;
                }
                return false;
            default:
                return false;
        }
    };

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
                    <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-sm text-gray-600 dark:text-gray-400">
                        {question.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
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
                    {renderAnswerInput()}
                    
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
                    disabled={submitted || !isAnswerValid()}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                        submitted
                            ? 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : !isAnswerValid()
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
                        {question.type === 'free_response' && "💡 Tip: Make sure to check your spelling and capitalization"}
                        {question.type === 'multiple_choice' && "💡 Tip: Select the best answer from the options provided"}
                        {question.type === 'multiple_choice_multiple' && "💡 Tip: You can select multiple answers"}
                        {question.type === 'true_false' && "💡 Tip: Choose True or False based on the statement"}
                        {question.type === 'matching' && "💡 Tip: Match each item on the left with its corresponding item on the right"}
                    </p>
                </div>
            )}
        </div>
    );
}