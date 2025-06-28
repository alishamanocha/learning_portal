"use client";

import React from "react";
import Assignment from "@/app/components/Assignment/Assignment";
import { useParams } from "next/navigation";

export default function RenderAssignment() {
    const params = useParams(); // Extract route parameters
    const { asgnId } = params; // Dynamic segment [asgnName]
    if (typeof asgnId === "string") {
      return <Assignment assignmentId={decodeURIComponent(asgnId)}/>
    }
}