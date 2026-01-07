import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { discoverAPI } from '../services/discover';
import { metadataAPI } from '../services/metadata';
import { UILanguage } from '../uiLanguage';
import './Discovery.css';

const Discovery = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'projects'
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [archetypes, setArchetypes] = useState([]);
  const [tiers, setTiers] = useState([]);

  // Filters
  const [userFilters, setUserFilters] = useState({
    username: '',
    archetype_id: '',
    tier_id: '',
  });
  const [projectFilters, setProjectFilters] = useState({
    archetype: '',
    region: '',
    coalition: '',
  });

  useEffect(() => {
    loadMetadata();
    loadUsers();
    loadProjects();
  }, []);

  const loadMetadata = async () => {
    try {
      const [archetypesData, tiersData] = await Promise.all([
        metadataAPI.getArchetypes(),
        metadataAPI.getTiers(),
      ]);
      setArchetypes(archetypesData);
      setTiers(tiersData);
    } catch (err) {
      console.error('Failed to load metadata:', err);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (userFilters.username) filters.username = userFilters.username;
      if (userFilters.archetype_id) filters.archetype_id = parseInt(userFilters.archetype_id);
      if (userFilters.tier_id) filters.tier_id = parseInt(userFilters.tier_id);

      // Fetch ALL registered users from backend API (including newly registered users)
      const data = await discoverAPI.discoverUsers(filters);
      
      // Filter to show only real registered users (including new registrations)
      // Exclude only test users and users missing required fields
      const realUsers = data.filter(user => {
        // Must have username and id to display (required for user cards)
        if (!user.username || !user.id) {
          return false;
        }
        // Exclude test users and hardcoded test accounts
        const usernameLower = user.username.toLowerCase();
        // Exclude test users (testuser_ci, testuser_ui, etc.)
        if (usernameLower.includes('testuser')) {
          return false;
        }
        // Exclude specific hardcoded test accounts
        if (usernameLower === 'user1' || usernameLower === 'replace') {
          return false;
        }
        // Include all other registered users - new registrations, existing users, etc.
        return true;
      });
      
      setUsers(realUsers);
    } catch (err) {
      // Show error state instead of silently failing
      setError('Failed to load users. Please try again.');
      console.error('Failed to load users:', err);
      setUsers([]); // Clear users on error
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (projectFilters.archetype) filters.archetype = projectFilters.archetype;
      if (projectFilters.region) filters.region = projectFilters.region;
      if (projectFilters.coalition) filters.coalition = projectFilters.coalition;

      const data = await discoverAPI.discoverProjects(filters);
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserFilterChange = (field, value) => {
    setUserFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleProjectFilterChange = (field, value) => {
    setProjectFilters(prev => ({ ...prev, [field]: value }));
  };

  // Generate avatar initials from username (only field guaranteed from API)
  const getUserInitials = (user) => {
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return '?';
  };

  useEffect(() => {
    loadUsers();
  }, [userFilters]);

  useEffect(() => {
    loadProjects();
  }, [projectFilters]);

  return (
    <div className="discovery">
      <h1>{UILanguage.general.discover}</h1>
      <div className="discovery-tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="discovery-content">
          <div className="filters">
            <input
              type="text"
              placeholder="Search by username"
              value={userFilters.username}
              onChange={(e) => handleUserFilterChange('username', e.target.value)}
            />
            <select
              value={userFilters.archetype_id}
              onChange={(e) => handleUserFilterChange('archetype_id', e.target.value)}
            >
              <option value="">All Archetypes</option>
              {archetypes.map((arch) => (
                <option key={arch.id} value={arch.id}>
                  {arch.name}
                </option>
              ))}
            </select>
            <select
              value={userFilters.tier_id}
              onChange={(e) => handleUserFilterChange('tier_id', e.target.value)}
            >
              <option value="">All Tiers</option>
              {tiers.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading-state">{UILanguage.messages.loading}</div>
          ) : error ? (
            <div className="empty-state" style={{ color: 'var(--text-primary)' }}>
              {error}
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">No users registered yet</div>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <Link 
                  key={user.id} 
                  to={`/profile/${user.username}`} 
                  className="user-card"
                >
                  <div className="user-avatar">
                    <span className="user-avatar-initials">{getUserInitials(user)}</span>
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">
                      {user.username}
                    </h3>
                    {user.archetype && (
                      <p className="user-archetype">{user.archetype}</p>
                    )}
                    {user.tier && (
                      <p className="user-tier" style={{ 
                        margin: '0.25rem 0 0 0', 
                        color: 'var(--text-secondary)', 
                        fontSize: '0.85rem' 
                      }}>
                        {user.tier}
                      </p>
                    )}
                    {user.bio && (
                      <p className="user-bio" style={{ 
                        margin: '0.5rem 0 0 0', 
                        color: 'var(--text-primary)', 
                        fontSize: '0.85rem',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%'
                      }}>
                        {user.bio}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="discovery-content">
          <div className="filters">
            <input
              type="text"
              placeholder="Filter by archetype"
              value={projectFilters.archetype}
              onChange={(e) => handleProjectFilterChange('archetype', e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by region"
              value={projectFilters.region}
              onChange={(e) => handleProjectFilterChange('region', e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by coalition"
              value={projectFilters.coalition}
              onChange={(e) => handleProjectFilterChange('coalition', e.target.value)}
            />
          </div>

          {loading ? (
            <div>{UILanguage.messages.loading}</div>
          ) : (
            <div className="projects-list">
              {projects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.objective}</p>
                  <div className="project-meta">
                    <span>Type: {project.project_type}</span>
                    {project.region && <span>Region: {project.region}</span>}
                    {project.needed_archetypes && (
                      <span>Needs: {project.needed_archetypes.join(', ')}</span>
                    )}
                  </div>
                </Link>
              ))}
              {projects.length === 0 && <p>{UILanguage.emptyStates.noProjectsFound}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Discovery;

