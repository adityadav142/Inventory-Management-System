import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  ['/dashboard', 'Dashboard'],
  ['/products', 'Products'],
  ['/categories', 'Categories'],
  ['/stock', 'Stock'],
  ['/profile', 'Profile'],
];

const userLinks = [
  ['/dashboard', 'Dashboard'],
  ['/products', 'Products'],
  ['/profile', 'Profile'],
];

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const links = isAdmin ? adminLinks : userLinks;
  return (
    <nav className="sidebar">
      {links.map(([to, label]) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
