"use client"

import { useState } from "react"
import Navigation from "./Navigation"
import Dashboard from "./Dashboard"
import Assignments from "./Assignments"
import Quizzes from "./Quizzes"
import Tests from "./Tests"
import Grades from "./Grades"
import Notes from "./Notes"
import Profile from "./Profile"

function StudentPage() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "assignments":
        return <Assignments />
      case "quizzes":
        return <Quizzes />
      case "tests":
        return <Tests />
      case "grades":
        return <Grades />
      case "notifications":
        return <Notifications />
      case "notes":
        return <Notes />
      case "profile":
        return <Profile />
      default:
        return <Dashboard />
    }
  }

  
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Navigation
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{renderCurrentPage()}</div>
        </div>
      </div>
    )
}

export default StudentPage;
