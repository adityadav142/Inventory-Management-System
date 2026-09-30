import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(getErrorMessage(err, 'Unable to load dashboard.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <div className="alert alert-error">{error}</div>;

  const cards = [
    ['Total Products', stats.totalProducts, ''],
    ['Total Categories', stats.totalCategories, ''],
    ['Total Stock', stats.totalStock, ''],
    ['Low Stock Products', stats.lowStock, 'amber'],
    ['Out of Stock Products', stats.outOfStock, 'red'],
  ];

  return (
    <div>
      <div className="page-header"><h1>Dashboard</h1></div>
      <div className="stats">
        {cards.map(([label, value, tone]) => (
          <div key={label} className={`card stat ${tone}`}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Recent Products</h2>
        {stats.recentProducts.length === 0 ? (
          <p className="muted">No products added yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Product</th><th>Category</th><th>Quantity</th><th>Status</th></tr>
              </thead>
              <tbody>
                {stats.recentProducts.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.category?.name || '-'}</td>
                    <td>{p.quantity}</td>
                    <td><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
