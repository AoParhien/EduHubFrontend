import { RateLimiterMemory } from 'rate-limiter-flexible';
import DOMPurify from 'dompurify';

// Rate limiter configuration
export const rateLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per minute
});

// Content Security Policy configuration
export const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
};

// XSS Protection - Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input);
  }
  return input;
};

// Security headers configuration
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

// API request interceptor for rate limiting
export const setupApiSecurity = (axiosInstance) => {
  axiosInstance.interceptors.request.use(async (config) => {
    try {
      await rateLimiter.consume('api', 1);
      return config;
    } catch (error) {
      return Promise.reject(new Error('Too many requests. Please try again later.'));
    }
  });
};

// Input validation helper
export const validateInput = (input, type) => {
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
  };

  if (patterns[type]) {
    return patterns[type].test(input);
  }
  return true;
}; 