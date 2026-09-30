import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const emptyForm = { name: '', category: '', price: '', quantity: '', supplier: '', description: '' };

export default function ProductForm({ initialData, onSubmit, submitting, serverError, onCancel }) {
  const [form, setForm] = useState(initialData || emptyForm);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data.data))
      .catch(() => setLoadError('Unable to load categories.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.category) errs.category = 'Please select a category';
    if (form.price === '' || isNaN(Number(form.price))) errs.price = 'Price must be a number';
    else if (Number(form.price) <= 0) errs.price = 'Price must be greater than 0';
    if (form.quantity === '' || isNaN(Number(form.quantity))) errs.quantity = 'Quantity must be a number';
    else if (!Number.isInteger(Number(form.quantity))) errs.quantity = 'Quantity must be a whole number';
    else if (Number(form.quantity) < 0) errs.quantity = 'Quantity cannot be negative';
    if (!form.supplier.trim()) errs.supplier = 'Supplier is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      ...form,
      name: form.name.trim(),
      supplier: form.supplier.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
  };

  if (loading) return <LoadingSpinner text="Loading form..." />;
  if (loadError) return <div className="alert alert-error">{loadError}</div>;
  if (categories.length === 0) {
    return (
      <div className="card empty">
        <p>No categories found. Create a category before adding products.</p>
        <Link to="/categories" className="btn btn-primary">Add Category</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card form-card" noValidate>
      {serverError && <div className="alert alert-error">{serverError}</div>}

      <div className="field">
        <label>Product Name</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Wireless Mouse" />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="field">
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select a category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        {errors.category && <span className="field-error">{errors.category}</span>}
      </div>

      <div className="row">
        <div className="field">
          <label>Price (₹)</label>
          <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>
        <div className="field">
          <label>Quantity</label>
          <input name="quantity" type="number" step="1" min="0" value={form.quantity} onChange={handleChange} />
          {errors.quantity && <span className="field-error">{errors.quantity}</span>}
        </div>
      </div>

      <div className="field">
        <label>Supplier</label>
        <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="ABC Enterprises" />
        {errors.supplier && <span className="field-error">{errors.supplier}</span>}
      </div>

      <div className="field">
        <label>Description</label>
        <textarea name="description" rows="3" value={form.description} onChange={handleChange}
          placeholder="Optional" />
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Product'}
        </button>
        {onCancel ? (
          <button type="button" className="btn btn-light" onClick={onCancel} disabled={submitting}>Cancel</button>
        ) : (
          <Link to="/products" className="btn btn-light">Cancel</Link>
        )}
      </div>
    </form>
  );
}
