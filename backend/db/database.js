const bcrypt = require('bcryptjs');

// ─── In-memory cache ──────────────────────────────────────────────────────────
// load() is sync (reads cache), save() updates cache + async-flushes to MongoDB.
// Zero route changes needed.

let cache = null;
let collection = null;

// ─── Connect to MongoDB Atlas ─────────────────────────────────────────────────
async function connect() {
  if (process.env.MONGODB_URI) {
    try {
      const { MongoClient } = require('mongodb');
      const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
      await client.connect();
      const db = client.db('aura');
      collection = db.collection('store');
      const stored = await collection.findOne({ _id: 'data' });
      if (stored) {
        const { _id, ...data } = stored;
        cache = data;
        console.log('✅ Connected to MongoDB Atlas');
      } else {
        console.log('✅ Connected to MongoDB Atlas (fresh database)');
        cache = emptyDb();
      }
    } catch (e) {
      console.warn('⚠️  MongoDB connection failed, using local JSON fallback:', e.message);
      loadFromFile();
    }
  } else {
    console.log('ℹ️  No MONGODB_URI set, using local JSON file');
    loadFromFile();
  }
  await seedAdmin();
  await seedProducts();
}

// ─── Local JSON fallback (for local dev without MongoDB) ─────────────────────
const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, 'aura.json');

function loadFromFile() {
  if (fs.existsSync(DB_FILE)) {
    cache = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } else {
    cache = emptyDb();
  }
}

function emptyDb() {
  return { users: [], products: [], orders: [], contacts: [], newsletter: [], posts: [], story: { title: 'Our Story', content: 'The journey, the people, and the moments that shaped AURA.' } };
}

// ─── Public API (sync - same interface as before) ─────────────────────────────
function load() {
  if (!cache) throw new Error('Database not initialized. Call connect() first.');
  return cache;
}

function save(data) {
  cache = data;
  // Async flush - fire and forget (routes don't need to await this)
  if (collection) {
    collection.replaceOne({ _id: 'data' }, { _id: 'data', ...data }, { upsert: true })
      .catch(e => console.error('DB save error:', e.message));
  } else {
    // Write to local JSON file as fallback
    try { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); } catch(e) {}
  }
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─── Seed Admin ───────────────────────────────────────────────────────────────
async function seedAdmin() {
  const data = load();
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@aura.store';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
  if (!data.users.find(u => u.email === adminEmail)) {
    data.users.push({
      id: newId(), name: 'Admin', email: adminEmail,
      password: bcrypt.hashSync(adminPassword, 10),
      role: 'admin', created_at: new Date().toISOString()
    });
    save(data);
    console.log('✅ Admin user created: ' + adminEmail);
  }
}

