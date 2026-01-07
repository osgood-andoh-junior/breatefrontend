// Auth API - mirrors /api/v1/auth endpoints
import { apiClient } from './api';
import { API_BASE_URL } from '../config';

export const authAPI = {
  // POST /api/v1/users/signup (matches /users/login for token compatibility)
  register: async (email, password, username, archetype_id, tier_id) => {
    return apiClient.post('/users/signup', {
      email,
      password,
      username,
      archetype_id,
      tier_id,
    });
  },

  // POST /api/v1/users/login (uses OAuth2PasswordRequestForm - form-urlencoded)
  // Note: Must use form-urlencoded, not JSON, to match backend OAuth2PasswordRequestForm
  login: async (email, password) => {
    // OAuth2PasswordRequestForm expects form-urlencoded data
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 uses 'username' field for email
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include', // Include cookies (for refresh_token cookie)
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.access_token) {
      apiClient.setToken(data.access_token);
    }
    return data;
  },

  logout: () => {
    apiClient.removeToken();
  },
};

