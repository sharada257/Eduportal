"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  Download,
  Upload,
  Filter,
  Search,
  AlertCircle,
} from "lucide-react";

export default function AssignmentGrading({
  assignments,
  setAssignments,
  courses,
}) {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const gradeAssignment = (assignmentId, studentId, grade, feedback) => {
    setAssignments(
      assignments.map((assignment) => {
        if (assignment.id === assignmentId) {
          return {
            ...assignment,
            submissions: assignment.submissions.map((submission) => {
              if (submission.studentId === studentId) {
                return {
                  ...submission,
                  grade,
                  feedback,
                  gradedAt: new Date().toISOString(),
                };
              }
              return submission;
            }),
          };
        }
        return assignment;
      })
    );
    setGradingSubmission(null);
  };

  const filteredAssignments = assignments?.filter((assignment) => {
    const matchesCourse =
      selectedCourse === "all" || assignment.course === selectedCourse;
    const matchesSearch = assignment.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const getSubmissionStats = (assignment) => {
    const total = assignment.submissions.length;
    const graded = assignment.submissions.filter(
      (s) => s.grade !== null
    ).length;
    const pending = total - graded;
    return { total, graded, pending };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Grade Assignments</h2>
          <p className="text-gray-600">Review and grade student submissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Bulk Upload Grades
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Grades
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <Label>Filter:</Label>
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses?.map((course) => (
                  <SelectItem key={course.id} value={course.code}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedAssignment ? (
        /* Assignment List */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments?.map((assignment) => {
            const stats = getSubmissionStats(assignment);
            const isOverdue = new Date(assignment.dueDate) < new Date();

            return (
              <Card
                key={assignment.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{assignment.title}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{assignment.course}</Badge>
                      {isOverdue && (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>Due: {assignment.dueDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {stats.total}
                        </div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {stats.graded}
                        </div>
                        <div className="text-xs text-gray-600">Graded</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {stats.pending}
                        </div>
                        <div className="text-xs text-gray-600">Pending</div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            stats.total > 0
                              ? (stats.graded / stats.total) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => setSelectedAssignment(assignment)}
                      disabled={stats.pending === 0}
                    >
                      {stats.pending > 0
                        ? `Grade ${stats.pending} Submissions`
                        : "All Graded"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Assignment Grading Interface */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => setSelectedAssignment(null)}
              >
                ← Back to Assignments
              </Button>
              <h3 className="text-xl font-semibold mt-2">
                {selectedAssignment.title}
              </h3>
              <p className="text-gray-600">
                {selectedAssignment.course} • Due: {selectedAssignment.dueDate}
              </p>
            </div>
            <Badge variant="outline">
              {getSubmissionStats(selectedAssignment).graded} /{" "}
              {getSubmissionStats(selectedAssignment).total} Graded
            </Badge>
          </div>

          {gradingSubmission ? (
            /* Individual Grading Interface */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {gradingSubmission.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">
                        {gradingSubmission.studentName}
                      </div>
                      <div className="text-sm text-gray-600">
                        Submitted: {gradingSubmission.submittedAt}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setGradingSubmission(null)}
                  >
                    Close
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="submission" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="submission">Submission</TabsTrigger>
                    <TabsTrigger value="grading">Grading</TabsTrigger>
                    <TabsTrigger value="rubric">Rubric</TabsTrigger>
                  </TabsList>

                  <TabsContent value="submission">
                    <Card>
                      <CardHeader>
                        <CardTitle>Student Submission</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">
                              Submission Content:
                            </p>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Sed do eiusmod tempor incididunt ut labore
                              et dolore magna aliqua. Ut enim ad minim veniam,
                              quis nostrud exercitation ullamco laboris.
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Download File
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View Full Screen
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="grading">
                    <Card>
                      <CardHeader>
                        <CardTitle>Grade Submission</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="grade">Grade (0-100)</Label>
                              <Input
                                id="grade"
                                type="number"
                                min="0"
                                max="100"
                                defaultValue={gradingSubmission.grade || ""}
                                placeholder="Enter grade"
                              />
                            </div>
                            <div>
                              <Label>Quick Grade</Label>
                              <div className="flex gap-1">
                                {[
                                  { label: "A", value: 95 },
                                  { label: "B", value: 85 },
                                  { label: "C", value: 75 },
                                  { label: "D", value: 65 },
                                ].map((grade) => (
                                  <Button
                                    key={grade.label}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const input =
                                        document.getElementById("grade");
                                      if (input)
                                        input.value = grade.value.toString();
                                    }}
                                  >
                                    {grade.label}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="feedback">Feedback</Label>
                            <Textarea
                              id="feedback"
                              defaultValue={gradingSubmission.feedback || ""}
                              placeholder="Provide detailed feedback for the student..."
                              rows={6}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                const gradeInput =
                                  document.getElementById("grade");
                                const feedbackInput =
                                  document.getElementById("feedback");
                                const grade = Number.parseInt(gradeInput.value);
                                const feedback = feedbackInput.value;

                                if (grade >= 0 && grade <= 100) {
                                  gradeAssignment(
                                    selectedAssignment.id,
                                    gradingSubmission.studentId,
                                    grade,
                                    feedback
                                  );
                                }
                              }}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Save Grade
                            </Button>
                            <Button variant="outline">Save as Draft</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="rubric">
                    <Card>
                      <CardHeader>
                        <CardTitle>Grading Rubric</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-500">
                          Rubric-based grading coming soon...
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            /* Submissions List */
            <div className="space-y-4">
              {selectedAssignment.submissions.map((submission) => (
                <Card
                  key={submission.studentId}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {submission.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">
                            {submission.studentName}
                          </div>
                          <div className="text-sm text-gray-600">
                            Submitted: {submission.submittedAt}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {submission.grade !== null ? (
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {submission.grade}/100
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              Graded{" "}
                              {new Date(
                                submission.gradedAt
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-orange-600">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setGradingSubmission(submission)}
                          >
                            {submission.grade !== null ? "Review" : "Grade"}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {submission.feedback && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          {submission.feedback}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
