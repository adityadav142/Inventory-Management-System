import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setServerError('');
    try {
      const res = await api.post('/auth/register', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      // The API returns a token, so the new admin is logged in straight away
      login(res.data.data.token, res.data.data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Unable to reach the server. Please try again.'));
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={handleSubmit} noValidate>
        <h1>Create Account</h1>
        <p className="muted">Create your account</p>
        {serverError && <div className="alert alert-error">{serverError}</div>}

        <div className="field">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} autoFocus />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        <div className="field">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        <div className="field">
          <label>Confirm Password</label>
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
        </div>

        <button className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
        <p className="muted" style={{ textAlign: 'center', margin: '16px 0 0' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Login</Link>
        </p>
      </form>
    </div>
  );
}
