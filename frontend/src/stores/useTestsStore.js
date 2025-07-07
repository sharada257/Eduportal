import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  fetchTests,
  fetchTest,
  createTest,
  updateTest,
  patchTest,
  deleteTest,
} from "@/api/studentApi"; // adjust the path to your API functions

const useTestStore = create(
  devtools((set, get) => ({
    tests: [],
    test: null,
    loading: false,
    error: null,

    // Fetch all tests
    getAllTests: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetchTests();
        set({ tests: response.data, loading: false });
      } catch (error) {
        console.error("Error fetching tests:", error);
        set({ error, loading: false });
      }
    },

    // Fetch a single test by ID
    getTest: async (testId) => {
      set({ loading: true, error: null });
      try {
        const response = await fetchTest(testId);
        set({ test: response.data, loading: false });
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Create a new test
    addTest: async (data) => {
      set({ loading: true, error: null });
      try {
        const response = await createTest(data);
        set((state) => ({
          tests: [response.data, ...state.tests],
          loading: false,
        }));
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Update a test completely
    updateTest: async (testId, data) => {
      set({ loading: true, error: null });
      try {
        const response = await updateTest(testId, data);
        set((state) => ({
          tests: state.tests.map((t) =>
            t.id === testId ? response.data : t
          ),
          loading: false,
        }));
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Patch a test partially
    patchTest: async (testId, data) => {
      set({ loading: true, error: null });
      try {
        const response = await patchTest(testId, data);
        set((state) => ({
          tests: state.tests.map((t) =>
            t.id === testId ? response.data : t
          ),
          loading: false,
        }));
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Delete a test
    deleteTest: async (testId) => {
      set({ loading: true, error: null });
      try {
        await deleteTest(testId);
        set((state) => ({
          tests: state.tests.filter((t) => t.id !== testId),
          loading: false,
        }));
      } catch (error) {
        set({ error, loading: false });
      }
    },
  }))
);

export default useTestStore;
