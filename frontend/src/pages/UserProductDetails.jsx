import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

export default function UserProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch((err) => setError(getErrorMessage(err, 'Unable to load product.')))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <div className="page-header">
        <h1>Product Details</h1>
        <Link to="/products" className="btn btn-light">Back to Products</Link>
      </div>

      {loading && <LoadingSpinner text="Loading product..." />}
      {error && <div className="alert alert-error">{error}</div>}
      {product && (
        <div className="card profile">
          <dl>
            <dt>Product</dt><dd>{product.name}</dd>
            <dt>Category</dt><dd>{product.category?.name || '-'}</dd>
            <dt>Price</dt><dd>₹{product.price.toLocaleString('en-IN')}</dd>
            <dt>Quantity</dt><dd>{product.quantity}</dd>
            <dt>Availability</dt><dd><StatusBadge status={product.status} /></dd>
            <dt>Description</dt><dd style={{ fontWeight: 400 }}>{product.description || '-'}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
