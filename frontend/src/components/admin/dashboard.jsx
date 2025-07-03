"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, ClipboardCheck, TrendingUp, Calendar, Bell } from "lucide-react"

export default function Dashboard({ courses, students, assignments }) {
  const totalStudents = students.length
  const pendingGrades = assignments.reduce((acc, assignment) => {
    return acc + assignment.submissions.filter((s) => s.grade === null).length
  }, 0)

  const upcomingDeadlines = [
    { title: "Physics Lab Report", course: "PHY201", dueDate: "2024-02-20", daysLeft: 3 },
    { title: "Math Quiz 2", course: "MATH101", dueDate: "2024-02-22", daysLeft: 5 },
  ]

  const recentActivity = [
    { action: "New submission", student: "John Smith", assignment: "Calculus Problem Set", time: "2 hours ago" },
    { action: "Quiz completed", student: "Sarah Johnson", assignment: "Physics Quiz 1", time: "4 hours ago" },
    { action: "Grade updated", student: "Mike Davis", assignment: "Chemistry Lab", time: "1 day ago" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, Professor!</h2>
        <p className="text-gray-600 mt-2">Here's what's happening with your classes today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Grades</p>
                <p className="text-2xl font-bold text-gray-900">{pendingGrades}</p>
              </div>
              <ClipboardCheck className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">92%</p>
                <p className="text-xs text-green-600">Avg. Performance</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Assignments and quizzes due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{deadline.title}</p>
                    <p className="text-sm text-gray-600">{deadline.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={deadline.daysLeft <= 3 ? "destructive" : "secondary"}>
                      {deadline.daysLeft} days left
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{deadline.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span> by{" "}
                      <span className="font-medium">{activity.student}</span>
                    </p>
                    <p className="text-sm text-gray-600">{activity.assignment}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
