import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

// Railway volume path - try multiple possible locations
const possiblePaths = [
  process.env.RAILWAY_VOLUME_DIR,
  process.env.RAILWAY_DATA_DIR,
  '/var/data',
  '/data',
  join(__dirname, 'data')
].filter(Boolean);

let dataDir = possiblePaths[0];
let DATA_FILE;

// Find working data directory
for (const path of possiblePaths) {
  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    const testFile = join(path, '.test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    dataDir = path;
    break;
  } catch (err) {
    console.log(`Cannot use ${path}: ${err.message}`);
  }
}

DATA_FILE = join(dataDir, 'guildData.json');

// Create default data file if it doesn't exist
const defaultData = {
  roster: [
    { id: "1", name: "Aeliana", role: "healer", spec: "Holy Priest", notes: "RL" },
    { id: "2", name: "Bloodfang", role: "tank", spec: "Blood DK", notes: "" },
    { id: "3", name: "Shadowstrike", role: "melee", spec: "Assassination Rogue", notes: "" },
    { id: "4", name: "Frostbolt", role: "ranged", spec: "Frost Mage", notes: "" },
    { id: "5", name: "Stormbringer", role: "melee", spec: "Fury Warrior", notes: "" },
    { id: "6", name: "Lightweaver", role: "healer", spec: "Restoration Druid", notes: "" },
    { id: "7", name: "Darkpulse", role: "ranged", spec: "Affliction Warlock", notes: "" },
    { id: "8", name: "Ironclad", role: "tank", spec: "Prot Paladin", notes: "" }
  ],
  wishlist: [
    { id: "1", name: "1x Shadow Priest", role: "ranged", priority: "high", notes: "" },
    { id: "2", name: "1x Devastation Evoker", role: "ranged", priority: "medium", notes: "" }
  ]
};

try {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    console.log('Created default data file');
  }
} catch (err) {
  console.error('Failed to create data file:', err);
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
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.json(data);
  } catch (err) {
    console.error('Read error:', err);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// PUT data
app.put('/api/data', (req, res) => {
  try {
    const { roster, wishlist } = req.body;
    const data = { roster, wishlist };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Saved data:', { rosterCount: roster?.length, wishlistCount: wishlist?.length });
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
  console.log(`Data dir exists: ${fs.existsSync(dataDir)}`);
});