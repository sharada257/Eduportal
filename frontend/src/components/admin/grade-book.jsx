"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Download, Upload, TrendingUp, Users, BookOpen, BarChart3 } from "lucide-react"

export default function GradeBook({ courses, students }) {
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedGrade, setSelectedGrade] = useState("all")

  const gradeData = [
    {
      studentId: 1,
      studentName: "John Smith",
      course: "MATH101",
      assignments: { "Assignment 1": 85, "Quiz 1": 92, Midterm: 88 },
      finalGrade: "A-",
    },
    {
      studentId: 2,
      studentName: "Sarah Johnson",
      course: "MATH101",
      assignments: { "Assignment 1": 78, "Quiz 1": 85, Midterm: 82 },
      finalGrade: "B+",
    },
    {
      studentId: 3,
      studentName: "Mike Davis",
      course: "PHY201",
      assignments: { "Lab Report 1": 95, "Quiz 1": 88, Midterm: 91 },
      finalGrade: "A",
    },
    {
      studentId: 4,
      studentName: "Emily Brown",
      course: "CHEM150",
      assignments: { "Lab Report 1": 82, "Quiz 1": 79, Midterm: 85 },
      finalGrade: "B",
    },
  ]

  const filteredGrades = gradeData.filter((grade) => {
    const matchesCourse = selectedCourse === "all" || grade.course === selectedCourse
    const matchesGrade = selectedGrade === "all" || grade.finalGrade.charAt(0) === selectedGrade
    return matchesCourse && matchesGrade
  })

  const getGradeStats = () => {
    const gradeDistribution = gradeData.reduce(
      (acc, student) => {
        const grade = student.finalGrade.charAt(0)
        acc[grade] = (acc[grade] || 0) + 1
        return acc
      },
      {} ,
    )

    const averageByAssignment = Object.keys(gradeData[0]?.assignments || {}).reduce(
      (acc, assignment) => {
        const scores = gradeData
          .map((student) => student.assignments[assignment])
          .filter((score) => score !== undefined)
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
        acc[assignment] = Math.round(average)
        return acc
      },
      {} ,
    )

    return { gradeDistribution, averageByAssignment }
  }

  const stats = getGradeStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Grade Book</h2>
          <p className="text-gray-600">Track and manage student grades across all assessments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Grades
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards - Smaller */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">A Grades</p>
                <p className="text-lg font-bold text-green-600">{stats.gradeDistribution.A || 0}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">B Grades</p>
                <p className="text-lg font-bold text-blue-600">{stats.gradeDistribution.B || 0}</p>
              </div>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">C Grades</p>
                <p className="text-lg font-bold text-yellow-600">{stats.gradeDistribution.C || 0}</p>
              </div>
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total</p>
                <p className="text-lg font-bold text-gray-900">{gradeData.length}</p>
              </div>
              <BookOpen className="w-5 h-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label className="text-sm font-medium">Filter by Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.code}>
                      {course.name} ({course.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Filter by Grade</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="A">A Grades</SelectItem>
                  <SelectItem value="B">B Grades</SelectItem>
                  <SelectItem value="C">C Grades</SelectItem>
                  <SelectItem value="D">D Grades</SelectItem>
                  <SelectItem value="F">F Grades</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCourse("all")
                setSelectedGrade("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grade Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Grades ({filteredGrades.length})</CardTitle>
          <CardDescription>Comprehensive view of all student grades and assessments</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment 1
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz 1
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Midterm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Final Grade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.map((grade) => (
                  <tr key={grade.studentId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="w-6 h-6 mr-2">
                          <AvatarFallback className="text-xs">
                            {grade.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium text-gray-900">{grade.studentName}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="outline" className="text-xs">
                        {grade.course}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{grade.assignments["Assignment 1"] || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{grade.assignments["Quiz 1"] || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{grade.assignments["Midterm"] || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge
                        variant={
                          grade.finalGrade.startsWith("A")
                            ? "default"
                            : grade.finalGrade.startsWith("B")
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {grade.finalGrade}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <Button size="sm" variant="ghost" className="text-xs">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Averages */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Averages</CardTitle>
          <CardDescription>Class performance across different assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats.averageByAssignment).map(([assignment, average]) => (
              <div key={assignment} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{average}%</div>
                <div className="text-sm text-gray-600">{assignment}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
