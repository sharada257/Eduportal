"use client";
import StudentPage from "@/components/student/Page";
import AdminDashboardMain from "@/components/admin/page";
import Teacher from "@/components/teacher/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user); 
  const userType = useAuthStore((state) => state.userType);
  console.log("User Type:", userType);
  console.log("User:", user);
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div>
      {/* {userType === "Student" && <StudentPage />} */}
      {/* {userType === "teacher" && <Teacher />} */}
      {/* {userType === "admin" && <AdminDashboardMain />} */}
      <Teacher/>
    </div>
  );
}
