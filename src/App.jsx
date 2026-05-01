import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import RosterPage from './pages/RosterPage';
import WishlistPage from './pages/WishlistPage';
import './index.css';

const API_URL = '';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roster, setRoster] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);

  console.log('App rendered, roster:', roster.length, 'wishlist:', wishlist.length);

  // Load data from server
  useEffect(() => {
    console.log('Fetching data from server...');
    fetch(`${API_URL}/api/data`)
      .then(res => {
        console.log('Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Loaded data:', data);
        setRoster(data.roster || []);
        setWishlist(data.wishlist || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Load error:', err);
        setLoading(false);
      });
  }, []);

  // Save data when roster or wishlist changes
  const saveData = async (newRoster, newWishlist) => {
    console.log('Saving data...', { roster: newRoster.length, wishlist: newWishlist.length });
    try {
      const res = await fetch(`${API_URL}/api/data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roster: newRoster, wishlist: newWishlist })
      });
      const result = await res.json();
      console.log('Save result:', result);
      setLastSaved(new Date().toISOString());
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleSetRoster = (newRoster) => {
    console.log('handleSetRoster called with', newRoster.length, 'members');
    setRoster(newRoster);
    saveData(newRoster, wishlist);
  };

  const handleSetWishlist = (newWishlist) => {
    console.log('handleSetWishlist called with', newWishlist.length, 'entries');
    setWishlist(newWishlist);
    saveData(roster, newWishlist);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'var(--primary)'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <main>
        <Routes>
          <Route
            path="/"
            element={<RosterPage roster={roster} setRoster={handleSetRoster} />}
          />
          <Route
            path="/wishlist"
            element={<WishlistPage wishlist={wishlist} setWishlist={handleSetWishlist} />}
          />
        </Routes>
      </main>
      <footer className="footer">
        Lunation Guild © {new Date().getFullYear()}
        {lastSaved && <span style={{ marginLeft: '1rem', opacity: 0.5 }}>Last saved: {lastSaved}</span>}
      </footer>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </BrowserRouter>
  );
}

export default App;