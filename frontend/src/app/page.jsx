"use client"
import StudentPage from "@/components/student/Page";
import AdminDashboardMain from "@/components/admin/page";
import Teacher from "@/components/teacher/page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Home() {
  const [user, setUser] = useState(null) // can be null | userObj
  const router = useRouter()

  useEffect(() => {
    // Simulate checking auth (e.g., from localStorage or API)
    const token = localStorage.getItem("demoUser")
    if (!token) {
      router.push("/login") // 🔁 Redirect if not logged in
    } else {
      setUser({ name: "Test User" }) // fake login
    }
  }, [])

  if (!user) return null // or loading spinner

  return (<div>
      
      
      {/* <Teacher /> */}
      <StudentPage/>
      {/* <AdminDashboardMain /> */}
  </div>
  )
}

export default Home;