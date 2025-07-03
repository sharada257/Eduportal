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
import { Search, Upload, Download, Plus, Edit, Trash2, Users, FileSpreadsheet, GraduationCap } from "lucide-react"

export default function TeacherManagement({
  teachers: initialTeachers,
  setTeachers,
  departments,
}) {
  const [teachers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      email: "sarah.wilson@university.edu",
      employeeId: "EMP001",
      department: "MATH",
      designation: "Professor",
      specialization: "Calculus, Linear Algebra",
      status: "active",
      joiningDate: "2019-09-01",
      experience: 15,
      subjects: ["MATH101", "MATH201", "MATH301"],
    },
    {
      id: 2,
      name: "Dr. John Davis",
      email: "john.davis@university.edu",
      employeeId: "EMP002",
      department: "CS",
      designation: "Associate Professor",
      specialization: "Data Structures, Algorithms",
      status: "active",
      joiningDate: "2020-01-15",
      experience: 12,
      subjects: ["CS101", "CS201"],
    },
    {
      id: 3,
      name: "Dr. Emily Brown",
      email: "emily.brown@university.edu",
      employeeId: "EMP003",
      department: "PHY",
      designation: "Assistant Professor",
      specialization: "Quantum Physics, Mechanics",
      status: "active",
      joiningDate: "2021-08-01",
      experience: 8,
      subjects: ["PHY101", "PHY201"],
    },
    {
      id: 4,
      name: "Dr. Michael Chen",
      email: "michael.chen@university.edu",
      employeeId: "EMP004",
      department: "CHEM",
      designation: "Professor",
      specialization: "Organic Chemistry, Biochemistry",
      status: "on-leave",
      joiningDate: "2018-03-01",
      experience: 18,
      subjects: ["CHEM101", "CHEM301"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedDesignation, setSelectedDesignation] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || teacher.department === selectedDepartment
    const matchesDesignation = selectedDesignation === "all" || teacher.designation === selectedDesignation
    const matchesStatus = selectedStatus === "all" || teacher.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesDesignation && matchesStatus
  })

  const getTeacherStats = () => {
    const total = teachers.length
    const active = teachers.filter((t) => t.status === "active").length
    const byDepartment = teachers.reduce(
      (acc, teacher) => {
        acc[teacher.department] = (acc[teacher.department] || 0) + 1
        return acc
      },
      {},
    )
    const avgExperience = teachers.reduce((sum, teacher) => sum + teacher.experience, 0) / teachers.length

    return { total, active, byDepartment, avgExperience: avgExperience.toFixed(1) }
  }

  const stats = getTeacherStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Teacher Management</h2>
          <p className="text-gray-600">Manage university faculty and their information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Upload className="w-4 h-4" />
            Bulk Upload CSV
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Teacher
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bulk-operations">Bulk Operations</TabsTrigger>
          <TabsTrigger value="department-view">Department View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Experience</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.avgExperience} yrs</p>
                  </div>
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Departments</p>
                    <p className="text-2xl font-bold text-orange-600">{Object.keys(stats.byDepartment).length}</p>
                  </div>
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <Label className="text-sm font-medium">Search Teachers</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, email, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
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
                  <Label className="text-sm font-medium">Designation</Label>
                  <Select value={selectedDesignation} onValueChange={setSelectedDesignation}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Designations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Designations</SelectItem>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
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
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedDepartment("all")
                    setSelectedDesignation("all")
                    setSelectedStatus("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Teachers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Teachers List ({filteredTeachers.length})</CardTitle>
              <CardDescription>
                Showing {filteredTeachers.length} of {teachers.length} teachers
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Designation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
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
                    {filteredTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="w-8 h-8 mr-3">
                              <AvatarFallback>
                                {teacher.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                              <div className="text-sm text-gray-500">{teacher.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{teacher.employeeId}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary">{teacher.department}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.designation}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.experience} years</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              teacher.status === "active"
                                ? "default"
                                : teacher.status === "on-leave"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {teacher.status}
                          </Badge>
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

        <TabsContent value="bulk-operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Bulk Upload Teachers
                </CardTitle>
                <CardDescription>Upload multiple teachers using CSV file</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>CSV File Upload</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Drag and drop CSV file here, or click to browse</p>
                    <Input type="file" accept=".csv" className="hidden" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>CSV Format Requirements:</Label>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Name, Email, Employee ID, Department, Designation</li>
                    <li>• Department codes: CS, MATH, PHY, CHEM, etc.</li>
                    <li>• Designation: Professor, Associate Professor, etc.</li>
                    <li>• Specialization, Experience (years), Joining Date</li>
                  </ul>
                </div>
                <Button className="w-full">Upload Teachers</Button>
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
                    Export All Teachers
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export by Department
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export by Designation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="department-view" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => {
              const deptTeachers = teachers.filter((t) => t.department === department.code)
              return (
                <Card key={department.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {department.name}
                      <Badge variant="outline">{department.code}</Badge>
                    </CardTitle>
                    <CardDescription>{deptTeachers.length} faculty members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-bold text-blue-600">
                            {deptTeachers.filter((t) => t.status === "active").length}
                          </div>
                          <div className="text-gray-600">Active</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-bold text-green-600">
                            {(
                              deptTeachers.reduce((sum, t) => sum + t.experience, 0) / deptTeachers.length || 0
                            ).toFixed(1)}
                          </div>
                          <div className="text-gray-600">Avg Exp</div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        View Department Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
