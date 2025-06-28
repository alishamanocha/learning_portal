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
        return <p className="text-center mt-10 text-muted-foreground">Loading course...</p>;
    }

    // Not found
    if (notFound || !course) {
        return (
            <p className="text-center mt-10 font-medium">
                Course not found.
            </p>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
            <h2 className="text-xl font-semibold mb-2">Assignments</h2>
            {assignments.length > 0 ? (
                <ul className="space-y-2">
                    {assignments.map((asgn) => (
                        <li key={asgn.id}>
                            <Link
                                href={`/assignments/${asgn.id}`}
                                className="text-blue-600 hover:underline"
                            >
                                {asgn.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground">No assignments found for this course.</p>
            )}
        </div>
    );
}