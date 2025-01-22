import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null, // Initial state for user data
      isLoading: false, // To track loading state
      error: null, // To track errors

      fetchUser: async () => {
        set({ isLoading: true }); // Set loading to true before the request
        try {
          const response = await fetch('http://localhost:3003/api/student/profile', {
            method: 'GET',
            credentials: 'include',
          });

          if (response.status === 401 || response.status === 404 || response.status === 500) {
            set({ user: null, isLoading: false, error: `Error: ${response.status}` }); // Handle error statuses
          } else {
            const userData = await response.json();
            set({ user: userData, isLoading: false, error: null }); // Update store with user data
          }
        } catch (error) {
          set({ error: error.message, isLoading: false, user: null }); // Handle network errors
        }
      },

      clearUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'user-storage', // Unique name for the storage key
      getStorage: () => localStorage, // Specify localStorage or sessionStorage
    }
  )
);

export default useUserStore;