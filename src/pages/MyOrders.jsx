import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api';
import { ArrowLeft, Package, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) { navigate('/login', { state: { from: '/my-orders' } }); return; }
    if (user) ordersApi.myOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) return (
    <div className="max-w-2xl mx-auto px-6 py-16 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 animate-fadeIn">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 group transition-colors">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />Back
      </button>
      <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
          <Package size={56} strokeWidth={1} />
          <p className="text-lg font-medium">No orders yet</p>
          <Link to="/" className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-olive-700 transition-colors">START SHOPPING</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div>
                  <p className="font-bold text-sm">Order #{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm">LKR {order.total?.toLocaleString()}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                  {expanded === order.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </div>
              {expanded === order.id && (
                <div className="border-t px-5 py-4 bg-gray-50 space-y-3">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image} className="w-14 h-16 object-cover rounded-lg" alt={item.name} />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">Size: {item.selectedSize}</p>
                      </div>
                      <p className="font-bold text-sm">LKR {item.price?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
