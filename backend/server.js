require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/contact',    require('./routes/contact'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/posts',      require('./routes/posts'));

app.get('/api/story', (req, res) => {
  const { load } = require('./db/database');
  res.json(load().story || {});
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Server error' }); });

// Connect DB first, then start server
const { connect } = require('./db/database');
connect().then(() => {
  app.listen(PORT, () => console.log(`\n🚀 AURA Backend running at http://localhost:${PORT}\n`));
}).catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
