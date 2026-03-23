const express = require('express');
const router = express.Router();
const { load, save, newId } = require('../db/database');
const { adminOnly } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Send new product notification to all registered users
async function notifyUsers(product) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    const db = load();
    const users = db.users.filter(u => u.role === 'user');
    if (!users.length) return;
    const t = nodemailer.createTransport({ host: process.env.EMAIL_HOST || 'smtp.gmail.com', port: 587, secure: false, auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
    for (const user of users) {
      await t.sendMail({
        from: process.env.EMAIL_FROM || `"LIMA Store" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `✨ New arrival at LIMA: ${product.name}`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:auto">
            <h2 style="font-family:Georgia,serif">LIMA<span style="color:#5a6b3d">.</span></h2>
            <h3>Hi ${user.name}, something new just dropped! 🎉</h3>
            <img src="${product.image}" style="width:100%;border-radius:8px;margin:12px 0" />
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p style="font-size:20px;font-weight:bold">LKR ${product.price.toLocaleString()}</p>
            <p>Category: ${product.category} &nbsp;|&nbsp; ${product.type}</p>
            <a href="http://localhost:5173" style="display:inline-block;background:#111;color:#fff;padding:12px 28px;border-radius:30px;text-decoration:none;font-weight:bold;margin-top:12px">SHOP NOW</a>
            <p style="color:#999;font-size:12px;margin-top:24px">You're receiving this because you have an account with LIMA Store.</p>
          </div>`
      });
    }
    console.log(`📧 Notified ${users.length} users about: ${product.name}`);
  } catch(e) { console.warn('Email notify error:', e.message); }
}

router.get('/', (req, res) => {
  const { category, type, new_arrival, weekly_favorite, search } = req.query;
  const db = load();
  let products = db.products.filter(p => p.is_active);
  if (category) products = products.filter(p => p.category === category);
  if (type === 'local') products = products.filter(p => p.type.includes('Local'));
  if (type === 'international') products = products.filter(p => p.type.includes('International'));
  if (new_arrival === '1') products = products.filter(p => p.is_new_arrival || p.category === 'New Arrivals');
  if (weekly_favorite === '1') products = products.filter(p => p.is_weekly_favorite || p.category === 'Weekly Favorites');
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  res.json(products);
});

router.get('/:id', (req, res) => {
  const db = load();
  const product = db.products.find(p => p.id === parseInt(req.params.id) && p.is_active);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.post('/', adminOnly, async (req, res) => {
  const { name, price, category, type, image, sizes, description, stock, is_new_arrival, is_weekly_favorite, notify_users } = req.body;
  if (!name || !price || !category || !type || !image || !sizes) return res.status(400).json({ error: 'Missing required fields' });
  const db = load();
  const maxId = db.products.reduce((max, p) => Math.max(max, p.id), 0);
  const product = {
    id: maxId + 1, name, price: parseInt(price), category, type, image,
    sizes: Array.isArray(sizes) ? sizes : sizes.split(',').map(s => s.trim()),
    description: description || '', stock: stock || 100, is_active: true,
    is_new_arrival: category === 'New Arrivals' || !!is_new_arrival,
    is_weekly_favorite: category === 'Weekly Favorites' || !!is_weekly_favorite,
    created_at: new Date().toISOString()
  };
  db.products.push(product);
  save(db);
  if (notify_users) await notifyUsers(product);
  res.status(201).json(product);
});

router.put('/:id', adminOnly, (req, res) => {
  const db = load();
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const updated = { ...db.products[idx], ...req.body, id: parseInt(req.params.id) };
  if (req.body.sizes && !Array.isArray(req.body.sizes)) updated.sizes = req.body.sizes.split(',').map(s => s.trim());
  db.products[idx] = updated;
  save(db);
  res.json(updated);
});

router.delete('/:id', adminOnly, (req, res) => {
  const db = load();
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  db.products[idx].is_active = false;
  save(db);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
