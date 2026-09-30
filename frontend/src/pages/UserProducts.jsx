import { useState, useEffect, useCallback } from 'react';
import api, { getErrorMessage } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ProductDetailsModal from '../components/ProductDetailsModal';

// View-only product list for normal users
export default function UserProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

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

  const filtering = debouncedSearch.trim() !== '' || category !== '';

  return (
    <div>
      <div className="page-header"><h1>Products</h1></div>

      <div className="card toolbar">
        <div className="field">
          <label>Search</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by product name" />
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
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Quantity</th><th>Availability</th><th>Details</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category?.name || '-'}</td>
                  <td>₹{p.price.toLocaleString('en-IN')}</td>
                  <td>{p.quantity}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><button className="btn btn-light btn-sm" onClick={() => setSelected(p)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && (
          <div className="card empty">
            <p>{filtering ? 'No products match your search.' : 'No products are available yet.'}</p>
          </div>
        )
      )}

      {selected && <ProductDetailsModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}