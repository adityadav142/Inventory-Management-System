import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ConfirmationModal from '../components/ConfirmationModal';
import ProductModal from '../components/ProductModal';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  // Categories for the filter dropdown
  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  // Wait a moment after typing before calling the API
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/products', { params: { search: debouncedSearch, category } });
      setProducts(res.data.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load products.'));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/products/${toDelete._id}`);
      setToDelete(null);
      loadProducts();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete product.'));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const filtering = debouncedSearch.trim() !== '' || category !== '';

  return (
    <div>
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Product</button>
      </div>

      <div className="card toolbar">
        <div className="field">
          <label>Search</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product or supplier" />
        </div>
        <div className="field">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <LoadingSpinner text="Loading products..." />
      ) : products.length > 0 ? (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th><th>Category</th><th>Price</th><th>Quantity</th>
                <th>Status</th><th>Supplier</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category?.name || '-'}</td>
                  <td>₹{p.price.toLocaleString('en-IN')}</td>
                  <td>{p.quantity}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{p.supplier}</td>
                  <td className="actions">
                    <Link to={`/products/edit/${p._id}`} className="btn btn-light btn-sm">Edit</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => setToDelete(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && (
          <div className="card empty">
            {filtering ? (
              <p>No products match your search.</p>
            ) : (
              <>
                <p>No products found.</p>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Add Product</button>
              </>
            )}
          </div>
        )
      )}

      {showAdd && (
        <ProductModal
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); loadProducts(); }}
        />
      )}

      <ConfirmationModal
        show={!!toDelete}
        title="Delete product"
        message={`Are you sure you want to delete "${toDelete?.name}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
