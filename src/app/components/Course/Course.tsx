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

  useEffect(() => {
    const fetchCourseAndAssignments = async () => {
      const courseRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
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
      }
    };

    fetchCourseAndAssignments();
  }, [courseId]);

  if (!course || !assignments.length) {
    return <p className="text-center mt-10 text-muted-foreground">Loading course...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
      <h2 className="text-xl font-semibold mb-2">Assignments</h2>
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
    </div>
  );
}
