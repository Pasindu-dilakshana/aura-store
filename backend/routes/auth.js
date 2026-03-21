const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { load, save, newId } = require('../db/database');
const { authenticate } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'aura_secret_key';
const sign = (u) => jwt.sign({ id: u.id, email: u.email, name: u.name, role: u.role }, JWT_SECRET, { expiresIn: '7d' });
const safe = (u) => { const { password, ...rest } = u; return rest; };

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const db = load();
  if (db.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already in use' });
  const user = { id: newId(), name, email, password: bcrypt.hashSync(password, 10), role: 'user', created_at: new Date().toISOString() };
  db.users.push(user);
  save(db);
  res.status(201).json({ token: sign(user), user: safe(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const db = load();
  const user = db.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ token: sign(user), user: safe(user) });
});

router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const db = load();
  const user = db.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
  if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });
  res.json({ token: sign(user), user: safe(user) });
});

router.get('/me', authenticate, (req, res) => {
  const db = load();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(safe(user));
});

module.exports = router;
