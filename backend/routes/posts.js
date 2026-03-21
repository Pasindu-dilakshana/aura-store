const express = require('express');
const router = express.Router();
const { load, save, newId } = require('../db/database');
const { adminOnly } = require('../middleware/auth');

// Public: get all published posts
router.get('/', (req, res) => {
  const db = load();
  const posts = (db.posts || [])
    .filter(p => p.published)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(posts);
});

// Public: get single post
router.get('/:id', (req, res) => {
  const db = load();
  const post = (db.posts || []).find(p => p.id === req.params.id);
  if (!post || !post.published) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// Admin: get all posts (including drafts)
router.get('/admin/all', adminOnly, (req, res) => {
  const db = load();
  const posts = (db.posts || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(posts);
});

// Admin: create post
router.post('/', adminOnly, (req, res) => {
  const { title, excerpt, content, image, tag, published } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
  const db = load();
  if (!db.posts) db.posts = [];
  const post = {
    id: newId(),
    title,
    excerpt: excerpt || content.slice(0, 120) + '...',
    content,
    image: image || '',
    tag: tag || 'Update',
    published: published !== false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.posts.push(post);
  save(db);
  res.status(201).json(post);
});

// Admin: update post
router.put('/:id', adminOnly, (req, res) => {
  const db = load();
  if (!db.posts) return res.status(404).json({ error: 'Post not found' });
  const idx = db.posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Post not found' });
  db.posts[idx] = { ...db.posts[idx], ...req.body, id: req.params.id, updated_at: new Date().toISOString() };
  save(db);
  res.json(db.posts[idx]);
});

// Admin: delete post
router.delete('/:id', adminOnly, (req, res) => {
  const db = load();
  if (!db.posts) return res.status(404).json({ error: 'Post not found' });
  db.posts = db.posts.filter(p => p.id !== req.params.id);
  save(db);
  res.json({ message: 'Deleted' });
});

module.exports = router;
