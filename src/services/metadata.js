// Metadata API - archetypes and tiers
import { apiClient } from './api';

export const metadataAPI = {
  // GET /api/v1/archetypes
  getArchetypes: async () => {
    return apiClient.get('/archetypes/');
  },

  // GET /api/v1/tiers
  getTiers: async () => {
    return apiClient.get('/tiers/');
  },
};

