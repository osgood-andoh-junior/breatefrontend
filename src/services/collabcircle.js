// Collab Circle API - mirrors /api/v1/collabcircle endpoints
import { apiClient } from './api';

export const collabCircleAPI = {
  // POST /api/v1/collabcircle
  createCollaboration: async (collaboratorUsername, projectName = null) => {
    return apiClient.post('/collabcircle/', {
      collaborator_username: collaboratorUsername,
      project_name: projectName,
    });
  },

  // GET /api/v1/collabcircle/me
  getMyCollaborations: async () => {
    return apiClient.get('/collabcircle/me');
  },
};

