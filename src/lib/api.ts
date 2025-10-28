import axios from 'axios';

// Get the backend URL from Next.js environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create a re-usable 'api' instance
export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Axios Interceptor: Automatically add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    // Make sure this code runs only on the client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('learnhub_token'); // Get token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Add header
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
      console.error('Unauthorized access - logging out');
      localStorage.removeItem('learnhub_token');
      localStorage.removeItem('learnhub_user');
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;

