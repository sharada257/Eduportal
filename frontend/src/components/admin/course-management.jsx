"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Save, X, Upload, Download, BookOpen, Calendar, Users } from "lucide-react"

export default function CourseManagement({ courses, setCourses, departments, teachers }) {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showAddNote, setShowAddNote] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    type: "lecture" ,
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedSemester, setSelectedSemester] = useState("Fall")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    department: "",
    credits: 3,
    semester: "Fall",
    year: "2024",
    description: "",
    prerequisites: [] ,
    maxStudents: 30,
    instructor: "",
    schedule: {
      days: [] ,
      time: "",
      room: "",
    },
  })

  const years = ["2024", "2025", "2026", "2027"]
  const semesters = ["Fall", "Spring", "Summer"]
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const addNoteToCourse = (courseId) => {
    if (!newNote.title || !newNote.content) return

    const updatedCourses = courses.map((course) => {
      if (course.id === courseId) {
        const note = {
          id: Date.now(),
          title: newNote.title,
          content: newNote.content,
          type: newNote.type,
          date: new Date().toISOString().split("T")[0],
        }
        return {
          ...course,
          notes: [...(course.notes || []), note],
        }
      }
      return course
    })

    setCourses(updatedCourses)
    setNewNote({ title: "", content: "", type: "lecture" })
    setShowAddNote(false)
  }

  const deleteNote = (courseId, noteId) => {
    const updatedCourses = courses.map((course) => {
      if (course.id === courseId) {
        return {
          ...course,
          notes: course.notes?.filter((note) => note.id !== noteId) || [],
        }
      }
      return course
    })
    setCourses(updatedCourses)
  }

  const addCourse = () => {
    if (!newCourse.name || !newCourse.code || !newCourse.department) return

    const course = {
      id: Date.now(),
      ...newCourse,
      enrolledStudents: 0,
      status: "active",
    }

    setCourses([...courses, course])
    setNewCourse({
      name: "",
      code: "",
      department: "",
      credits: 3,
      semester: "Fall",
      year: "2024",
      description: "",
      prerequisites: [],
      maxStudents: 30,
      instructor: "",
      schedule: {
        days: [],
        time: "",
        room: "",
      },
    })
    setShowAddForm(false)
  }

  const filteredCourses = courses.filter((course) => {
    const matchesYear = selectedYear === "all" || course.year === selectedYear
    const matchesSemester = selectedSemester === "all" || course.semester === selectedSemester
    const matchesDepartment = selectedDepartment === "all" || course.department === selectedDepartment
    return matchesYear && matchesSemester && matchesDepartment
  })

  const getCourseStats = () => {
    const total = filteredCourses.length
    const active = filteredCourses.filter((c) => c.status === "active").length
    const totalEnrolled = filteredCourses.reduce((sum, c) => sum + c.enrolledStudents, 0)
    const avgEnrollment = total > 0 ? Math.round(totalEnrolled / total) : 0

    return { total, active, totalEnrolled, avgEnrollment }
  }

  const stats = getCourseStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Course Management</h2>
          <p className="text-gray-600">Manage university courses by semester and year</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Upload className="w-4 h-4" />
            Bulk Upload CSV
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export Courses
          </Button>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Course
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Course Overview</TabsTrigger>
          <TabsTrigger value="semester-view">Semester View</TabsTrigger>
          <TabsTrigger value="bulk-operations">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Add Course Form */}
          {showAddForm && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Add New Course
                  <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="course-name">Course Name</Label>
                    <Input
                      id="course-name"
                      placeholder="e.g., Introduction to Programming"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="course-code">Course Code</Label>
                    <Input
                      id="course-code"
                      placeholder="e.g., CS101"
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="course-department">Department</Label>
                    <Select
                      value={newCourse.department}
                      onValueChange={(value) => setNewCourse({ ...newCourse, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.code}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="course-year">Academic Year</Label>
                    <Select
                      value={newCourse.year}
                      onValueChange={(value) => setNewCourse({ ...newCourse, year: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="course-semester">Semester</Label>
                    <Select
                      value={newCourse.semester}
                      onValueChange={(value) => setNewCourse({ ...newCourse, semester: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester} value={semester}>
                            {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="course-credits">Credits</Label>
                    <Input
                      id="course-credits"
                      type="number"
                      min="1"
                      max="6"
                      value={newCourse.credits}
                      onChange={(e) => setNewCourse({ ...newCourse, credits: Number.parseInt(e.target.value) || 3 })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="course-description">Description</Label>
                  <Textarea
                    id="course-description"
                    placeholder="Course description and objectives"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="course-instructor">Instructor</Label>
                    <Select
                      value={newCourse.instructor}
                      onValueChange={(value) => setNewCourse({ ...newCourse, instructor: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers
                          .filter((teacher) => teacher.department === newCourse.department)
                          .map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.name}>
                              {teacher.name} - {teacher.designation}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="course-max-students">Max Students</Label>
                    <Input
                      id="course-max-students"
                      type="number"
                      min="1"
                      value={newCourse.maxStudents}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, maxStudents: Number.parseInt(e.target.value) || 30 })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Schedule Days</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {days.map((day) => (
                        <label key={day} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newCourse.schedule.days.includes(day)}
                            onChange={(e) => {
                              const updatedDays = e.target.checked
                                ? [...newCourse.schedule.days, day]
                                : newCourse.schedule.days.filter((d) => d !== day)
                              setNewCourse({
                                ...newCourse,
                                schedule: { ...newCourse.schedule, days: updatedDays },
                              })
                            }}
                          />
                          <span className="text-sm">{day.slice(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="course-time">Time</Label>
                    <Input
                      id="course-time"
                      placeholder="e.g., 10:00 AM - 11:30 AM"
                      value={newCourse.schedule.time}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          schedule: { ...newCourse.schedule, time: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="course-room">Room</Label>
                    <Input
                      id="course-room"
                      placeholder="e.g., Room 101"
                      value={newCourse.schedule.room}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          schedule: { ...newCourse.schedule, room: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={addCourse} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Add Course
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Courses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Courses</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalEnrolled}</p>
                  </div>
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Enrollment</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.avgEnrollment}</p>
                  </div>
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <Label className="text-sm font-medium">Academic Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Semester</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {semesters.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue />
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedYear("all")
                    setSelectedSemester("all")
                    setSelectedDepartment("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Courses Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Courses List ({filteredCourses.length}) - {selectedSemester} {selectedYear}
              </CardTitle>
              <CardDescription>Showing {filteredCourses.length} courses for the selected filters</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Semester
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instructor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollment
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
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{course.name}</div>
                            <div className="text-sm text-gray-500">{course.credits} credits</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{course.code}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary">{course.department}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {course.semester} {course.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{course.instructor}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {course.enrolledStudents}/{course.maxStudents}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{
                                width: `${(course.enrolledStudents / course.maxStudents) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={course.status === "active" ? "default" : "outline"}>{course.status}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semester-view" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {semesters.map((semester) => (
              <Card key={semester}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {semester} {selectedYear}
                  </CardTitle>
                  <CardDescription>
                    {courses.filter((c) => c.semester === semester && c.year === selectedYear).length} courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {courses
                      .filter((c) => c.semester === semester && c.year === selectedYear)
                      .slice(0, 5)
                      .map((course) => (
                        <div key={course.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{course.name}</p>
                              <p className="text-xs text-gray-600">
                                {course.code} • {course.department}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {course.credits} cr
                            </Badge>
                          </div>
                        </div>
                      ))}
                    {courses.filter((c) => c.semester === semester && c.year === selectedYear).length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{courses.filter((c) => c.semester === semester && c.year === selectedYear).length - 5} more
                        courses
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bulk-operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Bulk Upload Courses
                </CardTitle>
                <CardDescription>Upload multiple courses using CSV file</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>CSV File Upload</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Drag and drop CSV file here, or click to browse</p>
                    <Input type="file" accept=".csv" className="hidden" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>CSV Format Requirements:</Label>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Name, Code, Department, Credits, Year, Semester</li>
                    <li>• Instructor, Max Students, Description</li>
                    <li>• Schedule (Days, Time, Room)</li>
                    <li>• Year format: 2024, 2025, etc.</li>
                    <li>• Semester: Fall, Spring, Summer</li>
                  </ul>
                </div>
                <Button className="w-full">Upload Courses</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export & Templates
                </CardTitle>
                <CardDescription>Download templates and export data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Courses
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export by Semester
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export by Department
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
