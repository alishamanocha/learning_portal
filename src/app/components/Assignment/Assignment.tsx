"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import QuestionCard from "./QuestionCard";

type Question = {
    prompt: string;
    correctAnswer: string;
};
  
type AssignmentDoc = {
    title: string;
    questions: Question[];
};

// TODO: Save score in some Firestore collection
// TODO: Show feedback for last question before seeing assignment score
export default function Assignment({ assignmentId }: { assignmentId: string }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [assignmentTitle, setAssignmentTitle] = useState<string>("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
    const [score, setScore] = useState(0);
    const [submitted, setSubmitted] = useState<boolean[]>([]);
    const [feedback, setFeedback] = useState("");
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const docRef = doc(db, "assignments", assignmentId);
                const snapshot = await getDoc(docRef);
        
                if (snapshot.exists()) {
                    const data = snapshot.data() as AssignmentDoc;
                    setAssignmentTitle(data.title);
                    setQuestions(data.questions);
                    setAnswers(new Array(data.questions.length).fill(""));
                    setSubmitted(new Array(data.questions.length).fill(false));
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.log("Error fetching assignment:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAssignment();
    }, [assignmentId]);
    
    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Loading assignment...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Assignment not found
    if (notFound || questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Assignment Not Found
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            The assignment you're looking for doesn't exist or has been removed.
                        </p>
                        <a
                            href="/courses"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            ← Back to Courses
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const handleAnswerChange = (value: string) => {
        const updated = [...answers];
        updated[currentQuestionIndex] = value;
        setAnswers(updated);
        setFeedback("");
    };

    const handleSubmit = () => {
        if (submitted[currentQuestionIndex]) return;

        const correct = questions[currentQuestionIndex].correctAnswer;
        const userAnswer = answers[currentQuestionIndex].trim();

        const isCorrect = userAnswer === correct;
        setFeedback(isCorrect ? "Correct!" : `Incorrect. Correct answer: ${correct}`);

        if (isCorrect) {
            setScore((prev) => prev + 1);
        }

        const updatedSubmitted = [...submitted];
        updatedSubmitted[currentQuestionIndex] = true;
        setSubmitted(updatedSubmitted);
    };

    const goToNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setFeedback("");
        } else {
            setShowResults(true);
        }
    };

    const goToPrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(i => i - 1);
            setFeedback("");
        }
    };

    const isComplete = submitted.every((s) => s);
    const progress = (submitted.filter(Boolean).length / questions.length) * 100;

    if (showResults || isComplete) {
        const percentage = Math.round((score / questions.length) * 100);
        const getScoreColor = (score: number) => {
            if (score >= 80) return "text-green-600 dark:text-green-400";
            if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
            return "text-red-600 dark:text-red-400";
        };

        const getScoreMessage = (score: number) => {
            if (score >= 90) return "Excellent work! 🎉";
            if (score >= 80) return "Great job! 👍";
            if (score >= 70) return "Good effort! 💪";
            if (score >= 60) return "Keep practicing! 📚";
            return "Don't give up! Try again! 🔄";
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-8">
                        <div className="text-center">
                            <div className="text-6xl mb-6">
                                {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Assignment Complete!
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                {assignmentTitle}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                        {score}/{questions.length}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Questions Correct
                                    </div>
                                </div>
                                
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                                        {percentage}%
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Overall Score
                                    </div>
                                </div>
                                
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                        {questions.length}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Questions
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {getScoreMessage(percentage)}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {percentage >= 80 
                                        ? "You've mastered this material!" 
                                        : "Review the questions and try again to improve your score."
                                    }
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        setCurrentQuestionIndex(0);
                                        setShowResults(false);
                                        setScore(0);
                                        setSubmitted(new Array(questions.length).fill(false));
                                        setAnswers(new Array(questions.length).fill(""));
                                    }}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Try Again
                                </button>
                                <a
                                    href="/courses"
                                    className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium"
                                >
                                    Back to Courses
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <a
                            href="/courses"
                            className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                        >
                            ←
                        </a>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {assignmentTitle}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </p>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Progress
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span>{submitted.filter(Boolean).length} completed</span>
                            <span>{questions.length - submitted.filter(Boolean).length} remaining</span>
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <QuestionCard
                        question={questions[currentQuestionIndex]}
                        answer={answers[currentQuestionIndex]}
                        onAnswerChange={handleAnswerChange}
                        feedback={feedback}
                        onSubmit={handleSubmit}
                        submitted={submitted[currentQuestionIndex]}
                    />

                    {/* Navigation */}
                    <div className="p-6 border-t border-gray-100 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={goToPrevious}
                                disabled={currentQuestionIndex === 0}
                                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                            >
                                ← Previous
                            </button>

                            <div className="flex space-x-2">
                                {questions.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-3 h-3 rounded-full ${
                                            index === currentQuestionIndex
                                                ? 'bg-blue-600'
                                                : submitted[index]
                                                ? 'bg-green-500'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={goToNext}
                                disabled={currentQuestionIndex === questions.length - 1 && !submitted[currentQuestionIndex]}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                            >
                                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next →'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
