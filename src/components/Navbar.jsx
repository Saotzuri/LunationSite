import { Link, useLocation } from 'react-router-dom';
import { isOfficer, logout } from '../utils/auth';

export default function Navbar({ onLoginClick }) {
  const location = useLocation();
  const officer = isOfficer();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">Lunation</Link>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Roster
          </Link>
          <Link
            to="/wishlist"
            className={`nav-link ${location.pathname === '/wishlist' ? 'active' : ''}`}
          >
            Wunsch Roster
          </Link>
          <Link
            to="/recruits"
            className={`nav-link ${location.pathname === '/recruits' ? 'active' : ''}`}
          >
            Rekrutierte
          </Link>
          {officer ? (
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="login-btn" onClick={onLoginClick}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}