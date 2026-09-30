import { useState } from 'react';
import api, { getErrorMessage } from '../services/api';
import ProductForm from './ProductForm';

// "Add Product" popup shown on the Products page
export default function ProductModal({ onClose, onSaved }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await api.post('/products', data);
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save product.'));
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={submitting ? undefined : onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <h3>Add Product</h3>
        <ProductForm onSubmit={handleSubmit} submitting={submitting} serverError={error} onCancel={onClose} />
      </div>
    </div>
  );
}
