import axios from 'axios';
import { BACKEND_URL } from './backendUrl';
import { setupApiSecurity, sanitizeInput } from '../security';

// Create axios instance with default config
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup security features
setupApiSecurity(api);

// Request interceptor for input sanitization
api.interceptors.request.use((config) => {
  if (config.data) {
    // Sanitize request data
    config.data = sanitizeInput(config.data);
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden
          console.error('Access forbidden');
          break;
        case 429:
          // Handle rate limiting
          console.error('Too many requests');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 