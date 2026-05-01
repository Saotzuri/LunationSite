import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

const { Pool } = pg;

// Railway provides DATABASE_URL automatically
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

async function initDatabase() {
  console.log('Initializing database...');
  console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

  try {
    // Test connection
    const test = await pool.query('SELECT 1');
    console.log('Database connection OK');

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roster (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT,
        spec TEXT,
        notes TEXT,
        group_num INTEGER DEFAULT 1
      )
    `);
    console.log('Roster table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT,
        priority TEXT DEFAULT 'medium',
        notes TEXT
      )
    `);
    console.log('Wishlist table ready');

    // Check if we have data
    const result = await pool.query('SELECT COUNT(*) FROM roster');
    const count = parseInt(result.rows[0].count);
    console.log('Current roster count:', count);

    if (count === 0) {
      console.log('Inserting default data...');
      const defaultRoster = [
        { id: "1", name: "Aeliana", role: "healer", spec: "Holy Priest", notes: "RL", group_num: 1 },
        { id: "2", name: "Bloodfang", role: "tank", spec: "Blood DK", notes: "", group_num: 1 },
        { id: "3", name: "Shadowstrike", role: "melee", spec: "Assassination Rogue", notes: "", group_num: 2 },
        { id: "4", name: "Frostbolt", role: "ranged", spec: "Frost Mage", notes: "", group_num: 2 },
        { id: "5", name: "Stormbringer", role: "melee", spec: "Fury Warrior", notes: "", group_num: 3 },
        { id: "6", name: "Lightweaver", role: "healer", spec: "Restoration Druid", notes: "", group_num: 3 },
        { id: "7", name: "Darkpulse", role: "ranged", spec: "Affliction Warlock", notes: "", group_num: 4 },
        { id: "8", name: "Ironclad", role: "tank", spec: "Prot Paladin", notes: "", group_num: 4 }
      ];

      const defaultWishlist = [
        { id: "1", name: "1x Shadow Priest", role: "ranged", priority: "high", notes: "" },
        { id: "2", name: "1x Devastation Evoker", role: "ranged", priority: "medium", notes: "" }
      ];

      for (const m of defaultRoster) {
        await pool.query(
          'INSERT INTO roster (id, name, role, spec, notes, group_num) VALUES ($1, $2, $3, $4, $5, $6)',
          [m.id, m.name, m.role, m.spec, m.notes, m.group_num]
        );
      }

      for (const w of defaultWishlist) {
        await pool.query(
          'INSERT INTO wishlist (id, name, role, priority, notes) VALUES ($1, $2, $3, $4, $5)',
          [w.id, w.name, w.role, w.priority, w.notes]
        );
      }
      console.log('Default data inserted');
    }

    console.log('Database ready');
  } catch (err) {
    console.error('INIT ERROR:', err.stack || err);
    throw err;
  }
}

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// GET data
app.get('/api/data', async (req, res) => {
  console.log('GET /api/data');
  try {
    const rosterResult = await pool.query('SELECT * FROM roster ORDER BY group_num, name');
    const wishlistResult = await pool.query('SELECT * FROM wishlist ORDER BY CASE priority WHEN \'high\' THEN 1 WHEN \'medium\' THEN 2 WHEN \'low\' THEN 3 END');

    const roster = rosterResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      role: row.role,
      spec: row.spec,
      notes: row.notes,
      group: row.group_num
    }));

    const wishlist = wishlistResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      role: row.role,
      priority: row.priority,
      notes: row.notes
    }));

    console.log('Returning roster:', roster.length, 'wishlist:', wishlist.length);
    res.json({ roster, wishlist });
  } catch (err) {
    console.error('GET ERROR:', err.stack || err);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// PUT data
app.put('/api/data', async (req, res) => {
  console.log('PUT /api/data', { roster: req.body.roster?.length, wishlist: req.body.wishlist?.length });
  try {
    const { roster, wishlist } = req.body;

    // Clear and repopulate roster
    await pool.query('DELETE FROM roster');
    for (const m of roster || []) {
      await pool.query(
        'INSERT INTO roster (id, name, role, spec, notes, group_num) VALUES ($1, $2, $3, $4, $5, $6)',
        [m.id, m.name, m.role, m.spec, m.notes, m.group || 1]
      );
    }

    // Clear and repopulate wishlist
    await pool.query('DELETE FROM wishlist');
    for (const w of wishlist || []) {
      await pool.query(
        'INSERT INTO wishlist (id, name, role, priority, notes) VALUES ($1, $2, $3, $4, $5)',
        [w.id, w.name, w.role, w.priority, w.notes]
      );
    }

    console.log('Data saved successfully');
    res.json({ success: true });
  } catch (err) {
    console.error('PUT ERROR:', err.stack || err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Serve static files
app.use(express.static(join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start server
initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});