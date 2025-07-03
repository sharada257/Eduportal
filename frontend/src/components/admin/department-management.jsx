"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, Building2, Users, GraduationCap, Save, X } from "lucide-react"

export default function DepartmentManagement({
  departments,
  setDepartments,
  students,
  teachers,
  courses,
}) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    code: "",
    description: "",
    hod: "",
    hodEmail: "",
    building: "",
    floor: "",
    phone: "",
    email: "",
    website: "",
  })

  const addDepartment = () => {
    if (!newDepartment.name || !newDepartment.code) return

    const department = {
      id: Date.now(),
      ...newDepartment,
      established: new Date().getFullYear().toString(),
      status: "active",
    }

    setDepartments([...departments, department])
    setNewDepartment({
      name: "",
      code: "",
      description: "",
      hod: "",
      hodEmail: "",
      building: "",
      floor: "",
      phone: "",
      email: "",
      website: "",
    })
    setShowAddForm(false)
  }

  const deleteDepartment = (id) => {
    setDepartments(departments.filter((dept) => dept.id !== id))
  }

  const getDepartmentStats = (deptCode) => {
    const deptStudents = students.filter((s) => s.department === deptCode).length
    const deptTeachers = teachers.filter((t) => t.department === deptCode).length
    const deptCourses = courses.filter((c) => c.department === deptCode).length
    return { students: deptStudents, teachers: deptTeachers, courses: deptCourses }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Department Management</h2>
          <p className="text-gray-600">Manage university departments and their information</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Department
        </Button>
      </div>

      {/* Add Department Form */}
      {showAddForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Add New Department
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dept-name">Department Name</Label>
                <Input
                  id="dept-name"
                  placeholder="e.g., Computer Science"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dept-code">Department Code</Label>
                <Input
                  id="dept-code"
                  placeholder="e.g., CS"
                  value={newDepartment.code}
                  onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="dept-description">Description</Label>
              <Textarea
                id="dept-description"
                placeholder="Brief description of the department"
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dept-hod">Head of Department</Label>
                <Input
                  id="dept-hod"
                  placeholder="Dr. John Smith"
                  value={newDepartment.hod}
                  onChange={(e) => setNewDepartment({ ...newDepartment, hod: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dept-hod-email">HOD Email</Label>
                <Input
                  id="dept-hod-email"
                  type="email"
                  placeholder="hod@university.edu"
                  value={newDepartment.hodEmail}
                  onChange={(e) => setNewDepartment({ ...newDepartment, hodEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dept-building">Building</Label>
                <Input
                  id="dept-building"
                  placeholder="Science Building"
                  value={newDepartment.building}
                  onChange={(e) => setNewDepartment({ ...newDepartment, building: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dept-floor">Floor</Label>
                <Input
                  id="dept-floor"
                  placeholder="3rd Floor"
                  value={newDepartment.floor}
                  onChange={(e) => setNewDepartment({ ...newDepartment, floor: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dept-phone">Phone</Label>
                <Input
                  id="dept-phone"
                  placeholder="+1 (555) 123-4567"
                  value={newDepartment.phone}
                  onChange={(e) => setNewDepartment({ ...newDepartment, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dept-email">Department Email</Label>
                <Input
                  id="dept-email"
                  type="email"
                  placeholder="cs@university.edu"
                  value={newDepartment.email}
                  onChange={(e) => setNewDepartment({ ...newDepartment, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dept-website">Website</Label>
                <Input
                  id="dept-website"
                  placeholder="https://cs.university.edu"
                  value={newDepartment.website}
                  onChange={(e) => setNewDepartment({ ...newDepartment, website: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addDepartment} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Add Department
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Departments</p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              </div>
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Departments</p>
                <p className="text-2xl font-bold text-green-600">
                  {departments.filter((d) => d.status === "active").length}
                </p>
              </div>
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-purple-600">{students.length}</p>
              </div>
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Faculty</p>
                <p className="text-2xl font-bold text-orange-600">{teachers.length}</p>
              </div>
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => {
          const stats = getDepartmentStats(department.code)
          return (
            <Card key={department.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{department.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{department.code}</Badge>
                    <Badge variant={department.status === "active" ? "default" : "secondary"}>
                      {department.status}
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>{department.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* HOD Information */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {department.hod
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{department.hod}</p>
                      <p className="text-xs text-gray-600">Head of Department</p>
                    </div>
                  </div>

                  {/* Department Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-600">{stats.students}</div>
                      <div className="text-xs text-gray-600">Students</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">{stats.teachers}</div>
                      <div className="text-xs text-gray-600">Faculty</div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <div className="text-lg font-bold text-purple-600">{stats.courses}</div>
                      <div className="text-xs text-gray-600">Courses</div>
                    </div>
                  </div>

                  {/* Location & Contact */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>
                        {department.building}, {department.floor}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <span>{department.email}</span>
                    </div>
                    {department.website && (
                      <div className="flex items-center gap-2">
                        <span>🌐</span>
                        <span className="text-blue-600">{department.website}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => deleteDepartment(department.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
