import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/auth';
import { usersAPI } from '../services/users';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await usersAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      // Token invalid, clear it
      localStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // authAPI.login already stores token via apiClient.setToken()
      const response = await authAPI.login(email, password);
      if (response.access_token) {
        // Get user data after successful login
        const userData = await usersAPI.getCurrentUser();
        setUser(userData);
        return { success: true };
      }
      throw new Error('No token received');
    } catch (error) {
      // Return detailed error message from backend
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (email, password, archetype_id, tier_id) => {
    try {
      await authAPI.register(email, password, archetype_id, tier_id);
      // After registration, log in
      return await login(email, password);
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

