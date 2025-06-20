"use client";

import React from "react";
import Assignment from "@/app/components/Assignment/Assignment";
import { useParams } from "next/navigation";

export default function RenderAssignment() {
    const params = useParams(); // Extract route parameters
    const { asgnName } = params; // Dynamic segment [asgnName]
    if (typeof asgnName === "string") {
      return <Assignment asgnName={decodeURIComponent(asgnName)}/>
    }
}