import { useState } from 'react';
import api, { getErrorMessage } from '../services/api';

export default function EditProfileModal({ profile, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = 'Enter a valid email address';
    if (form.newPassword || form.confirmPassword) {
      if (form.newPassword.length < 6) errs.newPassword = 'Password must be at least 6 characters';
      if (form.confirmPassword !== form.newPassword) errs.confirmPassword = 'Passwords do not match';
      if (!form.currentPassword) errs.currentPassword = 'Enter your current password to set a new one';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = { name: form.name.trim(), email: form.email.trim() };
    if (form.newPassword) {
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }

    setSubmitting(true);
    setServerError('');
    try {
      const res = await api.put('/users/profile', payload);
      onSaved(res.data.data);
    } catch (err) {
      setServerError(getErrorMessage(err, 'Failed to update profile.'));
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={submitting ? undefined : onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Profile</h3>
        <form onSubmit={handleSubmit} noValidate>
          {serverError && <div className="alert alert-error">{serverError}</div>}

          <div className="field">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <p className="hint">Leave the password fields empty to keep your current password.</p>
          <div className="field">
            <label>Current Password</label>
            <input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} />
            {errors.currentPassword && <span className="field-error">{errors.currentPassword}</span>}
          </div>
          <div className="field">
            <label>New Password</label>
            <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} />
            {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
          </div>
          <div className="field">
            <label>Confirm New Password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-light" onClick={onClose} disabled={submitting}>Cancel</button>
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
