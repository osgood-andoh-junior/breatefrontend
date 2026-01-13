import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { metadataAPI } from '../services/metadata';
import { authAPI } from '../services/auth';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    archetype_id: '',
    tier_id: '',
  });
  const [archetypes, setArchetypes] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load archetypes and tiers for signup form
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
    loadMetadata();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.archetype_id || !formData.tier_id) {
        setError('Please select an archetype and tier');
        setLoading(false);
        return;
      }

      // Register user (username is optional and can be set later in profile)
      await authAPI.register(
        formData.email,
        formData.password,
        parseInt(formData.archetype_id),
        parseInt(formData.tier_id)
      );
      // Auto-login after registration
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/discovery');
      } else {
        setError('Registration successful but login failed. Please log in manually.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>BREATE</h1>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Archetype</label>
            <select
              value={formData.archetype_id}
              onChange={(e) => setFormData({ ...formData, archetype_id: e.target.value })}
              required
            >
              <option value="">Select an archetype</option>
              {archetypes.map((archetype) => (
                <option key={archetype.id} value={archetype.id}>
                  {archetype.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tier</label>
            <select
              value={formData.tier_id}
              onChange={(e) => setFormData({ ...formData, tier_id: e.target.value })}
              required
            >
              <option value="">Select a tier</option>
              {tiers.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.name}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

