// API Configuration
// Use environment variable in production, fallback to deployed backend for development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://breate-backend.onrender.com/api/v1';

