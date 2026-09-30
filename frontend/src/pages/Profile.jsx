import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EditProfileModal from '../components/EditProfileModal';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/users/profile')
      .then((res) => setProfile(res.data.data))
      .catch((err) => setError(getErrorMessage(err, 'Unable to load profile.')))
      .finally(() => setLoading(false));
  }, []);

  const handleSaved = (updated) => {
    setProfile(updated);
    updateUser({ ...user, name: updated.name, email: updated.email }); // refresh the navbar name
    setShowEdit(false);
    setSuccess('Profile updated successfully.');
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;
  if (error) return <div className="alert alert-error">{error}</div>;

  const isAdmin = profile.role === 'admin';

  return (
    <div>
      <div className="page-header">
        <h1>{isAdmin ? 'Administrator Profile' : 'User Profile'}</h1>
        <button className="btn btn-primary" onClick={() => { setSuccess(''); setShowEdit(true); }}>
          Edit Profile
        </button>
      </div>
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card profile">
        <dl>
          <dt>Name</dt><dd>{profile.name}</dd>
          <dt>Email</dt><dd>{profile.email}</dd>
          <dt>Role</dt><dd>{isAdmin ? 'Administrator' : 'User'}</dd>
        </dl>
      </div>

      {showEdit && (
        <EditProfileModal profile={profile} onClose={() => setShowEdit(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}
