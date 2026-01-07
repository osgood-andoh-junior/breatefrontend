import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coalitionsAPI } from '../services/coalitions';
import { UILanguage } from '../uiLanguage';
import './Coalitions.css';

const Coalitions = () => {
  const [coalitions, setCoalitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    region: '',
  });

  useEffect(() => {
    loadCoalitions();
  }, [filters]);

  const loadCoalitions = async () => {
    setLoading(true);
    try {
      const data = await coalitionsAPI.getCoalitions(filters);
      setCoalitions(data);
    } catch (err) {
      console.error('Failed to load coalitions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div className="coalitions">
      <h1>Coalitions</h1>
      <p className="description">
        Coalitions are real-world affiliations and communities. Use them for discovery context.
      </p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search coalitions"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by region"
          value={filters.region}
          onChange={(e) => handleFilterChange('region', e.target.value)}
        />
      </div>

      {loading ? (
        <div>{UILanguage.messages.loading}</div>
      ) : (
        <div className="coalitions-grid">
          {coalitions.map((coalition) => (
            <Link
              key={coalition.id}
              to={`/coalitions/${coalition.id}`}
              className="coalition-card"
            >
              <h3>{coalition.name}</h3>
              {coalition.description && <p>{coalition.description}</p>}
              <div className="coalition-meta">
                {coalition.focus && <span>Focus: {coalition.focus}</span>}
                {coalition.location && <span>Location: {coalition.location}</span>}
                <span>{coalition.member_count || 0} members</span>
              </div>
            </Link>
          ))}
          {coalitions.length === 0 && <p>{UILanguage.emptyStates.noCoalitions}</p>}
        </div>
      )}
    </div>
  );
};

export default Coalitions;

