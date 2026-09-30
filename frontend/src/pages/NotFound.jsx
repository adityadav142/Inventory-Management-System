import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="login-page">
      <div className="card login-card" style={{ textAlign: 'center' }}>
        <h1>404</h1>
        <p className="muted">The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  );
}
