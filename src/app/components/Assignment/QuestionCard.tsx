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
    return (
        <div className="space-y-4">
            <p className="text-lg font-semibold">{question.prompt}</p>

            <input
                type="text"
                value={answer}
                onChange={(e) => onAnswerChange(e.target.value)}
                disabled={submitted}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Enter your answer"
            />

            <button
                onClick={onSubmit}
                disabled={submitted}
                className="w-full mt-2 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-40"
            >
                {submitted ? "Submitted" : "Submit Answer"}
            </button>

            {feedback && (
                <p className="mt-2 text-lg font-medium">{feedback}</p>
            )}
        </div>
    );
}