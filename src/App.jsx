import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import CartDrawer from './Components/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import NewArrivals from './pages/NewArrivals';
import WeeklyFavorites from './pages/WeeklyFavorites';
import Stories from './pages/Stories';
import StoryPost from './pages/StoryPost';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" /></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
}

function AppInner() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const addToCart = (product) => { setCart(prev => [...prev, product]); setIsCartOpen(true); };
  const removeFromCart = (index) => setCart(prev => prev.filter((_, i) => i !== index));
  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {!isAdmin && <Navbar cartCount={cart.length} toggleCart={() => setIsCartOpen(true)} />}
      {!isAdmin && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewArrivals />} />
        <Route path="/weekly" element={<WeeklyFavorites />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:id" element={<StoryPost />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppInner />
      </Router>
    </AuthProvider>
  );
}
