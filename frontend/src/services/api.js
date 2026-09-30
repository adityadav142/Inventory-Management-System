import axios from 'axios';

// Base URL comes from VITE_API_URL (see .env)
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is missing/expired, clear the session and go to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCall = err.config?.url?.includes('/auth/');
    if (err.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const getErrorMessage = (err, fallback) => err.response?.data?.message || fallback;

export default api;
