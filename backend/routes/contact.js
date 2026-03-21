const express = require('express');
const router = express.Router();
const { load, save, newId } = require('../db/database');
const { adminOnly } = require('../middleware/auth');

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) return res.status(400).json({ error: 'All fields required' });
  const db = load();
  db.contacts.push({ id: newId(), name, email, subject, message, is_read: false, created_at: new Date().toISOString() });
  save(db);
  res.status(201).json({ message: "Message received! We'll be in touch soon." });
});

router.get('/', adminOnly, (req, res) => {
  const db = load();
  res.json(db.contacts.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
});

router.put('/:id/read', adminOnly, (req, res) => {
  const db = load();
  const c = db.contacts.find(c => c.id === req.params.id);
  if (c) { c.is_read = true; save(db); }
  res.json({ message: 'Marked as read' });
});

router.delete('/:id', adminOnly, (req, res) => {
  const db = load();
  db.contacts = db.contacts.filter(c => c.id !== req.params.id);
  save(db);
  res.json({ message: 'Deleted' });
});

module.exports = router;
