import { useState, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import * as authService from '../services/authService';

export default function useAuth() {
  const { user, isAuthenticated, login: storeLogin, logout: storeLogout } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authService.login(email, password);
        storeLogin(res.data.user, res.data.accessToken);
        return res.data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [storeLogin]
  );

  const register = useCallback(
    async (name, email, password) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authService.register(name, email, password);
        storeLogin(res.data.user, res.data.accessToken);
        return res.data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [storeLogin]
  );

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  const clearError = useCallback(() => setError(null), []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}
