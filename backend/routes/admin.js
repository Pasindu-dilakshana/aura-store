const express = require('express');
const router = express.Router();
const { load, save, newId } = require('../db/database');
const { adminOnly } = require('../middleware/auth');

router.get('/stats', adminOnly, (req, res) => {
  const db = load();
  const orders = db.orders;
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s,o) => s + o.total, 0);
  const statusCounts = {};
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  res.json({
    totalProducts: db.products.filter(p => p.is_active).length,
    totalOrders: orders.length, totalRevenue,
    totalUsers: db.users.filter(u => u.role === 'user').length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    unreadMessages: db.contacts.filter(c => !c.is_read).length,
    totalSubscribers: db.newsletter.length,
    recentOrders: [...orders].sort((a,b) => new Date(b.created_at)-new Date(a.created_at)).slice(0,5),
    recentMessages: [...db.contacts].sort((a,b) => new Date(b.created_at)-new Date(a.created_at)).slice(0,5),
    ordersByStatus: Object.entries(statusCounts).map(([status,count]) => ({ status, count }))
  });
});

router.get('/users', adminOnly, (req, res) => {
  const db = load();
  res.json(db.users.map(({ password, ...u }) => u).sort((a,b) => new Date(b.created_at)-new Date(a.created_at)));
});

router.delete('/users/:id', adminOnly, (req, res) => {
  const db = load();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin' });
  db.users = db.users.filter(u => u.id !== req.params.id);
  save(db);
  res.json({ message: 'User deleted' });
});

// ── STORIES (multiple) ───────────────────────────────────────────────────────
router.get('/stories', adminOnly, (req, res) => {
  const db = load();
  res.json([...db.stories].sort((a,b) => new Date(b.date)-new Date(a.date)));
});

router.post('/stories', adminOnly, (req, res) => {
  const { title, content, date, pinned } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
  const db = load();
  const story = { id: newId(), title, content, date: date || new Date().toISOString(), pinned: !!pinned };
  db.stories.push(story);
  save(db);
  res.status(201).json(story);
});

router.put('/stories/:id', adminOnly, (req, res) => {
  const db = load();
  const idx = db.stories.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Story not found' });
  db.stories[idx] = { ...db.stories[idx], ...req.body, id: req.params.id };
  save(db);
  res.json(db.stories[idx]);
});

router.delete('/stories/:id', adminOnly, (req, res) => {
  const db = load();
  db.stories = db.stories.filter(s => s.id !== req.params.id);
  save(db);
  res.json({ message: 'Deleted' });
});

module.exports = router;
