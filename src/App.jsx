import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import AppLoader from './components/AppLoader';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Discovery from './pages/Discovery';
import CollaborationHub from './pages/CollaborationHub';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';
import Coalitions from './pages/Coalitions';
import CoalitionDetail from './pages/CoalitionDetail';
import Verification from './pages/Verification';
import './App.css';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// App content wrapper that uses AuthContext
const AppContent = () => {
  return (
    <>
      <AppLoader />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/discovery" replace />} />
            <Route path="discovery" element={<Discovery />} />
            <Route path="hub" element={<CollaborationHub />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:username" element={<Profile />} />
            <Route path="coalitions" element={<Coalitions />} />
            <Route path="coalitions/:id" element={<CoalitionDetail />} />
            <Route path="verification" element={<Verification />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
