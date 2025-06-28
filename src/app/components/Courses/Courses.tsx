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
  const [courses, setCourses] = useState<CourseMeta[]>([]);

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
      }
    };

    fetchCourses();
  }, []);

  if (courses.length === 0) {
    return <p className="text-center text-muted-foreground mt-10">Loading courses...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
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
  );
}
