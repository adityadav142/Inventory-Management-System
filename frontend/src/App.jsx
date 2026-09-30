import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Categories from './pages/Categories';
import Stock from './pages/Stock';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import UserDashboard from './pages/UserDashboard';
import UserProducts from './pages/UserProducts';
import UserProductDetails from './pages/UserProductDetails';

const Layout = () => (
  <div>
    <Navbar />
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  </div>
);

// Same URL, different page depending on the logged-in role
const RoleRoute = ({ admin, user }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? admin : user;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Admin and User */}
          <Route path="/dashboard" element={<RoleRoute admin={<Dashboard />} user={<UserDashboard />} />} />
          <Route path="/products" element={<RoleRoute admin={<Products />} user={<UserProducts />} />} />
          <Route path="/products/:id" element={<UserProductDetails />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin only */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/stock" element={<Stock />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
