import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  fetchAssignments,
  fetchAssignment,
  createAssignment,
  updateAssignment,
  patchAssignment,
  deleteAssignment,
} from "@/api/studentApi"; // adjust path if needed

const useAssignmentStore = create(
  devtools((set, get) => ({
    assignments: [],
    assignment: null, // for single assignment details
    loading: false,
    error: null,

    // Fetch all assignments
    getAllAssignments: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetchAssignments();
        set({ assignments: response.data, loading: false });
      } catch (error) {
        console.error("Error fetching assignments:", error);
        set({ error, loading: false });
      }
    },

    // Fetch a single assignment by ID
    getAssignment: async (assignmentId) => {
      set({ loading: true, error: null });
      try {
        const response = await fetchAssignment(assignmentId);
        set({ assignment: response.data, loading: false });
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Create new assignment
    addAssignment: async (data) => {
      set({ loading: true, error: null });
      try {
        const response = await createAssignment(data);
        set((state) => ({
          assignments: [response.data, ...state.assignments],
          loading: false,
        }));
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Update an assignment completely
    updateAssignment: async (assignmentId, data) => {
      set({ loading: true, error: null });
      try {
        const response = await updateAssignment(assignmentId, data);
        set((state) => ({
          assignments: state.assignments.map((a) =>
            a.id === assignmentId ? response.data : a
          ),
          loading: false,
        }));
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Patch an assignment partially
    patchAssignment: async (assignmentId, data) => {
      set({ loading: true, error: null });
      try {
        const response = await patchAssignment(assignmentId, data);
        set((state) => ({
          assignments: state.assignments.map((a) =>
            a.id === assignmentId ? response.data : a
          ),
          loading: false,
        }));
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Delete an assignment
    deleteAssignment: async (assignmentId) => {
      set({ loading: true, error: null });
      try {
        await deleteAssignment(assignmentId);
        set((state) => ({
          assignments: state.assignments.filter((a) => a.id !== assignmentId),
          loading: false,
        }));
      } catch (error) {
        set({ error, loading: false });
      }
    },
  }))
);

export default useAssignmentStore;
