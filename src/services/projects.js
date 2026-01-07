// Projects API - mirrors /api/v1/projects endpoints
import { apiClient } from './api';

export const projectsAPI = {
  // GET /api/v1/projects
  getProjects: async () => {
    return apiClient.get('/projects/');
  },

  // POST /api/v1/projects
  createProject: async (projectData) => {
    return apiClient.post('/projects/', projectData);
  },

  // GET /api/v1/projects/{project_id}
  getProject: async (projectId) => {
    return apiClient.get(`/projects/${projectId}`);
  },

  // PATCH /api/v1/projects/{project_id}/status
  updateProjectStatus: async (projectId, status) => {
    return apiClient.patch(`/projects/${projectId}/status`, { status });
  },

  // DELETE /api/v1/projects/{project_id}
  deleteProject: async (projectId) => {
    return apiClient.delete(`/projects/${projectId}`);
  },
};

