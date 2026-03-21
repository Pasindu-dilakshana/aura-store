const express = require('express');
const router = express.Router();
const { load, save, newId } = require('../db/database');
const { authenticate, adminOnly, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, (req, res) => {
  const { customer_name, customer_email, customer_phone, items, total, notes } = req.body;
  if (!customer_name || !customer_email || !items || !total) return res.status(400).json({ error: 'Missing required fields' });
  const db = load();
  const order = { id: newId(), user_id: req.user?.id || null, customer_name, customer_email, customer_phone: customer_phone || null, items, total, status: 'pending', notes: notes || null, created_at: new Date().toISOString() };
  db.orders.push(order);
  save(db);
  res.status(201).json(order);
});

router.get('/my', authenticate, (req, res) => {
  const db = load();
  const orders = db.orders.filter(o => o.user_id === req.user.id).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(orders);
});

router.get('/', adminOnly, (req, res) => {
  const { status } = req.query;
  const db = load();
  let orders = db.orders.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  if (status) orders = orders.filter(o => o.status === status);
  res.json(orders);
});

router.put('/:id/status', adminOnly, (req, res) => {
  const { status } = req.body;
  const valid = ['pending','confirmed','processing','shipped','delivered','cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const db = load();
  const idx = db.orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  db.orders[idx].status = status;
  save(db);
  res.json(db.orders[idx]);
});

module.exports = router;
