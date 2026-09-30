import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!email.trim() || !password) return setError('Email and password are required.');
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email: email.trim(), password });
      login(res.data.data.token, res.data.data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to reach the server. Please try again.'));
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={handleSubmit} noValidate>
        <h1>Inventory Management</h1>
        <p className="muted">Sign in to continue</p>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gmail.com" autoFocus />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </button>
        <p className="muted" style={{ textAlign: 'center', margin: '16px 0 0' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>Register</Link>
        </p>
      </form>
    </div>
  );
}
