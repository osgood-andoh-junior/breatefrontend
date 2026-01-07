import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coalitionsAPI } from '../services/coalitions';
import { UILanguage } from '../uiLanguage';
import './CoalitionDetail.css';

const CoalitionDetail = () => {
  const { id } = useParams();
  const [coalition, setCoalition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoalition();
  }, [id]);

  const loadCoalition = async () => {
    try {
      const data = await coalitionsAPI.getCoalition(id);
      setCoalition(data);
    } catch (err) {
      console.error('Failed to load coalition:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>{UILanguage.messages.loading}</div>;
  }

  if (!coalition) {
    return <div>{UILanguage.messages.notFound}</div>;
  }

  return (
    <div className="coalition-detail">
      <h1>{coalition.name}</h1>
      {coalition.description && (
        <div className="coalition-section">
          <h2>Description</h2>
          <p>{coalition.description}</p>
        </div>
      )}

      <div className="coalition-section">
        <h2>Details</h2>
        <div className="detail-grid">
          {coalition.focus && (
            <div>
              <strong>Focus:</strong> {coalition.focus}
            </div>
          )}
          {coalition.location && (
            <div>
              <strong>Location:</strong> {coalition.location}
            </div>
          )}
          <div>
            <strong>Created:</strong>{' '}
            {new Date(coalition.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {coalition.members && coalition.members.length > 0 && (
        <div className="coalition-section">
          <h2>{UILanguage.projectHub.collaborators} ({coalition.members.length})</h2>
          <div className="members-grid">
            {coalition.members.map((member) => (
              <Link
                key={member.id}
                to={`/profile/${member.username}`}
                className="member-card"
              >
                <h3>{member.username}</h3>
                {member.bio && <p>{member.bio}</p>}
                <div className="member-meta">
                  {member.archetype && <span>{member.archetype}</span>}
                  {member.tier && <span>{member.tier}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoalitionDetail;

