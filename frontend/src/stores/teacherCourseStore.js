import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  fetchSubjectTeacherSections,
  fetchSubjectTeacherSection,
  createSubjectTeacherSection,
  updateSubjectTeacherSection,
  patchSubjectTeacherSection,
  deleteSubjectTeacherSection,
} from "@/api/studentApi"; // adjust path as needed

const useTeacherCourseStore = create(
  devtools((set, get) => ({
    courses: [],
    loading: false,
    error: null,

    // Fetch all course assignments for all teachers
    getAllCourses: async () => {
      set({ loading: true });
      try {
        const response = await fetchSubjectTeacherSections();
        set({ courses: response.data, loading: false });
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Fetch specific courses by teacher ID
    getCoursesByTeacher: async (teacherId) => {
      set({ loading: true });
      try {
        const response = await fetchSubjectTeacherSection(teacherId);
        set({ courses: response.data, loading: false });
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Create
    addCourse: async (data) => {
      try {
        const response = await createSubjectTeacherSection(data);
        set((state) => ({
          courses: [response.data, ...state.courses],
        }));
      } catch (error) {
        set({ error });
      }
    },

    // Update
    updateCourse: async (id, data) => {
      try {
        const response = await updateSubjectTeacherSection(id, data);
        set((state) => ({
          courses: state.courses.map((c) => (c.id === id ? response.data : c)),
        }));
      } catch (error) {
        set({ error });
      }
    },

    // Patch
    patchCourse: async (id, data) => {
      try {
        const response = await patchSubjectTeacherSection(id, data);
        set((state) => ({
          courses: state.courses.map((c) => (c.id === id ? response.data : c)),
        }));
      } catch (error) {
        set({ error });
      }
    },

    // Delete
    deleteCourse: async (id) => {
      try {
        await deleteSubjectTeacherSection(id);
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
        }));
      } catch (error) {
        set({ error });
      }
    },
  }))
);

export default useTeacherCourseStore;
