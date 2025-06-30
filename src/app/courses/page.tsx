"use client";

import Courses from "../components/Courses/Courses";
import withAuth from "@/app/components/withAuth";

function CoursesPage() {
  return <Courses />;
}

export default withAuth(CoursesPage);