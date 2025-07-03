import React from 'react';
import { Button } from "@/components/ui/button"
import { Home, BookOpen, HelpCircle, FileText, User, GraduationCap, Bell, StickyNote } from 'lucide-react';

import { Separator } from "@/components/ui/separator"
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'tests', label: 'Tests', icon: FileText },
    { id: 'grades', label: 'Grades', icon: GraduationCap },
    { id: 'notes', label: 'Study Notes', icon: StickyNote },
    { id: 'profile', label: 'Profile', icon: User },
  ];


const Navigation = ({ currentPage, onPageChange, sidebarOpen, setSidebarOpen }) => {
    return (
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} border-r`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1
              className={`font-bold text-lg text-gray-900 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
            >
              StudentHub
            </h1>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
          {sidebarOpen && <p className="text-sm text-gray-600 mt-1">Learning Made Simple</p>}
        </div>

        <Separator />

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                className={`w-full justify-start text-black bg-white hover:bg-black hover:text-white ${!sidebarOpen && "px-2"} transition-all`}
                onClick={() => onPageChange(item.id)}
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


export default Navigation;