import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// adminOnly: normal users are sent back to the dashboard
export default function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
