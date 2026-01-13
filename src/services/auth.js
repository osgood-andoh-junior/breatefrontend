// Auth API - handles authentication endpoints
import { apiClient } from './api';
import { API_BASE_URL } from '../config';

export const authAPI = {
  // POST /api/v1/users/signup
  // Backend expects: email, password, archetype_id, tier_id (username is optional and not in signup schema)
  register: async (email, password, archetype_id, tier_id) => {
    return apiClient.post('/users/signup', {
      email,
      password,
      archetype_id,
      tier_id,
    });
  },

  // POST /api/v1/users/login
  // Uses OAuth2PasswordRequestForm which expects form-urlencoded data
  login: async (email, password) => {
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

