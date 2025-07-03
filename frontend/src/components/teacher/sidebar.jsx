"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Users,
  ClipboardList,
  GraduationCap,
  FileCheck,
  BarChart3,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"



const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "students", label: "Students", icon: Users },
  { id: "quiz-builder", label: "Quiz Builder", icon: ClipboardList },
  { id: "assignments", label: "Grade Work", icon: FileCheck },
  { id: "grades", label: "Grade Book", icon: GraduationCap },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function Sidebar({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) {
  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} border-r`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1
            className={`font-bold text-lg text-gray-900 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
          >
            TeachHub
          </h1>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
        {sidebarOpen && <p className="text-sm text-gray-600 mt-1">Teaching Made Simple</p>}
      </div>

      <Separator />

      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={`w-full justify-start text-black bg-white hover:bg-black hover:text-white ${!sidebarOpen && "px-2"} transition-all`}
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="w-4 h-4" />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
