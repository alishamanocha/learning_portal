"use client";

import React from "react";
import Course from "@/app/components/Course/Course";
import { useParams } from "next/navigation";

export default function RenderCourse() {
    const params = useParams(); // Extract route parameters
    const { courseName } = params; // Dynamic segment [asgnName]
    if (typeof courseName === "string") {
      return <Course courseName={decodeURIComponent(courseName)}/>
    }
}