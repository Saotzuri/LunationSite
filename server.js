import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import initSqlJs from 'sql.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

// Database file path - try multiple locations for reliability
const DB_PATHS = [
  process.env.RAILWAY_VOLUME_DIR ? join(process.env.RAILWAY_VOLUME_DIR, 'guild.db') : null,
  '/data/guild.db',
  join(__dirname, 'guild.db')
].filter(Boolean);

let DB_PATH = DB_PATHS[0];
let db;

async function initDatabase() {
  // Find working path
  for (const path of DB_PATHS) {
    try {
      const dir = dirname(path);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path, '');
      fs.unlinkSync(path);
      DB_PATH = path;
      console.log('Using DB path:', path);
      break;
    } catch (e) {
      console.log('Cannot use', path);
    }
  }

  const SQL = await initSqlJs({
    locateFile: file => join(__dirname, 'node_modules', 'sql.js', 'dist', file)
  });

  try {
    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
      console.log('Loaded existing database');
    } else {
      db = new SQL.Database();
      console.log('Created new database');
    }
  } catch (err) {
    console.log('Creating fresh database:', err.message);
    db = new SQL.Database();
  }

  // Create tables if not exist
  db.run(`
    CREATE TABLE IF NOT EXISTS roster (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      spec TEXT,
      notes TEXT,
      group_num INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      priority TEXT DEFAULT 'medium',
      notes TEXT
    )
  `);

  // Check if we have data, if not insert default
  const rosterCount = db.exec('SELECT COUNT(*) as count FROM roster')[0]?.values[0][0] || 0;

  if (rosterCount === 0) {
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

    defaultRoster.forEach(m => {
      db.run('INSERT INTO roster VALUES (?, ?, ?, ?, ?, ?)', [m.id, m.name, m.role, m.spec, m.notes, m.group_num]);
    });

    defaultWishlist.forEach(w => {
      db.run('INSERT INTO wishlist VALUES (?, ?, ?, ?, ?)', [w.id, w.name, w.role, w.priority, w.notes]);
    });

    saveDatabase();
    console.log('Inserted default data');
  }
}

function saveDatabase() {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
    console.log('Database saved to', DB_PATH);
  } catch (err) {
    console.error('Failed to save database:', err);
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
app.get('/api/data', (req, res) => {
  try {
    const rosterResult = db.exec('SELECT * FROM roster');
    const wishlistResult = db.exec('SELECT * FROM wishlist');

    const roster = rosterResult[0]?.values.map(row => ({
      id: row[0],
      name: row[1],
      role: row[2],
      spec: row[3],
      notes: row[4],
      group: row[5]
    })) || [];

    const wishlist = wishlistResult[0]?.values.map(row => ({
      id: row[0],
      name: row[1],
      role: row[2],
      priority: row[3],
      notes: row[4]
    })) || [];

    res.json({ roster, wishlist });
  } catch (err) {
    console.error('Read error:', err);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// PUT data
app.put('/api/data', (req, res) => {
  try {
    const { roster, wishlist } = req.body;

    // Clear and repopulate roster
    db.run('DELETE FROM roster');
    roster.forEach(m => {
      db.run('INSERT INTO roster VALUES (?, ?, ?, ?, ?, ?)', [
        m.id, m.name, m.role, m.spec, m.notes, m.group || 1
      ]);
    });

    // Clear and repopulate wishlist
    db.run('DELETE FROM wishlist');
    wishlist.forEach(w => {
      db.run('INSERT INTO wishlist VALUES (?, ?, ?, ?, ?)', [
        w.id, w.name, w.role, w.priority, w.notes
      ]);
    });

    saveDatabase();
    console.log('Saved data');
    res.json({ success: true });
  } catch (err) {
    console.error('Write error:', err);
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
    console.log(`Database: ${DB_PATH}`);
  });
}).catch(err => {
  console.error('Failed to init database:', err);
  process.exit(1);
});