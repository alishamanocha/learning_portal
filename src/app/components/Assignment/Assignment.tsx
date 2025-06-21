"use client";

import React, { useState } from "react";
import QuestionCard from "./QuestionCard";

// TODO: should come from database
const questions = [
    { id: 1, prompt: "What is 30% of 40?", correctAnswer: "12" },
    { id: 2, prompt: "What is 15% of 80?", correctAnswer: "12" },
    { id: 3, prompt: "What is 50% of 90?", correctAnswer: "45" },
];

export default function Assignment({ asgnName }: { asgnName: string }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
    const [feedback, setFeedback] = useState("");

    const handleAnswerChange = (value: string) => {
        const updated = [...answers];
        // Update answers array to hold user answer
        updated[currentQuestionIndex] = value;
        setAnswers(updated);
        // Reset feedback
        setFeedback("");
    };

    const handleSubmit = () => {
        // Compare user answer to the correct answer and provide corresponding feedback
        const correct = questions[currentQuestionIndex].correctAnswer;
        const userAnswer = answers[currentQuestionIndex].trim();
        setFeedback(userAnswer === correct ? "Correct!" : "Try again.");
    };

    const goToNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            // Reset feedback when navigating to next question
            setFeedback("");
        }
    };

    const goToPrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(i => i - 1);
            // Reset feedback when navigating to previous question
            setFeedback("");
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">{asgnName}</h1>

            <div className="bg-white dark:bg-neutral-900 shadow-lg rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 transition">
                <QuestionCard
                    question={questions[currentQuestionIndex]}
                    answer={answers[currentQuestionIndex]}
                    onAnswerChange={handleAnswerChange}
                    feedback={feedback}
                    onSubmit={handleSubmit}
                />

                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={goToPrevious}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        ← Previous
                    </button>

                    <span className="text-sm text-muted-foreground">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>

                    <button
                        onClick={goToNext}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
}
