// Users API - mirrors /api/v1/users endpoints
import { apiClient } from './api';

export const usersAPI = {
  // GET /api/v1/users/me
  getCurrentUser: async () => {
    return apiClient.get('/users/me');
  },
};

