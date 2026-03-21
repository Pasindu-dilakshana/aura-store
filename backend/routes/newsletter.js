const express = require('express');
const router = express.Router();
const { load, save, newId } = require('../db/database');
const { adminOnly } = require('../middleware/auth');

router.post('/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' });
  const db = load();
  if (db.newsletter.find(n => n.email === email)) return res.status(409).json({ error: 'Already subscribed' });
  db.newsletter.push({ id: newId(), email, subscribed_at: new Date().toISOString() });
  save(db);
  res.status(201).json({ message: 'Successfully subscribed!' });
});

router.delete('/unsubscribe', (req, res) => {
  const db = load();
  db.newsletter = db.newsletter.filter(n => n.email !== req.body.email);
  save(db);
  res.json({ message: 'Unsubscribed' });
});

router.get('/', adminOnly, (req, res) => {
  const db = load();
  res.json(db.newsletter.sort((a,b) => new Date(b.subscribed_at) - new Date(a.subscribed_at)));
});

module.exports = router;
