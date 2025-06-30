"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export default function Navbar() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          My Learning Portal
        </Link>

        <div className="flex space-x-4 items-center">
          <Link href="/dashboard" className="text-gray-700 dark:text-gray-200 hover:underline">
            Dashboard
          </Link>
          <Link href="/courses" className="text-gray-700 dark:text-gray-200 hover:underline">
            Courses
          </Link>

          {user ? (
            <button
              onClick={() => signOut(auth)}
              className="text-sm text-red-600 hover:underline ml-4"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/signin" className="text-sm text-blue-600 hover:underline ml-4">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}