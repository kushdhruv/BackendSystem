import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-icon">
            <Shield size={20} />
          </div>
          <span className="brand-text">PrimeIntern</span>
        </Link>

        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <Users size={16} />
              Admin Panel
            </Link>
          )}

          <div className="nav-user">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className={`badge badge-${user.role}`}>{user.role}</span>
            </div>
            <button className="btn btn-ghost" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
