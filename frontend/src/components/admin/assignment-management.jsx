"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileCheck, Calendar, Users, Eye, Download } from "lucide-react"

export default function AssignmentManagement({
  assignments: initialAssignments,
  teachers,
  courses,
  departments,
}) {
  const [assignments] = useState([
    {
      id: 1,
      title: "Data Structures Assignment 1",
      course: "CS201",
      courseName: "Data Structures",
      department: "CS",
      teacher: "Dr. John Davis",
      teacherId: 2,
      dueDate: "2024-02-15",
      assignedDate: "2024-01-20",
      totalMarks: 100,
      submissions: 25,
      graded: 20,
      status: "active",
      type: "assignment",
    },
    {
      id: 2,
      title: "Calculus Quiz 2",
      course: "MATH101",
      courseName: "Calculus I",
      department: "MATH",
      teacher: "Dr. Sarah Wilson",
      teacherId: 1,
      dueDate: "2024-02-10",
      assignedDate: "2024-02-05",
      totalMarks: 50,
      submissions: 30,
      graded: 30,
      status: "completed",
      type: "quiz",
    },
    {
      id: 3,
      title: "Physics Lab Report",
      course: "PHY101",
      courseName: "Physics I",
      department: "PHY",
      teacher: "Dr. Emily Brown",
      teacherId: 3,
      dueDate: "2024-02-20",
      assignedDate: "2024-02-01",
      totalMarks: 75,
      submissions: 18,
      graded: 10,
      status: "active",
      type: "project",
    },
    {
      id: 4,
      title: "Chemistry Midterm",
      course: "CHEM101",
      courseName: "General Chemistry",
      department: "CHEM",
      teacher: "Dr. Michael Chen",
      teacherId: 4,
      dueDate: "2024-02-25",
      assignedDate: "2024-02-15",
      totalMarks: 200,
      submissions: 22,
      graded: 0,
      status: "active",
      type: "exam",
    },
  ])

  const [selectedTeacher, setSelectedTeacher] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTeacher = selectedTeacher === "all" || assignment.teacherId.toString() === selectedTeacher
    const matchesDepartment = selectedDepartment === "all" || assignment.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || assignment.status === selectedStatus
    const matchesType = selectedType === "all" || assignment.type === selectedType

    return matchesSearch && matchesTeacher && matchesDepartment && matchesStatus && matchesType
  })

  const getAssignmentStats = () => {
    const total = filteredAssignments.length
    const active = filteredAssignments.filter((a) => a.status === "active").length
    const overdue = filteredAssignments.filter((a) => a.status === "overdue").length
    const totalSubmissions = filteredAssignments.reduce((sum, a) => sum + a.submissions, 0)
    const totalGraded = filteredAssignments.reduce((sum, a) => sum + a.graded, 0)
    const gradingProgress = totalSubmissions > 0 ? Math.round((totalGraded / totalSubmissions) * 100) : 0

    return { total, active, overdue, totalSubmissions, totalGraded, gradingProgress }
  }

  const stats = getAssignmentStats()

  const getTeacherAssignments = (teacherId) => {
    return assignments.filter((a) => a.teacherId === teacherId)
  }

  const getDepartmentAssignments = (department) => {
    return assignments.filter((a) => a.department === department)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Assignment Management</h2>
          <p className="text-gray-600">View and manage assignments across all departments and teachers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">All Assignments</TabsTrigger>
          <TabsTrigger value="teacher-view">By Teacher</TabsTrigger>
          <TabsTrigger value="department-view">By Department</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <FileCheck className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                  </div>
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Submissions</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalSubmissions}</p>
                  </div>
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Grading Progress</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.gradingProgress}%</p>
                  </div>
                  <FileCheck className="w-6 h-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <div>
                  <Label className="text-sm font-medium">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search assignments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Teacher</Label>
                  <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Teachers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teachers</SelectItem>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.code}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedTeacher("all")
                    setSelectedDepartment("all")
                    setSelectedType("all")
                    setSelectedStatus("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Assignments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Assignments List ({filteredAssignments.length})</CardTitle>
              <CardDescription>
                Showing {filteredAssignments.length} of {assignments.length} assignments
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAssignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {assignment.type}
                              </Badge>
                              <span className="text-xs text-gray-500">{assignment.totalMarks} marks</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium">{assignment.courseName}</div>
                            <div className="text-sm text-gray-500">{assignment.course}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {assignment.teacher
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm">{assignment.teacher}</div>
                              <Badge variant="secondary" className="text-xs">
                                {assignment.department}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{assignment.dueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {assignment.graded}/{assignment.submissions} graded
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-green-600 h-1.5 rounded-full"
                              style={{
                                width: `${assignment.submissions > 0 ? (assignment.graded / assignment.submissions) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              assignment.status === "active"
                                ? "default"
                                : assignment.status === "completed"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {assignment.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teacher-view" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => {
              const teacherAssignments = getTeacherAssignments(teacher.id)
              const activeAssignments = teacherAssignments.filter((a) => a.status === "active").length
              const totalSubmissions = teacherAssignments.reduce((sum, a) => sum + a.submissions, 0)
              const totalGraded = teacherAssignments.reduce((sum, a) => sum + a.graded, 0)

              return (
                <Card key={teacher.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {teacher.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-base">{teacher.name}</div>
                        <div className="text-sm text-gray-500">{teacher.department}</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-bold text-blue-600">{teacherAssignments.length}</div>
                          <div className="text-gray-600">Total</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-bold text-green-600">{activeAssignments}</div>
                          <div className="text-gray-600">Active</div>
                        </div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="font-bold text-purple-600">
                          {totalSubmissions > 0 ? Math.round((totalGraded / totalSubmissions) * 100) : 0}%
                        </div>
                        <div className="text-gray-600">Grading Progress</div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="department-view" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => {
              const deptAssignments = getDepartmentAssignments(department.code)
              const activeAssignments = deptAssignments.filter((a) => a.status === "active").length
              const overdueAssignments = deptAssignments.filter((a) => a.status === "overdue").length

              return (
                <Card key={department.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {department.name}
                      <Badge variant="outline">{department.code}</Badge>
                    </CardTitle>
                    <CardDescription>{deptAssignments.length} total assignments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-bold text-blue-600">{deptAssignments.length}</div>
                          <div className="text-gray-600">Total</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-bold text-green-600">{activeAssignments}</div>
                          <div className="text-gray-600">Active</div>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded">
                          <div className="font-bold text-red-600">{overdueAssignments}</div>
                          <div className="text-gray-600">Overdue</div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        View Department Assignments
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Distribution by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["assignment", "quiz", "project", "exam"].map((type) => {
                    const count = assignments.filter((a) => a.type === type).length
                    const percentage = assignments.length > 0 ? (count / assignments.length) * 100 : 0
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="capitalize">{type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grading Progress by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departments.map((dept) => {
                    const deptAssignments = getDepartmentAssignments(dept.code)
                    const totalSubmissions = deptAssignments.reduce((sum, a) => sum + a.submissions, 0)
                    const totalGraded = deptAssignments.reduce((sum, a) => sum + a.graded, 0)
                    const percentage = totalSubmissions > 0 ? (totalGraded / totalSubmissions) * 100 : 0

                    return (
                      <div key={dept.id} className="flex items-center justify-between">
                        <span>{dept.code}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
