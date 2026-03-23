import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsApi, ordersApi, contactApi, newsletterApi, adminApi } from '../api';
import {
  LayoutDashboard, Package, ShoppingBag, MessageSquare, Mail, Users,
  BookOpen, LogOut, X, Plus, Edit2, Trash2, Check, ChevronRight,
  ArrowLeft, Loader, Menu, Eye, PenLine
} from 'lucide-react';
import { postsApi } from '../api';

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
    { to: '/admin/products', label: 'Products', icon: <Package size={18} /> },
    { to: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
    { to: '/admin/posts', label: 'Stories & Posts', icon: <BookOpen size={18} /> },
    { to: '/admin/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
    { to: '/admin/newsletter', label: 'Newsletter', icon: <Mail size={18} /> },
    { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
  ];

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to) && to !== '/admin';

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-50 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <Link to="/" className="text-2xl font-serif font-bold">LIMA<span className="text-green-400">.</span></Link>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-800 rounded"><X size={18} /></button>
        </div>
        <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-widest font-bold mt-2">Admin Panel</div>
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(l.to, l.exact) || (l.exact && location.pathname === '/admin')
                  ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}>
              {l.icon}{l.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <ArrowLeft size={18} />Back to Store
          </Link>
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={18} />Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 lg:pl-64">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"><Menu size={20} /></button>
        <h1 className="font-bold text-lg">{title}</h1>
      </div>
      <main className="p-6">{children}</main>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
        <span className={`text-2xl opacity-20`}>{icon}</span>
      </div>
      <div className={`text-3xl font-bold ${color || ''}`}>{value}</div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.stats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><div className="flex justify-center py-20"><Loader className="animate-spin" size={32} /></div></AdminLayout>;

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Products" value={stats?.totalProducts || 0} icon="👕" />
        <StatCard label="Orders" value={stats?.totalOrders || 0} icon="📦" />
        <StatCard label="Revenue" value={`LKR ${(stats?.totalRevenue || 0).toLocaleString()}`} icon="💰" />
        <StatCard label="Customers" value={stats?.totalUsers || 0} icon="👥" />
        <StatCard label="Pending Orders" value={stats?.pendingOrders || 0} icon="⏳" color="text-yellow-600" />
        <StatCard label="Unread Messages" value={stats?.unreadMessages || 0} icon="💬" color="text-red-600" />
        <StatCard label="Subscribers" value={stats?.totalSubscribers || 0} icon="📧" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-bold">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm text-olive-600 font-medium flex items-center gap-1">View all <ChevronRight size={14} /></Link>
          </div>
          <table className="w-full">
            <tbody>
              {(stats?.recentOrders || []).map(o => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3"><div className="font-semibold text-sm">{o.customer_name}</div><div className="text-xs text-gray-400">{o.customer_email}</div></td>
                  <td className="px-5 py-3 text-sm font-semibold">LKR {o.total?.toLocaleString()}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'}`}>{o.status}</span></td>
                </tr>
              ))}
              {!stats?.recentOrders?.length && <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-400 text-sm">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-bold">Recent Messages</h3>
            <Link to="/admin/messages" className="text-sm text-olive-600 font-medium flex items-center gap-1">View all <ChevronRight size={14} /></Link>
          </div>
          <table className="w-full">
            <tbody>
              {(stats?.recentMessages || []).map(m => (
                <tr key={m.id} className={`border-b last:border-0 hover:bg-gray-50 ${!m.is_read ? 'bg-yellow-50' : ''}`}>
                  <td className="px-5 py-3"><div className="font-semibold text-sm">{m.name}</div><div className="text-xs text-gray-400">{m.email}</div></td>
                  <td className="px-5 py-3 text-sm text-gray-600 max-w-[180px] truncate">{m.subject}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${m.is_read ? 'bg-gray-100 text-gray-500' : 'bg-yellow-100 text-yellow-700'}`}>{m.is_read ? 'Read' : 'New'}</span></td>
                </tr>
              ))}
              {!stats?.recentMessages?.length && <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-400 text-sm">No messages yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const CATEGORIES = ['Men', 'Women', 'New Arrivals', 'Weekly Favorites'];
const TYPES = ['Local Brand 🇱🇰', 'International 🌍'];
const EMPTY_PRODUCT = { name: '', price: '', category: 'Men', type: 'Local Brand 🇱🇰', image: '', sizes: '', description: '', stock: 100, is_new_arrival: false, is_weekly_favorite: false, is_active: true, notify_users: false };

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState('');
  const [search, setSearch] = useState('');

  const load = () => { setLoading(true); productsApi.getAll().then(setProducts).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openAdd = () => { setForm(EMPTY_PRODUCT); setEditProduct(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes, notify_users: false });
    setEditProduct(p);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditProduct(null); setAlert(''); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image || !form.sizes) { setAlert('Please fill all required fields'); return; }
    setSaving(true); setAlert('');
    try {
      if (editProduct) await productsApi.update(editProduct.id, { ...form, price: parseInt(form.price) });
      else await productsApi.create({ ...form, price: parseInt(form.price) });
      closeModal(); load();
    } catch(e) { setAlert(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await productsApi.delete(id); load();
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Products">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black w-full sm:w-64" />
        <button onClick={openAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-olive-700 transition-colors whitespace-nowrap">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Product</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Category</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Price</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={5} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              )) : filtered.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3 flex items-center gap-3">
                    <img src={p.image} className="w-10 h-12 object-cover rounded" alt={p.name} onError={e => e.target.style.display='none'} />
                    <div><div className="font-semibold text-sm">{p.name}</div><div className="text-xs text-gray-400">{p.type}</div></div>
                  </td>
                  <td className="px-5 py-3 text-sm">{p.category}</td>
                  <td className="px-5 py-3 text-sm font-semibold">LKR {p.price?.toLocaleString()}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.is_active ? 'Active' : 'Hidden'}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-black transition-colors"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !filtered.length && <tr><td colSpan={5} className="py-12 text-center text-gray-400">No products found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {alert && <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-2 text-sm">{alert}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-bold mb-1">Product Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" placeholder="e.g. Oversized Heavy Tee" /></div>
                <div><label className="block text-sm font-bold mb-1">Price (LKR) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" placeholder="3500" /></div>
                <div><label className="block text-sm font-bold mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" /></div>
                <div><label className="block text-sm font-bold mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select></div>
                <div><label className="block text-sm font-bold mb-1">Type *</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black">
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select></div>
                <div className="col-span-2"><label className="block text-sm font-bold mb-1">Image URL *</label>
                  <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" placeholder="https://images.unsplash.com/..." /></div>
                <div className="col-span-2"><label className="block text-sm font-bold mb-1">Sizes (comma separated) *</label>
                  <input value={form.sizes} onChange={e => setForm({...form, sizes: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" placeholder="S, M, L, XL  or  30, 32, 34" /></div>
                <div className="col-span-2"><label className="block text-sm font-bold mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black resize-none" /></div>
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                {[['is_active','Active (visible in store)'],['is_new_arrival','New Arrival'],['is_weekly_favorite','Weekly Favorite']].map(([k,l]) => (
                  <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={!!form[k]} onChange={e => setForm({...form, [k]: e.target.checked})} className="w-4 h-4 rounded" />{l}
                  </label>
                ))}
              </div>
              {!editProduct && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-blue-800">
                    <input type="checkbox" checked={!!form.notify_users} onChange={e => setForm({...form, notify_users: e.target.checked})} className="w-4 h-4 rounded" />
                    📧 Email all registered customers about this new product
                  </label>
                  <p className="text-xs text-blue-500 mt-1 ml-6">Requires email to be configured in backend .env</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-black text-white py-2.5 rounded-lg font-bold text-sm hover:bg-olive-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving && <Loader size={15} className="animate-spin" />}{saving ? 'Saving...' : editProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { ordersApi.getAll().then(setOrders).finally(() => setLoading(false)); }, []);

  const handleStatus = async (id, status) => {
    await ordersApi.updateStatus(id, status);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;
  const statusColor = s => ({ pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' }[s] || 'bg-gray-100 text-gray-600');

  return (
    <AdminLayout title="Orders">
      <div className="flex flex-wrap gap-2 mb-6">
        {['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === s ? 'bg-black text-white' : 'bg-white border border-gray-300 hover:border-black'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl border border-gray-200 animate-pulse" />) :
        filtered.map(o => (
          <div key={o.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-bold text-sm">{o.customer_name}</div>
                  <div className="text-xs text-gray-400">{o.customer_email} {o.customer_phone && `· ${o.customer_phone}`}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{new Date(o.created_at).toLocaleDateString('en-LK', { day:'numeric', month:'short', year:'numeric' })}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-sm">LKR {o.total?.toLocaleString()}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor(o.status)}`}>{o.status}</span>
                <select value={o.status} onChange={e => handleStatus(o.id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-medium focus:outline-none focus:border-black">
                  {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
                <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="text-xs text-gray-500 hover:text-black flex items-center gap-1">
                  <Eye size={14} />{expanded === o.id ? 'Hide' : 'Items'}
                </button>
              </div>
            </div>
            {expanded === o.id && (
              <div className="border-t px-5 py-3 bg-gray-50 flex flex-wrap gap-3">
                {(o.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border text-sm">
                    <img src={item.image} className="w-8 h-10 object-cover rounded" alt={item.name} />
                    <span>{item.name}</span><span className="text-gray-400">({item.selectedSize})</span>
                    <span className="font-semibold">LKR {item.price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {!loading && !filtered.length && <div className="text-center py-16 text-gray-400">No orders found</div>}
      </div>
    </AdminLayout>
  );
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { contactApi.getAll().then(setMessages).finally(() => setLoading(false)); }, []);

  const markRead = async (id) => {
    await contactApi.markRead(id);
    setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
  };
  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return;
    await contactApi.delete(id);
    setMessages(messages.filter(m => m.id !== id));
  };

  return (
    <AdminLayout title="Messages">
      <div className="space-y-3">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl border animate-pulse" />) :
        messages.map(m => (
          <div key={m.id} className={`bg-white rounded-xl border overflow-hidden ${!m.is_read ? 'border-yellow-300 bg-yellow-50/30' : 'border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4">
              <div className="flex-1 cursor-pointer" onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm ${!m.is_read ? 'font-bold' : ''}`}>{m.name}</span>
                  {!m.is_read && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-bold">New</span>}
                </div>
                <div className="text-xs text-gray-400">{m.email} · {new Date(m.created_at).toLocaleDateString()}</div>
                <div className={`text-sm mt-1 ${!m.is_read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{m.subject}</div>
              </div>
              <div className="flex items-center gap-2">
                {!m.is_read && <button onClick={() => markRead(m.id)} className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium hover:bg-green-200 transition-colors"><Check size={13} />Mark Read</button>}
                <a href={`mailto:${m.email}`} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Reply</a>
                <button onClick={() => deleteMsg(m.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
            {expanded === m.id && (
              <div className="border-t px-5 py-4 bg-white">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{m.message}</p>
              </div>
            )}
          </div>
        ))}
        {!loading && !messages.length && <div className="text-center py-16 text-gray-400">No messages yet</div>}
      </div>
    </AdminLayout>
  );
}

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────
function Newsletter() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { newsletterApi.getAll().then(setSubs).finally(() => setLoading(false)); }, []);
  return (
    <AdminLayout title="Newsletter Subscribers">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b"><span className="font-bold">{subs.length} subscribers</span></div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">#</th>
            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
            <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Subscribed</th>
          </tr></thead>
          <tbody>
            {loading ? [...Array(4)].map((_, i) => <tr key={i}><td colSpan={3} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>) :
            subs.map((s, i) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-5 py-3 text-sm text-gray-400">{i + 1}</td>
                <td className="px-5 py-3 text-sm font-medium"><a href={`mailto:${s.email}`} className="text-olive-600 hover:underline">{s.email}</a></td>
                <td className="px-5 py-3 text-sm text-gray-400">{new Date(s.subscribed_at).toLocaleDateString('en-LK', { day:'numeric', month:'long', year:'numeric' })}</td>
              </tr>
            ))}
            {!loading && !subs.length && <tr><td colSpan={3} className="py-12 text-center text-gray-400">No subscribers yet</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

// ─── USERS ────────────────────────────────────────────────────────────────────
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.users().then(setUsers).finally(() => setLoading(false)); }, []);
  const deleteUser = async (id, name) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    await adminApi.deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  };
  return (
    <AdminLayout title="Users">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b"><span className="font-bold">{users.length} users</span></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Name</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Role</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Joined</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? [...Array(4)].map((_, i) => <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>) :
              users.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-sm">{u.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span></td>
                  <td className="px-5 py-3 text-sm text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3">{u.role !== 'admin' && <button onClick={() => deleteUser(u.id, u.name)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>}</td>
                </tr>
              ))}
              {!loading && !users.length && <tr><td colSpan={5} className="py-12 text-center text-gray-400">No users</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

// ─── STORIES (multi) ──────────────────────────────────────────────────────────
const EMPTY_STORY = { title: '', content: '', date: new Date().toISOString().slice(0,10), pinned: false };

function Story() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStory, setEditStory] = useState(null);
  const [form, setForm] = useState(EMPTY_STORY);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState('');

  const loadStories = () => { setLoading(true); adminApi.getStories().then(setStories).finally(() => setLoading(false)); };
  useEffect(loadStories, []);

  const openAdd = () => { setForm({ ...EMPTY_STORY, date: new Date().toISOString().slice(0,10) }); setEditStory(null); setShowModal(true); };
  const openEdit = (s) => { setForm({ ...s, date: s.date?.slice(0,10) || new Date().toISOString().slice(0,10) }); setEditStory(s); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditStory(null); setAlert(''); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) { setAlert('Title and content are required'); return; }
    setSaving(true); setAlert('');
    try {
      const payload = { ...form, date: new Date(form.date).toISOString() };
      if (editStory) await adminApi.updateStory(editStory.id, payload);
      else await adminApi.createStory(payload);
      closeModal(); loadStories();
    } catch(e) { setAlert(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await adminApi.deleteStory(id); loadStories();
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <AdminLayout title="Our Story">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">These entries appear on your <strong>About / Our Story</strong> page as a timeline.</p>
        <button onClick={openAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-olive-700 transition-colors">
          <Plus size={16} /> Add Story
        </button>
      </div>

      <div className="space-y-4">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white rounded-xl border animate-pulse" />) :
        stories.map(s => (
          <div key={s.id} className={`bg-white rounded-xl border overflow-hidden ${s.pinned ? 'border-olive-300' : 'border-gray-200'}`}>
            <div className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {s.pinned && <span className="text-xs bg-olive-100 text-olive-700 font-bold px-2 py-0.5 rounded-full">📌 Featured</span>}
                  <h3 className="font-bold text-base">{s.title}</h3>
                </div>
                <p className="text-xs text-gray-400 mb-2">{formatDate(s.date)}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{s.content}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-black transition-colors"><Edit2 size={15} /></button>
                <button onClick={() => handleDelete(s.id, s.title)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
        {!loading && !stories.length && <div className="text-center py-16 text-gray-400">No stories yet — click "Add Story" to create your first one!</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg">{editStory ? 'Edit Story' : 'Add New Story'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {alert && <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-2 text-sm">{alert}</div>}
              <div>
                <label className="block text-sm font-bold mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                  placeholder="e.g. How LIMA Started" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Story Content *</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={8}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                  placeholder="Write what happened this day, behind the scenes, milestones..." />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!form.pinned} onChange={e => setForm({...form, pinned: e.target.checked})} className="w-4 h-4" />
                📌 Pin as featured story (shown at the top of the page)
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-black text-white py-2.5 rounded-lg font-bold text-sm hover:bg-olive-700 flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <><Loader size={15} className="animate-spin" />Saving...</> : editStory ? 'Save Changes' : 'Add Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ─── POSTS MANAGER ───────────────────────────────────────────────────────────
const TAGS = ['Update', 'Sale', 'Announcement', 'New Drop', 'Behind the Scenes', 'Event'];
const EMPTY_POST = { title: '', excerpt: '', content: '', image: '', tag: 'Update', published: true };

function PostsManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [form, setForm] = useState(EMPTY_POST);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState('');

  const loadPosts = () => { setLoading(true); postsApi.adminAll().then(setPosts).finally(() => setLoading(false)); };
  useEffect(loadPosts, []);

  const openAdd = () => { setForm(EMPTY_POST); setEditPost(null); setAlert(''); setShowModal(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditPost(p); setAlert(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditPost(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) { setAlert('Title and content are required'); return; }
    setSaving(true); setAlert('');
    try {
      if (editPost) await postsApi.update(editPost.id, form);
      else await postsApi.create(form);
      closeModal(); loadPosts();
    } catch(e) { setAlert(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await postsApi.delete(id); loadPosts();
  };

  const togglePublish = async (post) => {
    await postsApi.update(post.id, { published: !post.published });
    loadPosts();
  };

  const TAG_COLOR = { Sale:'bg-red-100 text-red-600', Announcement:'bg-blue-100 text-blue-600', 'Behind the Scenes':'bg-purple-100 text-purple-600', 'New Drop':'bg-olive-100 text-olive-700', Update:'bg-gray-100 text-gray-600', Event:'bg-yellow-100 text-yellow-700' };

  return (
    <AdminLayout title="Stories & Posts">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{posts.length} total posts</p>
        <button onClick={openAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-olive-700 transition-colors">
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="space-y-3">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border animate-pulse" />) :
        posts.map(post => (
          <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            {post.image && <img src={post.image} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" alt="" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TAG_COLOR[post.tag] || 'bg-gray-100 text-gray-600'}`}>{post.tag}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{post.published ? 'Published' : 'Draft'}</span>
              </div>
              <p className="font-bold text-sm truncate">{post.title}</p>
              <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('en-LK', { day:'numeric', month:'long', year:'numeric' })}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => togglePublish(post)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${post.published ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                {post.published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => openEdit(post)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-black transition-colors"><Edit2 size={15} /></button>
              <button onClick={() => handleDelete(post.id, post.title)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {!loading && !posts.length && (
          <div className="text-center py-16 text-gray-400 bg-white rounded-xl border">
            <PenLine size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No posts yet</p>
            <p className="text-sm mt-1">Create your first story, sale announcement, or update!</p>
            <button onClick={openAdd} className="mt-4 bg-black text-white px-6 py-2 rounded-lg text-sm font-bold">Write First Post</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg">{editPost ? 'Edit Post' : 'New Story / Post'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {alert && <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-2 text-sm">{alert}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Title *</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                    placeholder="e.g. 50% Off Weekend Sale! or New Arrivals Just Dropped" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Category / Tag</label>
                  <select value={form.tag} onChange={e => setForm({...form, tag: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black">
                    {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Cover Image URL</label>
                  <input value={form.image} onChange={e => setForm({...form, image: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                    placeholder="https://images.unsplash.com/..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Short Excerpt <span className="text-gray-400 font-normal">(shown on cards)</span></label>
                  <input value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                    placeholder="One or two sentences summarising the post..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Full Content *</label>
                  <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={10}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                    placeholder="Write the full post here. Use blank lines for paragraphs. Share daily updates, sales, behind the scenes moments, new arrivals..." />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!form.published} onChange={e => setForm({...form, published: e.target.checked})} className="w-4 h-4 rounded" />
                Publish immediately (visible on store)
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-black text-white py-2.5 rounded-lg font-bold text-sm hover:bg-olive-700 flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving && <Loader size={15} className="animate-spin" />}{saving ? 'Saving...' : editPost ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="orders" element={<Orders />} />
      <Route path="posts" element={<PostsManager />} />
      <Route path="messages" element={<Messages />} />
      <Route path="newsletter" element={<Newsletter />} />
      <Route path="users" element={<AdminUsers />} />
    </Routes>
  );
}
