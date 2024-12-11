import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null, // Initial state for user data
  isLoading: false, // To track loading state
  error: null, // To track errors
  fetchUser: async (userId) => {
    set({ isLoading: true }); // Set loading to true before the request
    try {
      const response = await fetch('http://localhost:3003/api/student/profile', {
        method: 'GET',
        credentials: 'include',
    });
      const userData = await response.json();
      set({ user: userData, isLoading: false, error: null }); // Update store with user data
    } catch (error) {
      set({ error: error.message, isLoading: false }); // Handle errors
    }
  },
  clearUser: () => set({ user: null }), // Clear user data on logout
}));

export default useUserStore;