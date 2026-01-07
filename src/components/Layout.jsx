import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UILanguage } from '../uiLanguage';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="layout">
      <nav className="nav">
        <div className="nav-brand">
          <Link to="/">BREATE</Link>
        </div>
        <div className="nav-links">
          <Link to="/discovery" className={isActive('/discovery') ? 'active' : ''}>
            {UILanguage.general.discover}
          </Link>
          <Link to="/hub" className={isActive('/hub') ? 'active' : ''}>
            {UILanguage.general.hub}
          </Link>
          <Link to="/coalitions" className={isActive('/coalitions') ? 'active' : ''}>
            Coalitions
          </Link>
          <Link to="/verification" className={isActive('/verification') ? 'active' : ''}>
            Collaborations
          </Link>
        </div>
        <div className="nav-user">
          {user && (
            <>
              <Link to="/profile">
                {UILanguage.general.profile}
              </Link>
              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

