// src/store/teacherStore.js

import create from 'zustand';
import { devtools } from 'zustand/middleware';
import * as teacherApi from '@/lib/api/teacher'; // or wherever your functions are

const useTeacherStore = create(devtools((set, get) => ({
  teachers: [],
  loading: false,
  error: null,

  fetchTeachers: async () => {
    set({ loading: true });
    try {
      const res = await teacherApi.fetchTeacherProfiles();
      set({ teachers: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addTeacher: async (data) => {
    try {
      const res = await teacherApi.createTeacherProfile(data);
      set((state) => ({
        teachers: [res.data, ...state.teachers],
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  updateTeacher: async (id, data) => {
    try {
      const res = await teacherApi.updateTeacherProfile(id, data);
      set((state) => ({
        teachers: state.teachers.map((t) => (t.id === id ? res.data : t)),
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  deleteTeacher: async (id) => {
    try {
      await teacherApi.deleteTeacherProfile(id);
      set((state) => ({
        teachers: state.teachers.filter((t) => t.id !== id),
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },
})));

export default useTeacherStore;
