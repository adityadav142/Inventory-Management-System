import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import ProductForm from '../components/ProductForm';

export default function AddProduct() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await api.post('/products', data);
      navigate('/products');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save product.'));
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header"><h1>Add Product</h1></div>
      <ProductForm onSubmit={handleSubmit} submitting={submitting} serverError={error} />
    </div>
  );
}
