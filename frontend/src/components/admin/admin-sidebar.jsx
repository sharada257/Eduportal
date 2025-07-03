"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  UserCheck,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  School,
} from "lucide-react"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: GraduationCap },
  { id: "teachers", label: "Teachers", icon: Users },
  { id: "departments", label: "Departments", icon: Building2 },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "semesters", label: "Semesters", icon: Calendar },
  { id: "assignments", label: "Assignments", icon: UserCheck },
  { id: "class-mapping", label: "Class Mapping", icon: School },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function AdminSidebar({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} border-r`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1
            className={`font-bold text-lg text-gray-900 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
          >
            UniAdmin
          </h1>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
        {sidebarOpen && <p className="text-sm text-gray-600 mt-1">University Management</p>}
      </div>

      <Separator />

      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${!sidebarOpen && "px-2"} transition-all`}
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
