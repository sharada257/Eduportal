import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  fetchQuizzes,
  fetchQuiz,
  createQuiz,
  updateQuiz,
  patchQuiz,
  deleteQuiz,
} from "@/api/studentApi"; // Adjust path to your actual quiz API file

const useQuizStore = create(
  devtools((set, get) => ({
    quizzes: [],
    quiz: null,
    loading: false,
    error: null,

    // Fetch all quizzes
    getAllQuizzes: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetchQuizzes();
        set({ quizzes: response.data, loading: false });
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Fetch single quiz by ID
    getQuiz: async (id) => {
      set({ loading: true, error: null });
      try {
        const response = await fetchQuiz(id);
        set({ quiz: response.data, loading: false });
      } catch (error) {
        set({ error, loading: false });
      }
    },

    // Create new quiz
    addQuiz: async (data) => {
      set({ error: null });
      try {
        const response = await createQuiz(data);
        set((state) => ({
          quizzes: [response.data, ...state.quizzes],
        }));
      } catch (error) {
        set({ error });
      }
    },

    // Update quiz
    updateQuiz: async (id, data) => {
      set({ error: null });
      try {
        const response = await updateQuiz(id, data);
        set((state) => ({
          quizzes: state.quizzes.map((q) => (q.id === id ? response.data : q)),
        }));
      } catch (error) {
        set({ error });
      }
    },

    // Patch quiz
    patchQuiz: async (id, data) => {
      set({ error: null });
      try {
        const response = await patchQuiz(id, data);
        set((state) => ({
          quizzes: state.quizzes.map((q) => (q.id === id ? response.data : q)),
        }));
      } catch (error) {
        set({ error });
      }
    },

    // Delete quiz
    deleteQuiz: async (id) => {
      set({ error: null });
      try {
        await deleteQuiz(id);
        set((state) => ({
          quizzes: state.quizzes.filter((q) => q.id !== id),
        }));
      } catch (error) {
        set({ error });
      }
    },
  }))
);

export default useQuizStore;
