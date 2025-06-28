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
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="max-w-xl mx-auto p-6">
            {courses === null ? (
                // Loading state
                <div className="p-6 text-center text-sm text-muted-foreground">
                    Loading courses...
                </div>
            ) : courses.length === 0 ? (
                // No courses found
                <p className="text-muted-foreground">No courses available.</p>
            ) : (
                // Render actual courses
                <div>
                    <h1 className="text-3xl font-bold mb-4">Courses</h1>
                    <ul className="space-y-2">
                        {courses.map((course) => (
                            <li key={course.id}>
                                <Link
                                    href={`/courses/${course.id}`}
                                    className="text-blue-600 hover:underline text-lg"
                                >
                                    {course.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
  );
}
