const classes = {
  Available: 'badge-green',
  'Low Stock': 'badge-amber',
  'Out of Stock': 'badge-red',
};

// The status text comes from the backend (calculated from quantity)
export default function StatusBadge({ status }) {
  return <span className={`badge ${classes[status] || ''}`}>{status}</span>;
}
