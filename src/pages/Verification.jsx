import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collabCircleAPI } from '../services/collabcircle';
import { useAuth } from '../contexts/AuthContext';
import { UILanguage } from '../uiLanguage';
import './Verification.css';

const Verification = () => {
  const { user } = useAuth();
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    collaborator_username: '',
    project_name: '',
  });

  useEffect(() => {
    loadCollaborations();
  }, []);

  const loadCollaborations = async () => {
    setLoading(true);
    try {
      const data = await collabCircleAPI.getMyCollaborations();
      setCollaborations(data);
    } catch (err) {
      console.error('Failed to load collaborations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await collabCircleAPI.createCollaboration(
        formData.collaborator_username,
        formData.project_name || null
      );
      setShowCreateForm(false);
      setFormData({ collaborator_username: '', project_name: '' });
      loadCollaborations();
    } catch (err) {
      alert(UILanguage.messages.error + ': ' + err.message);
    }
  };

  const pendingCollaborations = collaborations.filter(c => c.status === 'pending');
  const confirmedCollaborations = collaborations.filter(c => c.status === 'verified');

  return (
    <div className="verification">
      <div className="verification-header">
        <h1>{UILanguage.vcl.pageTitle}</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? UILanguage.actions.cancel : UILanguage.actions.logCollaboration}
        </button>
      </div>

      <p className="description">
        {UILanguage.vcl.pageDescription}
      </p>

      {showCreateForm && (
        <div className="create-vcl-form">
          <h2>{UILanguage.projectHub.startCollaboration}</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>{UILanguage.forms.collaboratorUsername} *</label>
              <input
                type="text"
                value={formData.collaborator_username}
                onChange={(e) => setFormData({ ...formData, collaborator_username: e.target.value })}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="form-group">
              <label>{UILanguage.forms.contributionSummary}</label>
              <input
                type="text"
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                placeholder="Name of the project you collaborated on"
              />
            </div>
            <button type="submit">{UILanguage.actions.confirmCollaboration}</button>
          </form>
        </div>
      )}

      {loading ? (
        <div>{UILanguage.messages.loading}</div>
      ) : (
        <>
          {/* Pending Collaborations */}
          {pendingCollaborations.length > 0 && (
            <div className="collabs-section">
              <h2>{UILanguage.vcl.pendingTitle}</h2>
              <div className="collabs-list">
                {pendingCollaborations.map((collab) => {
                  const collaboratorUsername =
                    collab.user_a_username === user.username
                      ? collab.user_b_username
                      : collab.user_a_username;

                  return (
                    <div key={collab.id} className="collab-item">
                      <div className="collab-info">
                        <Link to={`/profile/${collaboratorUsername}`}>
                          {collaboratorUsername}
                        </Link>
                        {collab.project_name && (
                          <span className="project-name"> — {collab.project_name}</span>
                        )}
                        <span className={`status-badge status-${collab.status}`}>
                          {collab.status === 'verified' ? UILanguage.status.confirmed : UILanguage.status.pending}
                        </span>
                      </div>
                      <div className="collab-notes">
                        <p>
                          {UILanguage.vcl.waitingMessage}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Confirmed Collaborations */}
          {confirmedCollaborations.length > 0 && (
            <div className="collabs-section">
              <h2>{UILanguage.vcl.confirmedTitle}</h2>
              <div className="collabs-list">
                {confirmedCollaborations.map((collab) => {
                  const collaboratorUsername =
                    collab.user_a_username === user.username
                      ? collab.user_b_username
                      : collab.user_a_username;

                  return (
                    <div key={collab.id} className="collab-item verified">
                      <div className="collab-info">
                        <Link to={`/profile/${collaboratorUsername}`}>
                          {collaboratorUsername}
                        </Link>
                        {collab.project_name && (
                          <span className="project-name"> — {collab.project_name}</span>
                        )}
                        <span className={`status-badge status-${collab.status}`}>
                          {UILanguage.vcl.confirmedLabel}
                        </span>
                      </div>
                      {collab.verified_at && (
                        <div className="collab-date">
                          {UILanguage.vcl.confirmedLabel}: {new Date(collab.verified_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {collaborations.length === 0 && (
            <>
              <p>{UILanguage.emptyStates.noCollaborations}</p>
              <p>{UILanguage.emptyStates.collaborationsReusable}</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Verification;

