"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  { href: "/teacher/", label: "Dashboard", icon: BarChart3 },
  { href: "/teacher/courses", label: "My Courses", icon: BookOpen },
  { href: "/teacher/students", label: "Students", icon: Users },
  { href: "/teacher/quizzesr", label: "Quiz Builder", icon: ClipboardList },
  { href: "/teacher/assignments", label: "Grade Work", icon: FileCheck },
  { href: "/teacher/grades", label: "Grade Book", icon: GraduationCap },
  { href: "/teacher/profile", label: "Profile", icon: User },
  { href: "/teacher/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="group bg-white shadow-lg w-16 hover:w-64 transition-all duration-300 border-r h-screen flex flex-col">
      <div className="p-4">
        <div className="flex flex-col items-center justify-between">
          <h1 className="font-bold text-lg text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
            TeacherHub
          </h1>
        </div>
      </div>

      <Separator />

      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Button
              variant={pathname === href ? "default" : "ghost"}
              className="w-full justify-start text-black bg-white hover:bg-black hover:text-white px-2 transition-all"
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {label}
              </span>
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}
