"use client";

import Assignment from "@/app/components/Assignment/Assignment";
import { useParams } from "next/navigation";
import withAuth from "@/app/components/withAuth";

function AssignmentPage() {
  const { asgnId } = useParams();
  if (typeof asgnId !== "string") return null;

  return <Assignment assignmentId={decodeURIComponent(asgnId)} />;
}

export default withAuth(AssignmentPage);