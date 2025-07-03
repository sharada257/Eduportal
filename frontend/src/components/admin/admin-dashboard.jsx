"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, GraduationCap, Building2, BookOpen, TrendingUp, Calendar } from "lucide-react"


export default function AdminDashboard({ students, teachers, departments, courses }) {
  const currentSemester = "Fall 2024"
  const totalEnrollments = students.length
  const activeTeachers = teachers.filter((t) => t.status === "active").length
  const activeCourses = courses.filter((c) => c.status === "active").length

  const recentActivities = [
    { action: "New student enrolled", details: "John Smith - Computer Science", time: "2 hours ago" },
    { action: "Teacher assigned", details: "Dr. Wilson - Mathematics Department", time: "4 hours ago" },
    { action: "Course created", details: "Advanced Algorithms - CS Department", time: "1 day ago" },
    { action: "Department updated", details: "Physics Department - New HOD assigned", time: "2 days ago" },
  ]

  const departmentStats = departments.map((dept) => ({
    name: dept.name,
    students: students.filter((s) => s.department === dept.code).length,
    teachers: teachers.filter((t) => t.department === dept.code).length,
    courses: courses.filter((c) => c.department === dept.code).length,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-2">University management overview for {currentSemester}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalEnrollments}</p>
                <p className="text-xs text-green-600 mt-1">+12% from last semester</p>
              </div>
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                <p className="text-2xl font-bold text-gray-900">{activeTeachers}</p>
                <p className="text-xs text-green-600 mt-1">+3 new this month</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                <p className="text-xs text-blue-600 mt-1">All active</p>
              </div>
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">{activeCourses}</p>
                <p className="text-xs text-orange-600 mt-1">{currentSemester}</p>
              </div>
              <BookOpen className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Department Overview
            </CardTitle>
            <CardDescription>Statistics by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{dept.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>{dept.students} students</span>
                      <span>{dept.teachers} teachers</span>
                      <span>{dept.courses} courses</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{dept.students + dept.teachers} total</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Semester Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Current Semester: {currentSemester}
          </CardTitle>
          <CardDescription>Semester statistics and important dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalEnrollments}</div>
              <div className="text-sm text-gray-600">Total Enrollments</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{activeCourses}</div>
              <div className="text-sm text-gray-600">Active Courses</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-gray-600">Attendance Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">8.5</div>
              <div className="text-sm text-gray-600">Avg. GPA</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
