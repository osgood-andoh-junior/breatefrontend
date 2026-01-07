import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/projects';
import { useAuth } from '../contexts/AuthContext';
import { UILanguage } from '../uiLanguage';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await projectsAPI.getProject(id);
      setProject(data);
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(UILanguage.messages.confirmDelete)) {
      return;
    }

    try {
      await projectsAPI.deleteProject(id);
      navigate('/hub');
    } catch (err) {
      alert(UILanguage.messages.error + ': ' + err.message);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await projectsAPI.updateProjectStatus(id, newStatus);
      loadProject();
    } catch (err) {
      alert(UILanguage.messages.error + ': ' + err.message);
    }
  };

  if (loading) {
    return <div>{UILanguage.messages.loading}</div>;
  }

  if (error || !project) {
    return <div>{error || UILanguage.messages.notFound}</div>;
  }

  const isOwner = user && project.poster_id === user.id;

  return (
    <div className="project-detail">
      <div className="project-header">
        <h1>{project.title}</h1>
        {isOwner && (
          <div className="project-actions">
            {project.status === 'open' && (
              <button onClick={() => handleStatusUpdate('in_progress')}>
                {UILanguage.actions.startProgress}
              </button>
            )}
            {project.status === 'in_progress' && (
              <button onClick={() => handleStatusUpdate('completed')}>
                {UILanguage.actions.complete}
              </button>
            )}
            {project.status === 'open' && (
              <button onClick={handleDelete} className="delete-btn">
                {UILanguage.actions.delete}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="project-status">
        <span className={`status-badge status-${project.status}`}>
          {project.status === 'open' ? UILanguage.status.open : 
           project.status === 'in_progress' ? UILanguage.status.inProgress : 
           project.status === 'completed' ? UILanguage.status.completed : 
           project.status}
        </span>
      </div>

      <div className="project-content">
        <div className="project-section">
          <h2>Objective</h2>
          <p>{project.objective}</p>
        </div>

        <div className="project-section">
          <h2>Details</h2>
          <div className="detail-grid">
            <div>
              <strong>Project Type:</strong> {project.project_type}
            </div>
            {project.needed_archetypes && (
              <div>
                <strong>Needed Archetypes:</strong>{' '}
                {project.needed_archetypes.join(', ')}
              </div>
            )}
            {project.open_roles && (
              <div>
                <strong>Open Roles:</strong> {project.open_roles}
              </div>
            )}
            {project.timeline && (
              <div>
                <strong>Timeline:</strong> {project.timeline}
              </div>
            )}
            {project.region && (
              <div>
                <strong>Region:</strong> {project.region}
              </div>
            )}
            {project.coalition_tags && project.coalition_tags.length > 0 && (
              <div>
                <strong>Coalition Tags:</strong>{' '}
                {project.coalition_tags.join(', ')}
              </div>
            )}
            <div>
              <strong>Created:</strong>{' '}
              {new Date(project.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Placeholder for group chat - Phase 1 requirement */}
        <div className="project-section">
          <h2>{UILanguage.projectHub.collaborators}</h2>
          <div className="chat-placeholder">
            <p>Group chat functionality will be implemented here.</p>
            <p>This is a placeholder for Phase 1 MVP.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

