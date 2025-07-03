"use client"

import { useState } from "react"
import AdminSidebar from "./admin-sidebar"
import AdminDashboard from "./admin-dashboard"
import StudentManagement from "./student-management"
import TeacherManagement from "./teacher-management"
import DepartmentManagement from "./department-management"
import SubjectMapping from "./subject-mapping"
import CourseManagement from "./course-management"
import AssignmentManagement from "./assignment-management"
import AdminProfile from "./admin-profile"
import AdminSettings from "./admin-settings"

export default function AdminDashboardMain() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Computer Science",
      code: "CS",
      description: "Department of Computer Science and Engineering",
      hod: "Dr. John Smith",
      hodEmail: "john.smith@university.edu",
      established: "1995",
      building: "Engineering Building",
      floor: "3rd Floor",
      phone: "+1 (555) 123-4567",
      email: "cs@university.edu",
      website: "https://cs.university.edu",
      status: "active" ,
    },
    {
      id: 2,
      name: "Mathematics",
      code: "MATH",
      description: "Department of Mathematics and Statistics",
      hod: "Dr. Sarah Wilson",
      hodEmail: "sarah.wilson@university.edu",
      established: "1980",
      building: "Science Building",
      floor: "2nd Floor",
      phone: "+1 (555) 123-4568",
      email: "math@university.edu",
      website: "https://math.university.edu",
      status: "active" ,
    },
    {
      id: 3,
      name: "Physics",
      code: "PHY",
      description: "Department of Physics and Astronomy",
      hod: "Dr. Michael Brown",
      hodEmail: "michael.brown@university.edu",
      established: "1975",
      building: "Science Building",
      floor: "4th Floor",
      phone: "+1 (555) 123-4569",
      email: "physics@university.edu",
      website: "https://physics.university.edu",
      status: "active" ,
    },
    {
      id: 4,
      name: "Chemistry",
      code: "CHEM",
      description: "Department of Chemistry and Biochemistry",
      hod: "Dr. Emily Davis",
      hodEmail: "emily.davis@university.edu",
      established: "1978",
      building: "Science Building",
      floor: "1st Floor",
      phone: "+1 (555) 123-4570",
      email: "chemistry@university.edu",
      website: "https://chemistry.university.edu",
      status: "active" ,
    },
  ])

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@university.edu",
      studentId: "STU001",
      department: "CS",
      semester: "Fall 2024",
      year: "3rd Year",
      status: "active",
      gpa: 3.8,
      enrollmentDate: "2022-09-01",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@university.edu",
      studentId: "STU002",
      department: "MATH",
      semester: "Fall 2024",
      year: "2nd Year",
      status: "active",
      gpa: 3.9,
      enrollmentDate: "2023-09-01",
    },
  ])

  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      email: "sarah.wilson@university.edu",
      employeeId: "EMP001",
      department: "MATH",
      designation: "Professor",
      specialization: "Calculus, Linear Algebra",
      status: "active",
      joiningDate: "2019-09-01",
      experience: 15,
      subjects: ["MATH101", "MATH201", "MATH301"],
    },
    {
      id: 2,
      name: "Dr. John Davis",
      email: "john.davis@university.edu",
      employeeId: "EMP002",
      department: "CS",
      designation: "Associate Professor",
      specialization: "Data Structures, Algorithms",
      status: "active",
      joiningDate: "2020-01-15",
      experience: 12,
      subjects: ["CS101", "CS201"],
    },
  ])

  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Introduction to Programming",
      code: "CS101",
      department: "CS",
      credits: 3,
      semester: "Fall 2024",
      status: "active",
    },
    {
      id: 2,
      name: "Calculus I",
      code: "MATH101",
      department: "MATH",
      credits: 4,
      semester: "Fall 2024",
      status: "active",
    },
    {
      id: 3,
      name: "Physics I",
      code: "PHY101",
      department: "PHY",
      credits: 4,
      semester: "Fall 2024",
      status: "active",
    },
  ])

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard students={students} teachers={teachers} departments={departments} courses={courses} />
      case "students":
        return <StudentManagement students={students} setStudents={setStudents} departments={departments} />
      case "teachers":
        return <TeacherManagement teachers={teachers} setTeachers={setTeachers} departments={departments} />
      case "departments":
        return (
          <DepartmentManagement
            departments={departments}
            setDepartments={setDepartments}
            students={students}
            teachers={teachers}
            courses={courses}
          />
        )
      case "courses":
        return (
          <CourseManagement courses={courses} setCourses={setCourses} departments={departments} teachers={teachers} />
        )
      case "assignments":
        return <AssignmentManagement assignments={[]} teachers={teachers} courses={courses} departments={departments} />
      case "class-mapping":
        return <SubjectMapping teachers={teachers} courses={courses} departments={departments} />
      case "profile":
        return <AdminProfile />
      case "settings":
        return <AdminSettings />
      default:
        return <AdminDashboard students={students} teachers={teachers} departments={departments} courses={courses} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  )
}
