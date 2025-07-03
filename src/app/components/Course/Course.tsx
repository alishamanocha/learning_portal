"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

interface CourseData {
    name: string;
    assignments: string[];
}

interface AssignmentInfo {
    id: string;
    title: string;
}

export default function Course({ courseId }: { courseId: string }) {
    const [course, setCourse] = useState<CourseData | null>(null);
    const [assignments, setAssignments] = useState<AssignmentInfo[]>([]);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseAndAssignments = async () => {
            try {
                const courseRef = doc(db, "courses", courseId);
                const courseSnap = await getDoc(courseRef);

                if (!courseSnap.exists()) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }

                const courseData = courseSnap.data() as CourseData;
                setCourse(courseData);

                const assignmentsData = await Promise.all(
                    courseData.assignments.map(async (asgnId) => {
                        const asgnSnap = await getDoc(doc(db, "assignments", asgnId));
                        const title = asgnSnap.exists() ? asgnSnap.data().title : asgnId;
                        return { id: asgnId, title };
                    })
                );

                setAssignments(assignmentsData);
            } catch (error) {
                console.log("Failed to fetch course:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndAssignments();
    }, [courseId]);

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Loading course...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Not found
    if (notFound || !course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Course Not Found
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            The course you're looking for doesn't exist or has been removed.
                        </p>
                        <Link
                            href="/courses"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            ← Back to Courses
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const getCourseIcon = (courseName: string) => {
        const lowerName = courseName.toLowerCase();
        if (lowerName.includes('math')) return '🔢';
        if (lowerName.includes('science')) return '🔬';
        if (lowerName.includes('english')) return '📚';
        if (lowerName.includes('history')) return '🏛️';
        if (lowerName.includes('geography')) return '🌍';
        if (lowerName.includes('physics')) return '⚡';
        if (lowerName.includes('chemistry')) return '🧪';
        if (lowerName.includes('biology')) return '🧬';
        if (lowerName.includes('literature')) return '📖';
        return '📚';
    };

    const getAssignmentIcon = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('quiz')) return '📝';
        if (lowerTitle.includes('test')) return '📋';
        if (lowerTitle.includes('exam')) return '📊';
        if (lowerTitle.includes('essay')) return '✍️';
        if (lowerTitle.includes('project')) return '🎯';
        if (lowerTitle.includes('homework')) return '📚';
        return '📄';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            href="/courses"
                            className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                        >
                            ←
                        </Link>
                        <div className="flex items-center space-x-3">
                            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                                {getCourseIcon(course.name)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {course.name}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Course • {assignments.length} assignments
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assignments</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{assignments.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <span className="text-xl">📝</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <span className="text-xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{assignments.length}</p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <span className="text-xl">⏳</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">0%</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <span className="text-xl">📊</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assignments Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Assignments
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Complete these assignments to progress through the course.
                        </p>
                    </div>

                    <div className="p-6">
                        {assignments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {assignments.map((assignment, index) => (
                                    <Link
                                        key={assignment.id}
                                        href={`/assignments/${assignment.id}`}
                                        className="group block"
                                    >
                                        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 card-hover">
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white text-xl">
                                                    {getAssignmentIcon(assignment.title)}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {assignment.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Assignment {index + 1}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full text-xs font-medium">
                                                        Not Started
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Due Date</span>
                                                    <span className="text-gray-900 dark:text-white font-medium">
                                                        TBD
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        Start assignment
                                                    </span>
                                                    <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                                                        →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    No Assignments Available
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    This course doesn't have any assignments yet. Check back later!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}