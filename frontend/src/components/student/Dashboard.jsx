"use client"
import React from 'react';
import { Calendar, Clock, TrendingUp, AlertCircle, CheckCircle, BookOpen,Bell } from 'lucide-react';
import { assignments, quizzes, tests, grades, student } from '../../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Dashboard = () => {
  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const upcomingTests = tests.filter(t => t.status === 'upcoming');
  const availableQuizzes = quizzes.filter(q => q.status === 'available');
  const recentGrades = grades.slice(0, 3);

  const getUpcomingDeadlines = () => {
    const upcoming = [
      ...pendingAssignments.map(a => ({ ...a, type: 'assignment' })),
      ...upcomingTests.map(t => ({ ...t, type: 'test', dueDate: t.date })),
      ...availableQuizzes.map(q => ({ ...q, type: 'quiz' }))
    ].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 5);
    
    return upcoming;
  };

  const StatCard = ({ title, value, icon, color }) => (
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {student.name}!</h2>
        <p className="text-gray-600 mt-2">Here's what's happening with your studies today.</p>
      </div>
      

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments.length.toString()}
          icon={<BookOpen className="w-6 h-6 text-blue-800" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Upcoming Tests"
          value={upcomingTests.length.toString()}
          icon={<Calendar className="w-6 h-6 text-red-500" />}
          color="bg-red-500"
        />
        <StatCard
          title="Available Quizzes"
          value={availableQuizzes.length.toString()}
          icon={<Clock className="w-6 h-6 text-green-800" />}
          color="bg-green-500"
        />
        <StatCard
          title="Current GPA"
          value={student.gpa.toFixed(2)}
          icon={<TrendingUp className="w-6 h-6 text-purple-800" />}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Deadlines</h2>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          
          <div className="space-y-4">
            {getUpcomingDeadlines().map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-700">{item.subject.name}</p>
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
            ))}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Grades</h2>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          
          <div className="space-y-4">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{grade.title}</h3>
                  <p className="text-sm text-gray-600">{grade.subject.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(grade.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {grade.grade}/{grade.maxGrade}
                  </div>
                  <div className={`text-sm font-medium ${
                    (grade.grade / grade.maxGrade) >= 0.9 ? 'text-green-600' :
                    (grade.grade / grade.maxGrade) >= 0.8 ? 'text-blue-600' :
                    (grade.grade / grade.maxGrade) >= 0.7 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {((grade.grade / grade.maxGrade) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;