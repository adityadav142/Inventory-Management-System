import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <span className="brand">Inventory Management</span>
      <div className="navbar-right">
        <span>{user?.name || 'Admin'}</span>
        <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
