// src/store/studentStore.js

import create from 'zustand';
import { devtools } from 'zustand/middleware';
import * as studentApi from '@/lib/api/student';

const useStudentStore = create(devtools((set, get) => ({
  students: [],
  loading: false,
  error: null,

  fetchStudents: async () => {
    set({ loading: true });
    try {
      const res = await studentApi.fetchStudentProfiles();
      set({ students: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addStudent: async (data) => {
    try {
      const res = await studentApi.createStudentProfile(data);
      set((state) => ({
        students: [res.data, ...state.students],
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  updateStudent: async (id, data) => {
    try {
      const res = await studentApi.updateStudentProfile(id, data);
      set((state) => ({
        students: state.students.map((s) => (s.id === id ? res.data : s)),
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  deleteStudent: async (id) => {
    try {
      await studentApi.deleteStudentProfile(id);
      set((state) => ({
        students: state.students.filter((s) => s.id !== id),
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },
})));

export default useStudentStore;
