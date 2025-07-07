import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        userType: null,
        userId: null,
        hydrated: false, // <-- hydration flag

        setAuthData: ({ profile, access, refresh, user_type, user_id }) =>
          set(() => ({
            user: profile,
            accessToken: access,
            refreshToken: refresh,
            userType: user_type,
            userId: user_id,
          })),

        logout: () =>
          set(() => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            userType: null,
            userId: null,
          })),
      }),
      {
        name: "auth-storage",
        onRehydrateStorage: () => (state) => {
          state?.set({ hydrated: true }); // set hydrated to true after rehydration
        },
      }
    )
  )
);

export default useAuthStore;
