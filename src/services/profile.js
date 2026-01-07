// Profile API - mirrors /api/v1/profile endpoints
import { apiClient } from './api';
import { usersAPI } from './users';

export const profileAPI = {
  // GET /api/v1/users/me - Get current authenticated user's profile
  getMyProfile: async () => {
    return usersAPI.getCurrentUser();
  },

  // GET /api/v1/profile/{username} - Get public profile by username
  getProfile: async (username) => {
    return apiClient.get(`/profile/${username}`);
  },

  // PUT /api/v1/profile/{username}
  updateProfile: async (username, data) => {
    return apiClient.put(`/profile/${username}`, data);
  },
};

