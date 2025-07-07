"use client";
import React, { useEffect } from "react";
import { Calendar, Clock, TrendingUp, AlertCircle, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import useAssignmentStore from "@/stores/useAssignmentStore";
import useQuizStore from "@/stores/useQuizzesStore";
import useTestStore from "@/stores/useTestsStore"; // ✅ NEW: your tests store
import useTeacherCourseStore from "@/stores/teacherCourseStore";
import useAuthStore from "@/stores/authStore";

const Dashboard = () => {
  const { assignments, getAllAssignments, loading: assignmentsLoading } = useAssignmentStore();
  const { quizzes, getAllQuizzes, loading: quizzesLoading } = useQuizStore();
  const { tests, getAllTests, loading: testsLoading } = useTestStore(); // ✅ NEW: tests store
  const { getAllCourses } = useTeacherCourseStore();
  const { user } = useAuthStore();

  useEffect(() => {
    getAllAssignments();
    getAllQuizzes();
    getAllCourses();
    getAllTests(); // ✅ NEW: fetch tests
  }, [getAllAssignments, getAllQuizzes, getAllCourses, getAllTests]);

  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const upcomingTests = tests.filter((t) => new Date(t.scheduled_date) > new Date());
  const availableQuizzes = quizzes.filter((q) => q.is_active);

  const getUpcomingDeadlines = () => {
    const upcoming = [
      ...pendingAssignments.map((a) => ({ ...a, type: "assignment", dueDate: a.due_date })),
      ...upcomingTests.map((t) => ({
        ...t,
        type: "test",
        dueDate: t.scheduled_date,
        title: t.title,
      })),
      ...availableQuizzes.map((q) => ({ ...q, type: "quiz", dueDate: q.deadline })),
    ]
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
    return upcoming;
  };

  const StatCard = ({ title, value, icon }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );

  if (assignmentsLoading || quizzesLoading || testsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
          <p className="text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.first_name}!</h2>
        <p className="text-gray-600 mt-2">Here's what's happening with your studies today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments.length.toString()}
          icon={<BookOpen className="w-6 h-6 text-blue-800" />}
        />
        <StatCard
          title="Upcoming Tests"
          value={upcomingTests.length.toString()}
          icon={<Calendar className="w-6 h-6 text-red-500" />}
        />
        <StatCard
          title="Available Quizzes"
          value={availableQuizzes.length.toString()}
          icon={<Clock className="w-6 h-6 text-green-800" />}
        />
        <StatCard
          title="Current GPA"
          value={user?.cgpa || "N/A"}
          icon={<TrendingUp className="w-6 h-6 text-purple-800" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Deadlines</h2>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>

          <div className="space-y-4">
            {getUpcomingDeadlines().length === 0 ? (
              <p className="text-gray-600 text-sm">No upcoming deadlines 🎉</p>
            ) : (
              getUpcomingDeadlines().map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title || item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.type === 'assignment' ? 'bg-blue-100 text-blue-800' :
                    item.type === 'test' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.type}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Optional: Add Recent Grades section here if available */}
      </div>
    </div>
  );
};

export default Dashboard;
