import { useState } from 'react';

export default function CategoryForm({ initialData, onSubmit, onCancel, submitting, serverError }) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState('');
  const editing = !!initialData;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!name.trim()) return setError('Category name is required');
    setError('');
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="card form-card" noValidate>
      <h2>{editing ? 'Edit Category' : 'Add Category'}</h2>
      {serverError && <div className="alert alert-error">{serverError}</div>}
      <div className="field">
        <label>Category Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Electronics" />
        {error && <span className="field-error">{error}</span>}
      </div>
      <div className="field">
        <label>Description</label>
        <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional" />
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : editing ? 'Update Category' : 'Add Category'}
        </button>
        {editing && (
          <button type="button" className="btn btn-light" onClick={onCancel} disabled={submitting}>Cancel</button>
        )}
      </div>
    </form>
  );
}
