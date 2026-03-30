import axios from 'axios';

const api = axios.create({
  // 🔥 Added /api to the end of both URLs to match your backend routes
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : 'https://vitalscan-backend-f16z.onrender.com/api',
});

// Automatically attach the JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;