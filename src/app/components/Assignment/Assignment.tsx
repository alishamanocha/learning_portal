"use client";

import React, { useState } from "react";

export default function Assignment({ asgnName }: { asgnName: string }) {
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");

    const correctAnswer = 0.3 * 40;

    const handleSubmit = () => {
        if (parseFloat(answer) === correctAnswer) {
            setFeedback("Correct!");
        } else {
            setFeedback("Try again.");
        }
    };

    return (
        <div>
            <h1 className="text-xl font-bold">{asgnName}</h1>
            <p>What is 30% of 40?</p>

            <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-black bg-white"
                placeholder="Enter your answer"
            />

            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Submit
            </button>

            {feedback && (
                <p className="mt-2 text-lg font-medium">{feedback}</p>
            )}
        </div>
    );
}
