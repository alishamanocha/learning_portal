"use client";

import React from "react";
import Course from "@/app/components/Course/Course";
import { useParams } from "next/navigation";

export default function RenderCourse() {
    const params = useParams(); // Extract route parameters
    const { courseId } = params; // Dynamic segment [asgnName]
    if (typeof courseId === "string") {
      return <Course courseId={decodeURIComponent(courseId)}/>
    }
}