const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('lima_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, { headers: getHeaders(), ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const auth = {
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  adminLogin: (body) => apiFetch('/auth/admin/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => apiFetch('/auth/me'),
};

export const productsApi = {
  getAll: (params = {}) => { const qs = new URLSearchParams(params).toString(); return apiFetch(`/products${qs ? '?' + qs : ''}`); },
  getOne: (id) => apiFetch(`/products/${id}`),
  create: (body) => apiFetch('/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
};

export const ordersApi = {
  place: (body) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(body) }),
  myOrders: () => apiFetch('/orders/my'),
  getAll: (params = {}) => { const qs = new URLSearchParams(params).toString(); return apiFetch(`/orders${qs ? '?' + qs : ''}`); },
  updateStatus: (id, status) => apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

export const contactApi = {
  send: (body) => apiFetch('/contact', { method: 'POST', body: JSON.stringify(body) }),
  getAll: () => apiFetch('/contact'),
  markRead: (id) => apiFetch(`/contact/${id}/read`, { method: 'PUT' }),
  delete: (id) => apiFetch(`/contact/${id}`, { method: 'DELETE' }),
};

export const newsletterApi = {
  subscribe: (email) => apiFetch('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),
  getAll: () => apiFetch('/newsletter'),
};

export const adminApi = {
  stats: () => apiFetch('/admin/stats'),
  users: () => apiFetch('/admin/users'),
  deleteUser: (id) => apiFetch(`/admin/users/${id}`, { method: 'DELETE' }),
};

export const postsApi = {
  getAll: () => apiFetch('/posts'),
  getOne: (id) => apiFetch(`/posts/${id}`),
  adminAll: () => apiFetch('/posts/admin/all'),
  create: (body) => apiFetch('/posts', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => apiFetch(`/posts/${id}`, { method: 'DELETE' }),
};
