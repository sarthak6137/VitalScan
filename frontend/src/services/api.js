import axios from 'axios';

const rawBaseURL =
  import.meta.env.VITE_API_URL ||
  'https://vitalscan-backend-f16z.onrender.com';

const baseURL = `${rawBaseURL.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL: baseURL
});

// ✅ Add interceptor to send token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;