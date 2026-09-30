import { useState, useEffect, useCallback } from 'react';
import api, { getErrorMessage } from '../services/api';
import CategoryForm from '../components/CategoryForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    setError('');
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load categories.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setFormError('');
    try {
      if (editing) await api.put(`/categories/${editing._id}`, data);
      else await api.post('/categories', data);
      setEditing(null);
      setFormKey((k) => k + 1); // resets the form
      await loadCategories();
    } catch (err) {
      setFormError(getErrorMessage(err, 'Failed to save category.'));
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (category) => {
    setFormError('');
    setEditing(category);
  };

  const cancelEdit = () => {
    setFormError('');
    setEditing(null);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await api.delete(`/categories/${toDelete._id}`);
      if (editing?._id === toDelete._id) setEditing(null);
      setToDelete(null);
      await loadCategories();
    } catch (err) {
      // e.g. "This category cannot be deleted because it is currently assigned to one or more products."
      setError(getErrorMessage(err, 'Failed to delete category.'));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header"><h1>Categories</h1></div>

      <CategoryForm
        key={editing?._id || `new-${formKey}`}
        initialData={editing}
        onSubmit={handleSubmit}
        onCancel={cancelEdit}
        submitting={submitting}
        serverError={formError}
      />

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <LoadingSpinner text="Loading categories..." />
      ) : categories.length > 0 ? (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Category</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.description || '-'}</td>
                  <td className="actions">
                    <button className="btn btn-light btn-sm" onClick={() => startEdit(c)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setToDelete(c)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && (
          <div className="card empty">
            <p>No categories found. Use the form above to add a category.</p>
          </div>
        )
      )}

      <ConfirmationModal
        show={!!toDelete}
        title="Delete category"
        message={`Are you sure you want to delete "${toDelete?.name}"?`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
