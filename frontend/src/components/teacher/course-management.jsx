"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Eye, FileText, Users, BookOpen, Save, X, Upload } from "lucide-react"


export default function CourseManagement({ courses, setCourses }) {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showAddNote, setShowAddNote] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    type: "lecture" ,
  })

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Course Management</h2>
          <p className="text-gray-600">Manage your courses and add teaching materials</p>
        </div>
        {!selectedCourse && (
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Course
          </Button>
        )}
      </div>

      {!selectedCourse ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-all cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="group-hover:text-blue-600 transition-colors">{course.name}</span>
                  <Badge variant="secondary">{course.code}</Badge>
                </CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {course.students} students
                    </span>
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {course.notes?.length || 0} notes
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedCourse(course)}>
                      <BookOpen className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setSelectedCourse(null)}>
                <X className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
              <div>
                <h3 className="text-xl font-semibold">{selectedCourse.name}</h3>
                <p className="text-gray-600">{selectedCourse.code}</p>
              </div>
            </div>
            <Badge variant="outline">{selectedCourse.students} Students Enrolled</Badge>
          </div>

          <Tabs defaultValue="notes" className="space-y-6">
            <TabsList>
              <TabsTrigger value="notes">Course Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">Course Notes & Materials</h4>
                <Button onClick={() => setShowAddNote(true)} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Note
                </Button>
              </div>

              {showAddNote && (
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Add New Note
                      <Button variant="ghost" size="sm" onClick={() => setShowAddNote(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="note-title">Title</Label>
                        <Input
                          id="note-title"
                          placeholder="e.g., Chapter 1: Introduction"
                          value={newNote.title}
                          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="note-type">Type</Label>
                        <select
                          id="note-type"
                          className="w-full p-2 border rounded-md"
                          value={newNote.type}
                          onChange={(e) =>
                            setNewNote({ ...newNote, type: e.target.value })
                          }
                        >
                          <option value="lecture">Lecture Notes</option>
                          <option value="assignment">Assignment</option>
                          <option value="resource">Resource</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="note-content">Content</Label>
                      <Textarea
                        id="note-content"
                        placeholder="Enter your note content here..."
                        rows={6}
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Attach PDF (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Drag and drop PDF files here, or click to browse</p>
                        <Input type="file" accept=".pdf" className="hidden" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => addNoteToCourse(selectedCourse.id)} className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Note
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddNote(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedCourse.notes?.map((note) => (
                  <Card key={note.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">{note.title}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              note.type === "lecture" ? "default" : note.type === "assignment" ? "secondary" : "outline"
                            }
                          >
                            {note.type}
                          </Badge>
                        </div>
                      </CardTitle>
                      <CardDescription>Created on {note.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">{note.content}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteNote(selectedCourse.id, note.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <div className="col-span-2 text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No notes added yet. Click "Add Note" to get started.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
