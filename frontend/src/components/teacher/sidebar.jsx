"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Users,
  ClipboardList,
  GraduationCap,
  FileCheck,
  BarChart3,
  Settings,
  User,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "students", label: "Students", icon: Users },
  { id: "quiz-builder", label: "Quiz Builder", icon: ClipboardList },
  { id: "assignments", label: "Grade Work", icon: FileCheck },
  { id: "grades", label: "Grade Book", icon: GraduationCap },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activeSection, setActiveSection }) {
  return (
    <div className="group bg-white shadow-lg w-16 hover:w-64 transition-all duration-300 border-r h-screen flex flex-col">
      <div className="p-4">
        <div className="flex felx-col items-center justify-between ">
          <h1 className="font-bold text-lg  text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
            TeacherHub
          </h1>
        </div>
      </div>

      <Separator />

      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start text-black bg-white hover:bg-black hover:text-white px-2 transition-all"
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
