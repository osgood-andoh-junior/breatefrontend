// Users API - mirrors /api/v1/users endpoints
import { apiClient } from './api';

export const usersAPI = {
  // POST /api/v1/users/signup
  signup: async (email, password, archetype_id, tier_id) => {
    return apiClient.post('/users/signup', {
      email,
      password,
      archetype_id,
      tier_id,
    });
  },

  // POST /api/v1/users/login
  // Note: This endpoint uses OAuth2PasswordRequestForm which expects form data
  // For simplicity, we use /api/v1/auth/login instead which uses JSON
  login: async (email, password) => {
    // This is handled by authAPI.login instead
    throw new Error('Use authAPI.login instead');
  },

  // GET /api/v1/users/me
  getCurrentUser: async () => {
    return apiClient.get('/users/me');
  },
};

