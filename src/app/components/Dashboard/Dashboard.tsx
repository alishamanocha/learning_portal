"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { userProfile } = useAuth();
  const [stats] = useState({
    totalCourses: 12,
    completedCourses: 8,
    currentAssignments: 5,
    averageScore: 87
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: "assignment",
      title: "Algebra Quiz #3",
      course: "Mathematics",
      time: "2 hours ago",
      status: "completed"
    },
    {
      id: 2,
      type: "course",
      title: "Introduction to Physics",
      course: "Science",
      time: "1 day ago",
      status: "in-progress"
    },
    {
      id: 3,
      type: "assignment",
      title: "Essay on Shakespeare",
      course: "English Literature",
      time: "3 days ago",
      status: "pending"
    }
  ]);

  const [quickActions] = useState([
    {
      title: "Continue Learning",
      description: "Resume your last course",
      icon: "📚",
      href: "/courses",
      color: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      title: "View Assignments",
      description: "Check pending tasks",
      icon: "📝",
      href: "/assignments",
      color: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      title: "Progress Report",
      description: "See your achievements",
      icon: "📊",
      href: "/progress",
      color: "bg-gradient-to-r from-purple-500 to-purple-600"
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, { userProfile?.name || 'Student'}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Here's what's happening with your learning journey today.
          </p>
        </div>

        {/* User Profile Card */}
        {userProfile && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.name?.charAt(0).toUpperCase() || userProfile.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{userProfile.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{userProfile.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Active Learner</p>
              </div>
              <Link
                href="/profile"
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedCourses}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.currentAssignments}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.averageScore}%</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="block bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color} text-white`}>
                      <span className="text-2xl">{action.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <div className={`p-2 rounded-lg ${
                        activity.status === 'completed' ? 'bg-green-100 dark:bg-green-900' :
                        activity.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900' :
                        'bg-orange-100 dark:bg-orange-900'
                      }`}>
                        <span className="text-lg">
                          {activity.type === 'assignment' ? '📝' : '📚'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.course} • {activity.time}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        activity.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {activity.status.replace('-', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Learning Progress</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Course Completion</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900 dark:text-blue-200">
                        Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                        {Math.round((stats.completedCourses / stats.totalCourses) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900">
                    <div
                      style={{ width: `${(stats.completedCourses / stats.totalCourses) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance Trend</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ↗️ +12%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This month
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Study Streak</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    🔥 7 days
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Keep it up!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 