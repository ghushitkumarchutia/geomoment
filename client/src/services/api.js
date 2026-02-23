import axios from 'axios';

const STORAGE_KEYS = {
  TOKEN: 'gm_token',
  USER: 'gm_user',
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }

    const message = error.response?.data?.message || error.message || 'Something went wrong';
    const apiError = new Error(message);
    apiError.status = error.response?.status;
    apiError.errors = error.response?.data?.errors || [];
    return Promise.reject(apiError);
  }
);

export { STORAGE_KEYS };
export default api;
