import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import ProductForm from '../components/ProductForm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        const p = res.data.data;
        setProduct({
          name: p.name,
          category: p.category?._id || '',
          price: p.price,
          quantity: p.quantity,
          supplier: p.supplier,
          description: p.description || '',
        });
      })
      .catch((err) => setLoadError(getErrorMessage(err, 'Unable to load product.')))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await api.put(`/products/${id}`, data);
      navigate('/products');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update product.'));
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header"><h1>Edit Product</h1></div>
      {loading && <LoadingSpinner text="Loading product..." />}
      {loadError && <div className="alert alert-error">{loadError}</div>}
      {product && <ProductForm initialData={product} onSubmit={handleSubmit} submitting={submitting} serverError={error} />}
    </div>
  );
}
