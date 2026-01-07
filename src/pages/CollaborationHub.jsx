import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/projects';
import { useAuth } from '../contexts/AuthContext';
import { UILanguage } from '../uiLanguage';
import './CollaborationHub.css';

const CollaborationHub = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    objective: '',
    project_type: '',
    needed_archetypes: '',
    open_roles: '',
    timeline: '',
    region: '',
    coalition_tags: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsAPI.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        needed_archetypes: formData.needed_archetypes.split(',').map(s => s.trim()),
        coalition_tags: formData.coalition_tags ? formData.coalition_tags.split(',').map(s => s.trim()) : [],
      };
      await projectsAPI.createProject(projectData);
      setShowCreateForm(false);
      setFormData({
        title: '',
        objective: '',
        project_type: '',
        needed_archetypes: '',
        open_roles: '',
        timeline: '',
        region: '',
        coalition_tags: '',
      });
      loadProjects();
    } catch (err) {
      alert(UILanguage.messages.error + ': ' + err.message);
    }
  };

  return (
    <div className="collab-hub">
      <div className="hub-header">
        <h1>Collaboration Hub</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? UILanguage.actions.cancel : UILanguage.projectHub.startCollaboration}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-project-form">
          <h2>{UILanguage.projectHub.startCollaboration}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{UILanguage.forms.title} *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{UILanguage.forms.objective} *</label>
              <textarea
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{UILanguage.forms.projectType} *</label>
              <input
                type="text"
                value={formData.project_type}
                onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                placeholder="e.g., Web App, Game, Art Project"
                required
              />
            </div>
            <div className="form-group">
              <label>{UILanguage.forms.neededArchetypes} * (comma-separated)</label>
              <input
                type="text"
                value={formData.needed_archetypes}
                onChange={(e) => setFormData({ ...formData, needed_archetypes: e.target.value })}
                placeholder="e.g., Developer, Designer, Writer"
                required
              />
            </div>
            <div className="form-group">
              <label>{UILanguage.forms.openRoles}</label>
              <input
                type="text"
                value={formData.open_roles}
                onChange={(e) => setFormData({ ...formData, open_roles: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{UILanguage.forms.timeline}</label>
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                placeholder="e.g., 3 months"
              />
            </div>
            <div className="form-group">
              <label>{UILanguage.forms.region}</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{UILanguage.forms.coalitionTags} (comma-separated)</label>
              <input
                type="text"
                value={formData.coalition_tags}
                onChange={(e) => setFormData({ ...formData, coalition_tags: e.target.value })}
              />
            </div>
            <button type="submit">{UILanguage.projectHub.startCollaboration}</button>
          </form>
        </div>
      )}

      <div className="projects-section">
        <h2>Active Collaborations</h2>
          {loading ? (
            <div>{UILanguage.messages.loading}</div>
          ) : (
          <div className="projects-list">
            {projects
              .filter((p) => p.status === 'open')
              .map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.objective}</p>
                  <div className="project-meta">
                    <span>Type: {project.project_type}</span>
                    {project.region && <span>Region: {project.region}</span>}
                    {project.needed_archetypes && (
                      <span>Needs: {project.needed_archetypes.join(', ')}</span>
                    )}
                    <span className="status">
                      {project.status === 'open' ? UILanguage.status.open : 
                       project.status === 'in_progress' ? UILanguage.status.inProgress : 
                       project.status === 'completed' ? UILanguage.status.completed : 
                       project.status}
                    </span>
                  </div>
                </Link>
              ))}
            {projects.filter((p) => p.status === 'open').length === 0 && (
              <p>{UILanguage.projectHub.emptyState}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationHub;

