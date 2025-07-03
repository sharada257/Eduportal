"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Save, Users, BookOpen } from "lucide-react"


export default function SubjectMapping({ teachers, courses, departments }) {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [mappings, setMappings] = useState([
    { id: "1", teacherId: 1, courseId: 1, semester: "Fall 2024" },
    { id: "2", teacherId: 2, courseId: 2, semester: "Fall 2024" },
    { id: "3", teacherId: 3, courseId: 3, semester: "Fall 2024" },
  ])

  const [availableTeachers, setAvailableTeachers] = useState(teachers)
  const [availableCourses, setAvailableCourses] = useState(courses)

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    // Handle teacher to course mapping
    if (source.droppableId === "teachers" && destination.droppableId.startsWith("course-")) {
      const courseId = Number.parseInt(destination.droppableId.split("-")[1])
      const teacherId = Number.parseInt(draggableId.split("-")[1])

      const newMapping = {
        id: Date.now().toString(),
        teacherId,
        courseId,
        semester: "Fall 2024",
      }

      setMappings([...mappings, newMapping])
    }
  }

  const getTeacherById = (id) => teachers.find((t) => t.id === id)
  const getCourseById = (id) => courses.find((c) => c.id === id)

  const filteredCourses =
    selectedDepartment === "all" ? courses : courses.filter((c) => c.department === selectedDepartment)

  const filteredTeachers =
    selectedDepartment === "all" ? teachers : teachers.filter((t) => t.department === selectedDepartment)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Subject Assignment</h2>
          <p className="text-gray-600">Assign teachers to subjects using drag and drop</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Department" />
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
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Mappings
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Teachers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Available Teachers
              </CardTitle>
              <CardDescription>Drag teachers to assign them to courses</CardDescription>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="teachers">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {filteredTeachers.map((teacher, index) => (
                      <Draggable key={teacher.id} draggableId={`teacher-${teacher.id}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                              snapshot.isDragging ? "shadow-lg" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {teacher.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{teacher.name}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {teacher.department}
                                  </Badge>
                                  <span className="text-xs text-gray-500">{teacher.designation}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          {/* Course Assignment Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Assignments
              </CardTitle>
              <CardDescription>Drop teachers onto courses to create assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCourses.map((course) => {
                  const assignedTeachers = mappings
                    .filter((m) => m.courseId === course.id)
                    .map((m) => getTeacherById(m.teacherId))
                    .filter(Boolean)

                  return (
                    <Droppable key={course.id} droppableId={`course-${course.id}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-4 border-2 border-dashed rounded-lg transition-colors ${
                            snapshot.isDraggingOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
                          }`}
                        >
                          <div className="mb-3">
                            <h4 className="font-medium">{course.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{course.code}</Badge>
                              <Badge variant="secondary">{course.department}</Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {assignedTeachers.map((teacher, index) => (
                              <div key={teacher.id} className="p-2 bg-white border rounded flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">
                                    {teacher.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{teacher.name}</span>
                                <Badge variant="outline" className="text-xs ml-auto">
                                  {teacher.designation}
                                </Badge>
                              </div>
                            ))}
                            {assignedTeachers.length === 0 && (
                              <div className="text-center py-4 text-gray-500 text-sm">Drop teachers here to assign</div>
                            )}
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </DragDropContext>

      {/* Current Mappings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Assignments Summary</CardTitle>
          <CardDescription>Overview of all teacher-subject assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mappings.map((mapping) => {
                  const teacher = getTeacherById(mapping.teacherId)
                  const course = getCourseById(mapping.courseId)
                  if (!teacher || !course) return null

                  return (
                    <tr key={mapping.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {teacher.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{teacher.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div>
                          <span className="text-sm font-medium">{course.name}</span>
                          <div className="text-xs text-gray-500">{course.code}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant="outline">{course.department}</Badge>
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant="secondary">{mapping.semester}</Badge>
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => setMappings(mappings.filter((m) => m.id !== mapping.id))}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
