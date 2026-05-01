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

  // Load data from server
  useEffect(() => {
    fetch(`${API_URL}/api/data`)
      .then(res => res.json())
      .then(data => {
        setRoster(data.roster || []);
        setWishlist(data.wishlist || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Save data when roster or wishlist changes
  const saveData = (newRoster, newWishlist) => {
    fetch(`${API_URL}/api/data`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roster: newRoster, wishlist: newWishlist })
    }).catch(console.error);
  };

  const handleSetRoster = (newRoster) => {
    setRoster(newRoster);
    saveData(newRoster, wishlist);
  };

  const handleSetWishlist = (newWishlist) => {
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
      </footer>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </BrowserRouter>
  );
}

export default App;