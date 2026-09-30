import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data.data))
      .catch((err) => setError(getErrorMessage(err, 'Unable to load stock.')))
      .finally(() => setLoading(false));
  }, []);

  const changeStock = async (product, delta) => {
    const newQuantity = product.quantity + delta;
    if (newQuantity < 0 || updatingId) return; // never go below zero
    setUpdatingId(product._id);
    setError('');
    try {
      const res = await api.patch(`/products/${product._id}/stock`, { quantity: newQuantity });
      setProducts((list) => list.map((p) => (p._id === product._id ? res.data.data : p)));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update stock.'));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="page-header"><h1>Stock Management</h1></div>
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <LoadingSpinner text="Loading stock..." />
      ) : products.length > 0 ? (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Quantity</th><th>Status</th><th>Adjust Stock</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category?.name || '-'}</td>
                  <td>{p.quantity}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    <div className="stepper">
                      <button className="btn btn-light btn-sm" aria-label={`Decrease ${p.name}`}
                        disabled={p.quantity === 0 || updatingId === p._id}
                        onClick={() => changeStock(p, -1)}>-</button>
                      <span className="stepper-qty">{p.quantity}</span>
                      <button className="btn btn-light btn-sm" aria-label={`Increase ${p.name}`}
                        disabled={updatingId === p._id}
                        onClick={() => changeStock(p, 1)}>+</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && (
          <div className="card empty">
            <p>No products found.</p>
            <Link to="/products/add" className="btn btn-primary">Add Product</Link>
          </div>
        )
      )}
    </div>
  );
}
