import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as studentApi from '@/lib/api/';

const useTeacherStudentStore = create(devtools((set, get) => ({
  teacherStudents: [],
  loading: false,
  error: null,

  // Fetch students for a specific teacher
  fetchStudents: async (teacherId) => {
    set({ loading: true, error: null });
    try {
      const res = await studentApi.fetchTeacherStudent(teacherId);
      set({ teacherStudents: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
})));

export default useTeacherStudentStore;