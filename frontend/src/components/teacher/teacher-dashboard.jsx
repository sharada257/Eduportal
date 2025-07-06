"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Dashboard from "./dashboard";
import CourseManagement from "./course-management";
import QuizBuilder from "./quiz-builder";
import AssignmentGrading from "./assignment-grading";
import Students from "./students";
import GradeBook from "./grade-book";
import Profile from "./profile";
import Settings from "./settings";

export default function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Mathematics 101",
      code: "MATH101",
      students: 25,
      description: "Basic Mathematics",
      notes: [
        {
          id: 1,
          title: "Chapter 1: Introduction",
          content: "Basic concepts and definitions in mathematics",
          date: "2024-01-15",
          type: "lecture",
        },
      ],
    },
    {
      id: 2,
      name: "Physics Advanced",
      code: "PHY201",
      students: 18,
      description: "Advanced Physics Concepts",
      notes: [
        {
          id: 2,
          title: "Newton's Laws",
          content: "Three fundamental laws of motion",
          date: "2024-01-16",
          type: "lecture",
        },
      ],
    },
    {
      id: 3,
      name: "Chemistry Lab",
      code: "CHEM150",
      students: 22,
      description: "Laboratory Chemistry",
      notes: [],
    },
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@email.com",
      course: "MATH101",
      grade: "A",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@email.com",
      course: "MATH101",
      grade: "B+",
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike@email.com",
      course: "PHY201",
      grade: "A-",
    },
    {
      id: 4,
      name: "Emily Brown",
      email: "emily@email.com",
      course: "CHEM150",
      grade: "B",
    },
  ]);

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Calculus Problem Set 1",
      course: "MATH101",
      dueDate: "2024-02-15",
      submissions: [
        {
          studentId: 1,
          studentName: "John Smith",
          status: "submitted",
          submittedAt: "2024-02-14",
          grade: null,
          feedback: "",
        },
        {
          studentId: 2,
          studentName: "Sarah Johnson",
          status: "submitted",
          submittedAt: "2024-02-15",
          grade: 85,
          feedback: "Good work! Clear understanding of the concepts.",
          gradedAt: "2024-02-16",
        },
      ],
    },
    {
      id: 2,
      title: "Physics Lab Report",
      course: "PHY201",
      dueDate: "2024-02-20",
      submissions: [
        {
          studentId: 3,
          studentName: "Mike Davis",
          status: "submitted",
          submittedAt: "2024-02-19",
          grade: null,
          feedback: "",
        },
      ],
    },
  ]);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            courses={courses}
            students={students}
            assignments={assignments}
          />
        );
      case "courses":
        return <CourseManagement courses={courses} setCourses={setCourses} />;
      case "students":
        return <Students students={students} courses={courses} />;
      case "quiz-builder":
        return <QuizBuilder courses={courses} />;
      case "assignments":
        return (
          <AssignmentGrading
            assignments={assignments}
            setAssignments={setAssignments}
            courses={courses}
          />
        );
      case "grades":
        return <GradeBook courses={courses} students={students} />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      default:
        return (
          <Dashboard
            courses={courses}
            students={students}
            assignments={assignments}
          />
        );
    }
  };

    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 z-50 h-full bg-white shadow-lg transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-16"
          }`}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>
  
        {/* Content */}
        <div
          className={`transition-all duration-300 flex-1 h-screen overflow-auto p-6 ${
            isSidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </div>
    );
  }
  