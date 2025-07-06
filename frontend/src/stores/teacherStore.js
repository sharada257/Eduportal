import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as teacherApi from "@/lib/api/studentApi"; // adjust path as needed

const useTeacherStore = create(
  devtools((set, get) => ({
    teachers: [],
    loading: false,
    error: null,

    fetchTeachers: async () => {
      set({ loading: true, error: null });
      try {
        const res = await teacherApi.fetchTeacherProfiles();
        set({ teachers: res.data, loading: false });
      } catch (err) {
        set({
          error: err?.response?.data?.detail || err.message || "Fetch failed",
          loading: false,
        });
      }
    },

    addTeacher: async (data) => {
      try {
        const res = await teacherApi.createTeacherProfile(data);
        set((state) => ({
          teachers: [res.data, ...state.teachers],
        }));
      } catch (err) {
        set({
          error: err?.response?.data?.detail || err.message || "Add failed",
        });
      }
    },

    updateTeacher: async (id, data) => {
      try {
        const res = await teacherApi.updateTeacherProfile(id, data);
        set((state) => ({
          teachers: state.teachers.map((t) =>
            t.id === id ? res.data : t
          ),
        }));
      } catch (err) {
        set({
          error: err?.response?.data?.detail || err.message || "Update failed",
        });
      }
    },

    deleteTeacher: async (id) => {
      try {
        await teacherApi.deleteTeacherProfile(id);
        set((state) => ({
          teachers: state.teachers.filter((t) => t.id !== id),
        }));
      } catch (err) {
        set({
          error: err?.response?.data?.detail || err.message || "Delete failed",
        });
      }
    },
  }))
);

export default useTeacherStore;
