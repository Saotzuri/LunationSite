import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import RosterPage from './pages/RosterPage';
import WishlistPage from './pages/WishlistPage';
import guildData from './data/guildData.json';
import './index.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [roster, setRoster] = useState(guildData.roster);
  const [wishlist, setWishlist] = useState(guildData.wishlist);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const data = { roster, wishlist };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'guildData.json';
      a.click();
      URL.revokeObjectURL(url);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [roster, wishlist]);

  return (
    <BrowserRouter>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <main>
        <Routes>
          <Route
            path="/"
            element={<RosterPage roster={roster} setRoster={setRoster} />}
          />
          <Route
            path="/wishlist"
            element={<WishlistPage wishlist={wishlist} setWishlist={setWishlist} />}
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