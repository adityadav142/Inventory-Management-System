import StatusBadge from './StatusBadge';

// Read-only product details popup for users
export default function ProductDetailsModal({ product, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <h3>Product Details</h3>
        <div className="profile">
          <dl>
            <dt>Product</dt><dd>{product.name}</dd>
            <dt>Category</dt><dd>{product.category?.name || '-'}</dd>
            <dt>Price</dt><dd>₹{product.price.toLocaleString('en-IN')}</dd>
            <dt>Quantity</dt><dd>{product.quantity}</dd>
            <dt>Availability</dt><dd><StatusBadge status={product.status} /></dd>
            <dt>Description</dt><dd style={{ fontWeight: 400 }}>{product.description || '-'}</dd>
          </dl>
        </div>
        <div className="modal-actions">
          <button className="btn btn-light" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}