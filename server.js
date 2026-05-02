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
        group_num INTEGER DEFAULT 1,
        position INTEGER DEFAULT 0
      )
    `);
    console.log('Roster table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id TEXT PRIMARY KEY,
        name TEXT,
        role TEXT,
        spec TEXT,
        priority TEXT DEFAULT 'medium',
        notes TEXT,
        group_num INTEGER DEFAULT 1,
        position INTEGER DEFAULT 0
      )
    `);
    console.log('Wishlist table ready');

    // Lightweight schema migrations for older deployments
    await pool.query('ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS spec TEXT');
    await pool.query('ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS group_num INTEGER DEFAULT 1');
    await pool.query('ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0');
    await pool.query('ALTER TABLE roster ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0');
    await pool.query('ALTER TABLE wishlist ALTER COLUMN name DROP NOT NULL');
    await pool.query('ALTER TABLE roster ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()');
    await pool.query('ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()');

    // Initialize updated_at for existing rows that don't have it
    await pool.query('UPDATE roster SET updated_at = NOW() WHERE updated_at IS NULL');
    await pool.query('UPDATE wishlist SET updated_at = NOW() WHERE updated_at IS NULL');

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
        { id: "1", name: "1x Shadow Priest", role: "ranged", spec: "Shadow Priest", priority: "high", notes: "", group_num: 1 },
        { id: "2", name: "1x Devastation Evoker", role: "ranged", spec: "Devastation Evoker", priority: "medium", notes: "", group_num: 1 }
      ];

      for (const m of defaultRoster) {
        await pool.query(
          'INSERT INTO roster (id, name, role, spec, notes, group_num) VALUES ($1, $2, $3, $4, $5, $6)',
          [m.id, m.name, m.role, m.spec, m.notes, m.group_num]
        );
      }

      for (const w of defaultWishlist) {
        await pool.query(
          'INSERT INTO wishlist (id, name, role, spec, priority, notes, group_num) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [w.id, w.name, w.role, w.spec, w.priority, w.notes, w.group_num]
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
    const rosterResult = await pool.query('SELECT * FROM roster ORDER BY group_num, position, name');
    const wishlistResult = await pool.query('SELECT * FROM wishlist ORDER BY group_num, position, CASE priority WHEN \'high\' THEN 1 WHEN \'medium\' THEN 2 WHEN \'low\' THEN 3 END');

    const roster = rosterResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      role: row.role,
      spec: row.spec,
      notes: row.notes,
      group: row.group_num,
      position: row.position || 0
    }));

    const wishlist = wishlistResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      role: row.role,
      spec: row.spec,
      priority: row.priority,
      notes: row.notes,
      group: row.group_num,
      position: row.position || 0
    }));

    // Get the latest modification timestamp
    const rosterMax = await pool.query('SELECT MAX(updated_at) as max_ts FROM roster');
    const wishlistMax = await pool.query('SELECT MAX(updated_at) as max_ts FROM wishlist');
    const rosterTs = rosterMax.rows[0]?.max_ts?.getTime() || 0;
    const wishlistTs = wishlistMax.rows[0]?.max_ts?.getTime() || 0;
    const lastModified = Math.max(rosterTs, wishlistTs) || Date.now();

    console.log('Returning roster:', roster.length, 'wishlist:', wishlist.length, 'lastModified:', lastModified);
    res.json({ roster, wishlist, lastModified });
  } catch (err) {
    console.error('GET ERROR:', err.stack || err);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// PUT data
app.put('/api/data', async (req, res) => {
  console.log('PUT /api/data', { roster: req.body.roster?.length, wishlist: req.body.wishlist?.length, knownVersion: req.body.knownVersion });
  const client = await pool.connect();
  try {
    const { roster, wishlist, knownVersion } = req.body;
    const hasRoster = Array.isArray(roster);
    const hasWishlist = Array.isArray(wishlist);
    const allowEmpty = req.query.allowEmpty === 'true';

    if (!hasRoster && !hasWishlist) {
      return res.status(400).json({ error: 'Payload must include roster and/or wishlist arrays' });
    }

    if (hasRoster && hasWishlist && roster.length === 0 && wishlist.length === 0 && !allowEmpty) {
      return res.status(400).json({ error: 'Refusing to overwrite with empty roster and wishlist' });
    }

    // Check for conflicts if client sent a known version
    if (knownVersion) {
      const rosterMax = await client.query('SELECT MAX(updated_at) as max_ts FROM roster');
      const wishlistMax = await client.query('SELECT MAX(updated_at) as max_ts FROM wishlist');
      const rosterTs = rosterMax.rows[0]?.max_ts?.getTime() || 0;
      const wishlistTs = wishlistMax.rows[0]?.max_ts?.getTime() || 0;
      const serverVersion = Math.max(rosterTs, wishlistTs);

      if (serverVersion > knownVersion) {
        console.log('Conflict detected! Server version:', serverVersion, 'Client version:', knownVersion);

        // Fetch current data to return to client
        const rosterResult = await client.query('SELECT * FROM roster ORDER BY group_num, position, name');
        const wishlistResult = await client.query('SELECT * FROM wishlist ORDER BY group_num, position, CASE priority WHEN \'high\' THEN 1 WHEN \'medium\' THEN 2 WHEN \'low\' THEN 3 END');

        const currentRoster = rosterResult.rows.map(row => ({
          id: row.id,
          name: row.name,
          role: row.role,
          spec: row.spec,
          notes: row.notes,
          group: row.group_num,
          position: row.position || 0
        }));

        const currentWishlist = wishlistResult.rows.map(row => ({
          id: row.id,
          name: row.name,
          role: row.role,
          spec: row.spec,
          priority: row.priority,
          notes: row.notes,
          group: row.group_num,
          position: row.position || 0
        }));

        return res.json({
          conflict: true,
          currentRoster,
          currentWishlist,
          lastModified: serverVersion
        });
      }
    }

    await client.query('BEGIN');

    if (hasRoster) {
      for (const m of roster) {
        await client.query(
          `INSERT INTO roster (id, name, role, spec, notes, group_num, position, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             role = EXCLUDED.role,
             spec = EXCLUDED.spec,
             notes = EXCLUDED.notes,
             group_num = EXCLUDED.group_num,
             position = EXCLUDED.position,
             updated_at = NOW()`,
          [m.id, m.name, m.role, m.spec, m.notes, m.group || 1, m.position || 0]
        );
      }

      const rosterIds = roster.map(m => m.id);
      if (rosterIds.length > 0) {
        await client.query('DELETE FROM roster WHERE id <> ALL($1::text[])', [rosterIds]);
      } else if (allowEmpty) {
        await client.query('DELETE FROM roster');
      }
    }

    if (hasWishlist) {
      for (const w of wishlist) {
        await client.query(
          `INSERT INTO wishlist (id, name, role, spec, priority, notes, group_num, position, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             role = EXCLUDED.role,
             spec = EXCLUDED.spec,
             priority = EXCLUDED.priority,
             notes = EXCLUDED.notes,
             group_num = EXCLUDED.group_num,
             position = EXCLUDED.position,
             updated_at = NOW()`,
          [w.id, w.name || null, w.role, w.spec || null, w.priority, w.notes || null, w.group || 1, w.position || 0]
        );
      }

      const wishlistIds = wishlist.map(w => w.id);
      if (wishlistIds.length > 0) {
        await client.query('DELETE FROM wishlist WHERE id <> ALL($1::text[])', [wishlistIds]);
      } else if (allowEmpty) {
        await client.query('DELETE FROM wishlist');
      }
    }

    await client.query('COMMIT');
    console.log('Data saved successfully');

    // Get the new lastModified timestamp
    const rosterMax = await pool.query('SELECT MAX(updated_at) as max_ts FROM roster');
    const wishlistMax = await pool.query('SELECT MAX(updated_at) as max_ts FROM wishlist');
    const rosterTs = rosterMax.rows[0]?.max_ts?.getTime() || 0;
    const wishlistTs = wishlistMax.rows[0]?.max_ts?.getTime() || 0;
    const lastModified = Math.max(rosterTs, wishlistTs) || Date.now();

    res.json({ success: true, lastModified });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('PUT ERROR:', err.stack || err);
    res.status(500).json({ error: 'Failed to save data' });
  } finally {
    client.release();
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