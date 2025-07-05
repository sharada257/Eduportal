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

const navigationItems = [
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
    <div
      className={`bg-white shadow-lg transition-all duration-300 hover:w-64 w-16 border-r`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1
            className={`font-bold text-lg text-gray-900 transition-opacity 
              group-hover:opacity-100 opacity-0 
            `}
          >
            TeachHub
          </h1>
        </div>

        <p className="text-sm text-gray-600 mt-1 hover:opacity-100 opacity-0">
          Teaching Made Simple
        </p>
      </div>

      <Separator />

      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start text-black bg-white hover:bg-black hover:text-white px-2 transition-all"
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="w-4 h-4" />

              <span className="ml-3 opacity-0 text-black group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
