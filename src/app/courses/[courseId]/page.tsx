"use client";

import Course from "@/app/components/Course/Course";
import { useParams } from "next/navigation";
import withAuth from "@/app/components/withAuth";

function CoursePage() {
  const { courseId } = useParams();
  if (typeof courseId !== "string") return null;

  return <Course courseId={decodeURIComponent(courseId)} />;
}

export default withAuth(CoursePage);