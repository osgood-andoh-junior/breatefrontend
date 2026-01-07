// Discovery API - mirrors /api/v1/discover endpoints
import { apiClient } from './api';

export const discoverAPI = {
  // GET /api/v1/discover/users
  discoverUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.username) params.append('username', filters.username);
    if (filters.archetype_id) params.append('archetype_id', filters.archetype_id);
    if (filters.tier_id) params.append('tier_id', filters.tier_id);
    
    const queryString = params.toString();
    return apiClient.get(`/discover/users${queryString ? `?${queryString}` : ''}`);
  },

  // GET /api/v1/discover/projects
  discoverProjects: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.archetype) params.append('archetype', filters.archetype);
    if (filters.region) params.append('region', filters.region);
    if (filters.coalition) params.append('coalition', filters.coalition);
    
    const queryString = params.toString();
    return apiClient.get(`/discover/projects${queryString ? `?${queryString}` : ''}`);
  },
};

