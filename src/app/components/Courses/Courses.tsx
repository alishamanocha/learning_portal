"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

interface CourseMeta {
    id: string; // slug used in URL
    name: string; // display name
}

export default function Courses() {
    const [courses, setCourses] = useState<CourseMeta[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const snapshot = await getDocs(collection(db, "courses"));
                const courseList: CourseMeta[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name ?? doc.id, // fallback to ID if name missing
                }));
                setCourses(courseList);
            } catch (err) {
                console.error("Failed to fetch courses", err);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Mock data for demonstration - you can replace with real data
    const courseIcons = {
        "mathematics": "🔢",
        "science": "🔬",
        "english": "📚",
        "history": "🏛️",
        "geography": "🌍",
        "physics": "⚡",
        "chemistry": "🧪",
        "biology": "🧬",
        "literature": "📖",
        "default": "📚"
    };

    const getCourseIcon = (courseName: string) => {
        const lowerName = courseName.toLowerCase();
        for (const [key, icon] of Object.entries(courseIcons)) {
            if (lowerName.includes(key)) {
                return icon;
            }
        }
        return courseIcons.default;
    };

    const getCourseColor = (index: number) => {
        const colors = [
            "from-blue-500 to-blue-600",
            "from-green-500 to-green-600",
            "from-purple-500 to-purple-600",
            "from-orange-500 to-orange-600",
            "from-pink-500 to-pink-600",
            "from-indigo-500 to-indigo-600",
            "from-teal-500 to-teal-600",
            "from-red-500 to-red-600"
        ];
        return colors[index % colors.length];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Loading courses...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Available Courses 📚
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Explore our comprehensive curriculum designed for your learning journey.
                    </p>
                </div>

                {courses === null || courses.length === 0 ? (
                    // No courses found
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📚</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No Courses Available
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Check back later for new courses or contact your instructor.
                        </p>
                    </div>
                ) : (
                    // Render courses grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courses.map((course, index) => (
                            <Link
                                key={course.id}
                                href={`/courses/${course.id}`}
                                className="group block"
                            >
                                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 card-hover">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className={`p-3 rounded-lg bg-gradient-to-r ${getCourseColor(index)} text-white text-2xl`}>
                                            {getCourseIcon(course.name)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {course.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Course
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Status</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                                                Available
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                            <span className="text-gray-900 dark:text-white font-medium">0%</span>
                                        </div>
                                        
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Click to view
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
                )}

                {/* Quick Stats */}
                {courses && courses.length > 0 && (
                    <div className="mt-12">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Course Overview
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                        {courses.length}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Courses
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                        0
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        In Progress
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                        0
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Completed
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
