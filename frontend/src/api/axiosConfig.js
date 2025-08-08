import axios from 'axios';
import { useAuthContext } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('weddingToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/') {
      // Handle unauthorized errors except on home page
      localStorage.removeItem('weddingToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;