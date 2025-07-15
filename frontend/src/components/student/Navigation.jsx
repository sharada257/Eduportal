"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  ClipboardList,
  FileText,
  CheckCircle,
  NotebookPen,
  User2,
} from "lucide-react";

const items = [
  { href: "/student", label: "Dashboard", Icon: Home },
  { href: "/student/assignments", label: "Assignments", Icon: ClipboardList },
  { href: "/student/quizzes", label: "Quizzes", Icon: BookOpen },
  { href: "/student/tests", label: "Tests", Icon: FileText },
  { href: "/student/grades", label: "Grades", Icon: CheckCircle },
  { href: "/student/notes", label: "Notes", Icon: NotebookPen },
  { href: "/student/profile", label: "Profile", Icon: User2 },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="group w-16 hover:w-64 transition-all duration-200 bg-white border-r overflow-hidden min-h-screen">
      {/* Student Portal Title */}
      <div className="flex items-center gap-3 px-3 py-4">
        <span className="text-sm font-bold text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Student Portal
        </span>
      </div>

      <ul className="space-y-1 px-2">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                  ${active ? "bg-gray-200 font-medium" : "hover:bg-gray-100"}`}
              >
                <Icon size={18} className="w-4 h-4 flex-shrink-0"/>
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
