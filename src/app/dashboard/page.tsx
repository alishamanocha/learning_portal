"use client";
import withAuth from "../components/withAuth";

function DashboardPage() {
    return <h1>This is the dashboard</h1>
  }

export default withAuth(DashboardPage);