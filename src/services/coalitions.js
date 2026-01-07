// Coalitions API - mirrors /api/v1/coalitions endpoints
import { apiClient } from './api';

export const coalitionsAPI = {
  // GET /api/v1/coalitions
  getCoalitions: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.region) params.append('region', filters.region);
    
    const queryString = params.toString();
    return apiClient.get(`/coalitions${queryString ? `?${queryString}` : ''}`);
  },

  // GET /api/v1/coalitions/{coalition_id}
  getCoalition: async (coalitionId) => {
    return apiClient.get(`/coalitions/${coalitionId}`);
  },
};

