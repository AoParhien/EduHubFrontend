import { create } from 'zustand';

import { BACKEND_URL } from '../utils/backendUrl';

const getAuthServiceUrl = () => BACKEND_URL;
const getStudentServiceUrl = () => BACKEND_URL;

// The refresh token rotates on every use, so concurrent refreshes must share one request.
let refreshInFlight = null;

const useUserStore = create((set, get) => ({
  user: null,
  authUser: null,
  accessToken: null,
  isLoading: false,
  isBootstrapping: false,
  // True once the initial session check has finished (signed in or not).
  sessionChecked: false,
  error: null,

  setAuth: ({ token, user = null }) => {
    set({
      accessToken: token || null,
      authUser: user,
      error: null,
    });
  },

  refreshSession: () => {
    if (!refreshInFlight) {
      refreshInFlight = get().requestRefresh().finally(() => {
        refreshInFlight = null;
      });
    }
    return refreshInFlight;
  },

  requestRefresh: async () => {
    const authUrl = getAuthServiceUrl();

    if (!authUrl) {
      return null;
    }

    try {
      const response = await fetch(`${authUrl}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        set({ accessToken: null });
        return null;
      }

      const session = await response.json();
      set((current) => ({
        accessToken: session.token || null,
        authUser: session.user || current.authUser,
        error: null,
      }));

      return session;
    } catch (error) {
      set({ accessToken: null });
      return null;
    }
  },

  bootstrapSession: async () => {
    set({ isBootstrapping: true, error: null });

    const session = await get().refreshSession();

    if (!session?.token) {
      set({ isBootstrapping: false, isLoading: false, sessionChecked: true });
      return null;
    }

    await get().fetchUser(session.token, false);
    set({ isBootstrapping: false, sessionChecked: true });

    return session;
  },

  fetchUser: async (tokenOverride, allowRefresh = true) => {
    let authToken = tokenOverride || get().accessToken;

    if (!authToken && allowRefresh) {
      const refreshedSession = await get().refreshSession();
      authToken = refreshedSession?.token || null;
    }

    if (!authToken) {
      set({ user: null, isLoading: false, error: null });
      return null;
    }

    set({ isLoading: true });
    try {
      const apiUrl = getStudentServiceUrl();

      const response = await fetch(`${apiUrl}/api/student/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401 && allowRefresh) {
        const refreshedSession = await get().refreshSession();

        if (refreshedSession?.token) {
          return get().fetchUser(refreshedSession.token, false);
        }
      }

      if (!response.ok) {
        set({ user: null, isLoading: false, error: `Error: ${response.status}` });
        return null;
      }

      const userData = await response.json();
      set({ user: userData, isLoading: false, error: null });
      return userData;
    } catch (error) {
      set({ error: error.message, isLoading: false, user: null });
      return null;
    }
  },

  logout: async () => {
    try {
      await fetch(`${getAuthServiceUrl()}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      // Clearing local state below still signs the user out of this tab.
    }
    get().clearUser();
  },

  clearUser: () => {
    set({
      user: null,
      authUser: null,
      accessToken: null,
      error: null,
      isLoading: false,
      isBootstrapping: false,
      sessionChecked: true,
    });
  },
}));

export default useUserStore;