// ─── Seed Products ────────────────────────────────────────────────────────────
async function seedProducts() {
  const data = load();
  if (data.products && data.products.length > 0) return;
  const now = new Date().toISOString();
  data.products = [
    { id: 1,  name: "Oversized Heavy Tee",       price: 3500,  category: "Men",              type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800", sizes: ["M","L","XL"],         description: "Premium 240gsm cotton. Boxy fit.",       stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: false, created_at: now },
    { id: 2,  name: "Vintage Wash Denim",         price: 8500,  category: "Men",              type: "International 🌍", image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=800", sizes: ["30","32","34"],       description: "Japanese denim inspired wash.",           stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: false, created_at: now },
    { id: 3,  name: "Oxford Linen Shirt",         price: 4500,  category: "Men",              type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800", sizes: ["M","L","XL"],         description: "Breathable linen for the heat.",         stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: false, created_at: now },
    { id: 4,  name: "Cargo Utility Pants",        price: 5800,  category: "Men",              type: "International 🌍", image: "https://images.unsplash.com/photo-1517445312882-b0031cf3ed69?q=80&w=800", sizes: ["30","32","34"],       description: "Functional pockets, tapered fit.",       stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: false, created_at: now },
    { id: 5,  name: "Streetwear Hoodie",          price: 6200,  category: "Men",              type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800", sizes: ["M","L","XL"],         description: "Fleece lined, minimalist design.",       stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: false, created_at: now },
    { id: 6,  name: "Floral Summer Dress",        price: 5200,  category: "Women",            type: "International 🌍", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800", sizes: ["S","M","L"],          description: "Flowy rayon fabric.",                    stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: false, created_at: now },
    { id: 7,  name: "High-Waist Linen Pant",      price: 4800,  category: "Women",            type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800", sizes: ["S","M"],              description: "Tailored fit, earthy tones.",            stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: false, created_at: now },
    { id: 8,  name: "Silk Evening Top",           price: 3900,  category: "Women",            type: "International 🌍", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800", sizes: ["S","M"],              description: "Satin finish, elegant drape.",           stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: false, created_at: now },
    { id: 9,  name: "Oversized Blazer",           price: 7500,  category: "Women",            type: "International 🌍", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800", sizes: ["S","M"],              description: "Korean style structured blazer.",        stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: false, created_at: now },
    { id: 10, name: "Ribbed Knit Tank",           price: 2500,  category: "Women",            type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800", sizes: ["S","M","L"],          description: "Essential basic, stretch cotton.",       stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: false, created_at: now },
    { id: 11, name: "Minimalist White Polo",      price: 2900,  category: "New Arrivals",     type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1566306981335-07b8c9c23c1d?q=80&w=800", sizes: ["M","L","XL"],         description: "Classic polo in premium cotton.",        stock: 100, is_active: true, is_new_arrival: true,  is_weekly_favorite: false, created_at: now },
    { id: 12, name: "Black Skinny Jeans",         price: 4200,  category: "New Arrivals",     type: "International 🌍", image: "https://images.unsplash.com/photo-1542272604-787c62d465d1?q=80&w=800", sizes: ["30","32","34"],       description: "Slim fit with stretch fabric.",          stock: 100, is_active: true, is_new_arrival: true,  is_weekly_favorite: false, created_at: now },
    { id: 13, name: "Linen Summer Shirt",         price: 3800,  category: "New Arrivals",     type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1608003291330-94e65c55ccd6?q=80&w=800", sizes: ["M","L","XL"],         description: "Perfect for hot weather styling.",       stock: 100, is_active: true, is_new_arrival: true,  is_weekly_favorite: false, created_at: now },
    { id: 14, name: "Classic White T-Shirt",      price: 1500,  category: "New Arrivals",     type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800", sizes: ["M","L","XL"],         description: "Essential wardrobe staple.",             stock: 100, is_active: true, is_new_arrival: true,  is_weekly_favorite: false, created_at: now },
    { id: 15, name: "Leather Jacket",             price: 12000, category: "New Arrivals",     type: "International 🌍", image: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?q=80&w=800", sizes: ["M","L"],              description: "Premium leather statement piece.",       stock: 100, is_active: true, is_new_arrival: true,  is_weekly_favorite: false, created_at: now },
    { id: 16, name: "Velvet Crop Top",            price: 2800,  category: "New Arrivals",     type: "International 🌍", image: "https://images.unsplash.com/photo-1517886029597-eb635a78a6c2?q=80&w=800", sizes: ["S","M","L"],          description: "Luxe velvet texture.",                   stock: 100, is_active: true, is_new_arrival: true,  is_weekly_favorite: false, created_at: now },
    { id: 17, name: "Wide Leg Trousers",          price: 5500,  category: "New Arrivals",     type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1595777707802-e176fc7e05d0?q=80&w=800", sizes: ["S","M"],              description: "Chic and comfortable fit.",              stock: 100, is_active: true, is_new_arrival: true,  is_weekly_favorite: false, created_at: now },
    { id: 18, name: "Satin Slip Dress",           price: 4600,  category: "New Arrivals",     type: "International 🌍", image: "https://images.unsplash.com/photo-1541099810657-40987b2f5447?q=80&w=800", sizes: ["S","M","L"],          description: "Elegant evening wear.",                  stock: 100, is_active: true, is_new_arrival: true,  is_weekly_favorite: false, created_at: now },
    { id: 19, name: "Knit Cardigan",              price: 3200,  category: "New Arrivals",     type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1551471421-37ccc3b16d48?q=80&w=800", sizes: ["S","M","L"],          description: "Cozy layering piece.",                   stock: 100, is_active: true, is_new_arrival: true,  is_weekly_favorite: false, created_at: now },
    { id: 20, name: "Midi Skirt",                 price: 2400,  category: "New Arrivals",     type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1551633631-f7d93b1b1d5d?q=80&w=800", sizes: ["S","M"],              description: "Versatile everyday style.",              stock: 100, is_active: true, is_new_arrival: true,  is_weekly_favorite: false, created_at: now },
    { id: 21, name: "Premium Cotton Sweatshirt",  price: 4900,  category: "Weekly Favorites", type: "International 🌍", image: "https://images.unsplash.com/photo-1556821552-5ff8b71db4d9?q=80&w=800", sizes: ["M","L","XL"],         description: "Soft and comfortable everyday wear.",    stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: true,  created_at: now },
    { id: 22, name: "Slim Fit Chinos",            price: 4200,  category: "Weekly Favorites", type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1473621038790-b3ecca2f55cb?q=80&w=800", sizes: ["30","32","34"],       description: "Versatile neutral tone.",                stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: true,  created_at: now },
    { id: 23, name: "Tech Performance Tee",       price: 2200,  category: "Weekly Favorites", type: "International 🌍", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800", sizes: ["M","L","XL"],         description: "Moisture-wicking technology.",           stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: true,  created_at: now },
    { id: 24, name: "Denim Jacket",               price: 6500,  category: "Weekly Favorites", type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?q=80&w=800", sizes: ["M","L"],              description: "Classic timeless piece.",                stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: true,  created_at: now },
    { id: 25, name: "Canvas Sneaker Collection",  price: 3500,  category: "Weekly Favorites", type: "International 🌍", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800", sizes: ["6","7","8","9","10"], description: "Comfortable daily wear.",                stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: true,  created_at: now },
    { id: 26, name: "Pastel Sweatshirt",          price: 3600,  category: "Weekly Favorites", type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1556821552-5ff8b71db4d9?q=80&w=800", sizes: ["S","M","L"],          description: "Soft fleece lining.",                    stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: true,  created_at: now },
    { id: 27, name: "Skinny Fit Jeans",           price: 4500,  category: "Weekly Favorites", type: "International 🌍", image: "https://images.unsplash.com/photo-1541099810657-40987b2f5447?q=80&w=800", sizes: ["S","M"],              description: "Classic denim with stretch.",            stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: true,  created_at: now },
    { id: 28, name: "Graphic T-Shirt",            price: 1800,  category: "Weekly Favorites", type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1506629082632-cc4caf5fcda1?q=80&w=800", sizes: ["S","M","L"],          description: "Trendy design statement.",               stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: true,  created_at: now },
    { id: 29, name: "Wool Coat",                  price: 8900,  category: "Weekly Favorites", type: "International 🌍", image: "https://images.unsplash.com/photo-1539533057440-7814bae1ef51?q=80&w=800", sizes: ["S","M"],              description: "Warm winter essential.",                 stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: true,  created_at: now },
    { id: 30, name: "Lounge Pants",               price: 2900,  category: "Weekly Favorites", type: "Local Brand 🇱🇰",  image: "https://images.unsplash.com/photo-1506629082632-cc4caf5fcda1?q=80&w=800", sizes: ["S","M","L"],          description: "Comfortable casual style.",              stock: 100, is_active: true, is_new_arrival: false, is_weekly_favorite: true,  created_at: now }
  ];
  if (!data.story || !data.story.title) {
    data.story = { title: 'Our Story', content: 'It all began in a small room in Colombo. Two friends passionate about fashion decided Sri Lanka deserved a clothing brand that truly reflected its culture while keeping up with global trends. AURA was born.' };
  }
  save(data);
  console.log('✅ Seeded 30 products');
}

module.exports = { connect, load, save, newId };
