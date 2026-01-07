import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { profileAPI } from '../services/profile';
import { collabCircleAPI } from '../services/collabcircle';
import { projectsAPI } from '../services/projects';
import { useAuth } from '../contexts/AuthContext';
import { UILanguage } from '../uiLanguage';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [collaborations, setCollaborations] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // If no username in URL, this is the current user's profile
  const isOwnProfile = !username;

  useEffect(() => {
    loadProfile();
    if (isOwnProfile) {
      loadCollaborations();
    }
  }, [username, isOwnProfile]);

  useEffect(() => {
    if (profile?.id) {
      loadUserProjects();
    }
  }, [profile?.id]);

  const loadProfile = async () => {
    try {
      setError(null);
      let data;
      
      if (isOwnProfile) {
        // Use authenticated endpoint for current user
        data = await profileAPI.getMyProfile();
        // Transform data to match profile format
        // Note: /users/me returns different fields than /profile/{username}
        // We'll work with what we get from the API
        data = {
          ...data,
          // Map archetype_id/tier_id to archetype/tier if needed
          // The API might return these as relationships via orm_mode
          archetype: data.archetype?.name || data.archetype_name || null,
          tier: data.tier?.name || data.tier_name || null,
        };
      } else {
        // Use public profile endpoint for other users (username only, never email)
        data = await profileAPI.getProfile(username);
      }
      
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(err.message);
      
      // Handle 401 Unauthorized - redirect to login
      if (err.status === 401 || err.message.includes('401') || err.message.includes('Unauthorized')) {
        logout();
        navigate('/login');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCollaborations = async () => {
    try {
      const data = await collabCircleAPI.getMyCollaborations();
      setCollaborations(data);
    } catch (err) {
      console.error('Failed to load collaborations:', err);
    }
  };

  const loadUserProjects = async () => {
    try {
      const allProjects = await projectsAPI.getProjects();
      // Filter projects by the user's id (poster_id)
      const filtered = allProjects.filter(project => project.poster_id === profile.id);
      // Only show in_progress and completed projects
      const activeProjects = filtered.filter(project => 
        project.status === 'in_progress' || project.status === 'completed'
      );
      setUserProjects(activeProjects);
    } catch (err) {
      console.error('Failed to load user projects:', err);
    }
  };

  if (loading) {
    return <div>{UILanguage.messages.loading}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>{UILanguage.messages.notFound}</div>;
  }

  // Filter confirmed collaborations for timeline
  const confirmedCollaborations = collaborations.filter(c => c.status === 'verified');

  return (
    <div className="profile">
      <div className="profile-header">
        <div>
          <h1>{profile.full_name || profile.username || 'Profile'}</h1>
          {profile.full_name && profile.username && (
            <p className="full-name">{profile.username}</p>
          )}
          {profile.archetype && (
            <span className="badge">{profile.archetype}</span>
          )}
          {profile.tier && (
            <span className="badge">{profile.tier}</span>
          )}
        </div>
      </div>

      {/* About section - Display all user information */}
      {isOwnProfile && (
        <div className="profile-section">
          <h2>{UILanguage.profile.about}</h2>
          <div className="profile-info-grid">
            {profile.email && (
              <div className="info-item">
                <strong>Email:</strong> {profile.email}
              </div>
            )}
            {profile.username && (
              <div className="info-item">
                <strong>Username:</strong> {profile.username}
              </div>
            )}
            {profile.full_name && (
              <div className="info-item">
                <strong>Full Name:</strong> {profile.full_name}
              </div>
            )}
            {profile.archetype && (
              <div className="info-item">
                <strong>Archetype:</strong> {profile.archetype}
              </div>
            )}
            {profile.tier && (
              <div className="info-item">
                <strong>Tier:</strong> {profile.tier}
              </div>
            )}
            {profile.affiliations && (
              <div className="info-item">
                <strong>Affiliations:</strong> {profile.affiliations}
              </div>
            )}
          </div>
        </div>
      )}

      {profile.bio && (
        <div className="profile-section">
          <h2>{UILanguage.profile.howIWork}</h2>
          <p>{profile.bio}</p>
        </div>
      )}

      {profile.preferred_themes && (
        <div className="profile-section">
          <h2>{UILanguage.profile.howIWork}</h2>
          <p>{profile.preferred_themes}</p>
        </div>
      )}

      {profile.portfolio_links && (
        <div className="profile-section">
          <h2>{UILanguage.profile.builtWithOthers}</h2>
          <p>{profile.portfolio_links}</p>
        </div>
      )}

      {profile.next_build && (
        <div className="profile-section">
          <h2>{UILanguage.profile.futureProjectIdeas}</h2>
          <p>{profile.next_build}</p>
        </div>
      )}

      {/* Projects Section */}
      <div className="profile-section">
        <h2>Projects</h2>
        {userProjects.length > 0 ? (
          <div className="profile-projects">
            {userProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="profile-project-card">
                <h3>{project.title}</h3>
                <p>{project.objective}</p>
                <div className="project-meta">
                  <span className={`project-status status-${project.status}`}>
                    {project.status === 'in_progress' ? 'In Progress' : 
                     project.status === 'completed' ? 'Completed' : project.status}
                  </span>
                  {project.project_type && (
                    <span className="project-type">{project.project_type}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-state">No projects yet</p>
        )}
      </div>

      {/* Collab Circle - READ-ONLY */}
      {isOwnProfile && (
        <div className="profile-section">
          <h2>{UILanguage.collabCircle.title}</h2>
          {collaborations.length > 0 ? (
            <div className="collab-circle">
              {collaborations.map((collab) => {
                const collaboratorUsername =
                  collab.user_a_username === currentUser.username
                    ? collab.user_b_username
                    : collab.user_a_username;

                return (
                  <Link
                    key={collab.id}
                    to={`/profile/${collaboratorUsername}`}
                    className="collab-link"
                  >
                    <div className="collab-info">
                      <strong>{collaboratorUsername}</strong>
                      {collab.project_name && (
                        <span className="project-name">{collab.project_name}</span>
                      )}
                      <span className={`collab-status status-${collab.status}`}>
                        {collab.status === 'verified' ? UILanguage.status.confirmed : collab.status === 'pending' ? UILanguage.status.pending : collab.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p>{UILanguage.emptyStates.noCollaborations}</p>
          )}
        </div>
      )}

      {/* Creative Timeline - READ-ONLY, Auto-generated from confirmed collaborations */}
      {isOwnProfile && (
        <div className="profile-section">
          <h2>{UILanguage.general.workBuiltTogether}</h2>
          {confirmedCollaborations.length > 0 ? (
            <div className="timeline">
              {confirmedCollaborations
                .sort((a, b) => new Date(b.verified_at) - new Date(a.verified_at))
                .map((collab) => {
                  const collaboratorUsername =
                    collab.user_a_username === currentUser.username
                      ? collab.user_b_username
                      : collab.user_a_username;

                  return (
                    <div key={collab.id} className="timeline-item">
                      <div className="timeline-date">
                        {new Date(collab.verified_at).toLocaleDateString()}
                      </div>
                      <div className="timeline-content">
                        <Link to={`/profile/${collaboratorUsername}`}>
                          {collaboratorUsername}
                        </Link>
                        {collab.project_name && (
                          <span> — {collab.project_name}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p>{UILanguage.emptyStates.noCollaborations}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;

