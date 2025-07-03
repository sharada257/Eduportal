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
import { Switch } from "@/components/ui/switch"
import { Trash2, Eye, Save, HelpCircle, CheckCircle, FileText, Play, Copy, ArrowUp, ArrowDown } from "lucide-react"

export default function QuizBuilder({ courses }) {
  const [currentQuiz, setCurrentQuiz] = useState({
    id: Date.now(),
    title: "",
    course: "",
    description: "",
    timeLimit: 30,
    attempts: 1,
    shuffleQuestions: false,
    showResults: true,
    questions: [],
    status: "draft",
  })

  const [activeTab, setActiveTab] = useState("details")
  const [editingQuestion, setEditingQuestion] = useState(null)

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type,
      question: "",
      points: 1,
      ...(type === "multiple-choice" && { options: ["", "", "", ""], correctAnswer: 0 }),
      ...(type === "true-false" && { correctAnswer: "true" }),
    }
    setCurrentQuiz({
      ...currentQuiz,
      questions: [...currentQuiz.questions, newQuestion],
    })
    setEditingQuestion(newQuestion)
  }

  const updateQuestion = (questionId, updates) => {
    setCurrentQuiz({
      ...currentQuiz,
      questions: currentQuiz.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
    })
  }

  const deleteQuestion = (questionId) => {
    setCurrentQuiz({
      ...currentQuiz,
      questions: currentQuiz.questions.filter((q) => q.id !== questionId),
    })
    setEditingQuestion(null)
  }

  const moveQuestion = (questionId, direction) => {
    const questions = [...currentQuiz.questions]
    const index = questions.findIndex((q) => q.id === questionId)
    if ((direction === "up" && index > 0) || (direction === "down" && index < questions.length - 1)) {
      const newIndex = direction === "up" ? index - 1 : index + 1
      ;[questions[index], questions[newIndex]] = [questions[newIndex], questions[index]]
      setCurrentQuiz({ ...currentQuiz, questions })
    }
  }

  const totalPoints = currentQuiz.questions.reduce((sum, q) => sum + q.points, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Quiz Builder</h2>
          <p className="text-gray-600">Create engaging quizzes and assessments for your students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Quiz
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quiz Builder Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quiz Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <Badge variant="secondary">{currentQuiz.questions.length}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Points:</span>
                  <Badge variant="secondary">{totalPoints}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Time Limit:</span>
                  <Badge variant="secondary">{currentQuiz.timeLimit} min</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <Badge variant={currentQuiz.status === "published" ? "default" : "outline"}>
                    {currentQuiz.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Add Question Type:</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addQuestion("multiple-choice")}
                    className="justify-start"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Multiple Choice
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addQuestion("true-false")}
                    className="justify-start"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    True/False
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addQuestion("short-answer")}
                    className="justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Short Answer
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addQuestion("essay")} className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Essay
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Quiz Builder */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Quiz Details</TabsTrigger>
              <TabsTrigger value="questions">Questions ({currentQuiz.questions.length})</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Information</CardTitle>
                  <CardDescription>Set up the basic details for your quiz</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quiz-title">Quiz Title</Label>
                      <Input
                        id="quiz-title"
                        placeholder="e.g., Chapter 1 Quiz"
                        value={currentQuiz.title}
                        onChange={(e) => setCurrentQuiz({ ...currentQuiz, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiz-course">Course</Label>
                      <Select
                        value={currentQuiz.course}
                        onValueChange={(value) => setCurrentQuiz({ ...currentQuiz, course: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.code}>
                              {course.name} ({course.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="quiz-description">Description</Label>
                    <Textarea
                      id="quiz-description"
                      placeholder="Brief description of the quiz content and objectives"
                      value={currentQuiz.description}
                      onChange={(e) => setCurrentQuiz({ ...currentQuiz, description: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="space-y-6">
              {currentQuiz.questions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No questions yet</h3>
                    <p className="text-gray-600 mb-4">Start building your quiz by adding questions from the sidebar</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {currentQuiz.questions.map((question, index) => (
                    <Card
                      key={question.id}
                      className={`transition-all ${editingQuestion?.id === question.id ? "ring-2 ring-blue-500" : ""}`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            Question {index + 1}
                            <Badge variant="outline">{question.type.replace("-", " ")}</Badge>
                            <Badge variant="secondary">{question.points} pts</Badge>
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveQuestion(question.id, "up")}
                              disabled={index === 0}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveQuestion(question.id, "down")}
                              disabled={index === currentQuiz.questions.length - 1}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditingQuestion(question)}>
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteQuestion(question.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {editingQuestion?.id === question.id ? (
                          <div className="space-y-4">
                            <div>
                              <Label>Question</Label>
                              <Textarea
                                value={question.question}
                                onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                                placeholder="Enter your question here..."
                              />
                            </div>

                            {question.type === "multiple-choice" && (
                              <div>
                                <Label>Answer Options</Label>
                                <div className="space-y-2">
                                  {question.options?.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-2">
                                      <input
                                        type="radio"
                                        name={`correct-${question.id}`}
                                        checked={question.correctAnswer === optionIndex}
                                        onChange={() => updateQuestion(question.id, { correctAnswer: optionIndex })}
                                      />
                                      <Input
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...(question.options || [])]
                                          newOptions[optionIndex] = e.target.value
                                          updateQuestion(question.id, { options: newOptions })
                                        }}
                                        placeholder={`Option ${optionIndex + 1}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {question.type === "true-false" && (
                              <div>
                                <Label>Correct Answer</Label>
                                <Select
                                  value={question.correctAnswer}
                                  onValueChange={(value) => updateQuestion(question.id, { correctAnswer: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">True</SelectItem>
                                    <SelectItem value="false">False</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Points</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={question.points}
                                  onChange={(e) =>
                                    updateQuestion(question.id, { points: Number.parseInt(e.target.value) || 1 })
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Explanation (Optional)</Label>
                              <Textarea
                                value={question.explanation || ""}
                                onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                                placeholder="Explain the correct answer..."
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button onClick={() => setEditingQuestion(null)}>Done Editing</Button>
                              <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium mb-2">{question.question || "Click edit to add question text"}</p>
                            {question.type === "multiple-choice" && question.options && (
                              <div className="space-y-1">
                                {question.options.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className={`text-sm p-2 rounded ${
                                      question.correctAnswer === optionIndex
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-50"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optionIndex)}. {option || `Option ${optionIndex + 1}`}
                                  </div>
                                ))}
                              </div>
                            )}
                            {question.type === "true-false" && (
                              <div className="text-sm">
                                Correct Answer:{" "}
                                <Badge variant={question.correctAnswer === "true" ? "default" : "secondary"}>
                                  {question.correctAnswer}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Settings</CardTitle>
                  <CardDescription>Configure how students will take this quiz</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                      <Input
                        id="time-limit"
                        type="number"
                        min="1"
                        value={currentQuiz.timeLimit}
                        onChange={(e) =>
                          setCurrentQuiz({ ...currentQuiz, timeLimit: Number.parseInt(e.target.value) || 30 })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="attempts">Number of Attempts</Label>
                      <Input
                        id="attempts"
                        type="number"
                        min="1"
                        value={currentQuiz.attempts}
                        onChange={(e) =>
                          setCurrentQuiz({ ...currentQuiz, attempts: Number.parseInt(e.target.value) || 1 })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Shuffle Questions</Label>
                        <p className="text-sm text-gray-600">Randomize question order for each student</p>
                      </div>
                      <Switch
                        checked={currentQuiz.shuffleQuestions}
                        onCheckedChange={(checked) => setCurrentQuiz({ ...currentQuiz, shuffleQuestions: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Results Immediately</Label>
                        <p className="text-sm text-gray-600">Students see their score right after submission</p>
                      </div>
                      <Switch
                        checked={currentQuiz.showResults}
                        onCheckedChange={(checked) => setCurrentQuiz({ ...currentQuiz, showResults: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publish Quiz</CardTitle>
                  <CardDescription>Make this quiz available to students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Button className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Publish Quiz
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      Duplicate Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
