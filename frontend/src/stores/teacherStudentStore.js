import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { fetchTeacherStudent } from "@/api/studentApi"; // Adjust the import path as needed

const useTeacherStudentStore = create(
  devtools((set) => ({
    teacherStudents: [],
    loading: false,
    error: null,

    fetchStudents: async (id) => {
      set({ loading: true });
      try {
        const res = await fetchTeacherStudent(id);
        set({ teacherStudents: res.data, loading: false });
      } catch (err) {
        set({ error: err.message, loading: false });
      }
    },
  }))
);

export default useTeacherStudentStore;
