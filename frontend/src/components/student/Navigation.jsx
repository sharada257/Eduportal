import React from 'react';
import { Button } from "@/components/ui/button"
import { Home, BookOpen, HelpCircle, FileText, User, GraduationCap, StickyNote } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'assignments', label: 'Assignments', icon: BookOpen },
  { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
  { id: 'tests', label: 'Tests', icon: FileText },
  { id: 'grades', label: 'Grades', icon: GraduationCap },
  { id: 'notes', label: 'Study Notes', icon: StickyNote },
  { id: 'profile', label: 'Profile', icon: User },
];

const Navigation = ({ currentPage, onPageChange }) => {
  return (
    <div className="group bg-white shadow-lg w-16 hover:w-64 transition-all duration-300 border-r h-screen flex flex-col">
      <div className="p-4">
        <div className="flex felx-col items-center justify-between ">
          <h1
            className="font-bold text-lg  text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            StudentHub
          </h1>
        </div>
      </div>

      <Separator />

      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "ghost"}
              className="w-full justify-start text-black bg-white hover:bg-black hover:text-white px-2 transition-all"
              onClick={() => onPageChange(item.id)}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}

export default Navigation;
