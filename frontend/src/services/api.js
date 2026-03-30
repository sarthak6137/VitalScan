import axios from 'axios';

// We trim to remove any accidental spaces from environment variables
const rawBaseURL = import.meta.env.VITE_API_URL || 'https://vitalscan-backend-f16z.onrender.com';
const baseURL = `${rawBaseURL.replace(/\/$/, "")}/api`; 

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true // Required for sending cookies/headers across domains
});

export default api;