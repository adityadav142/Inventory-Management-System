export default function ConfirmationModal({ show, title, message, confirmText = 'Delete', loading, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div className="modal-backdrop" onClick={loading ? undefined : onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-light" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
