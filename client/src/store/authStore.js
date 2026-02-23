import { create } from 'zustand';
import { STORAGE_KEYS } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  login: (userData, token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    set({ user: userData, accessToken: token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  rehydrate: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!token || !raw) return;

    try {
      const user = JSON.parse(raw);
      set({ user, accessToken: token, isAuthenticated: true });
    } catch {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },
}));

export default useAuthStore;
