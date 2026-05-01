import { useState, useEffect, useCallback } from 'react';
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
  const [hasLoadedFromServer, setHasLoadedFromServer] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [roster, setRoster] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  console.log('App state - roster:', roster?.length, 'wishlist:', wishlist?.length);

  // Load data from server
  useEffect(() => {
    console.log('Fetching data...');
    fetch(`${API_URL}/api/data`)
      .then(res => res.json())
      .then(data => {
        console.log('Loaded data:', data);
        setRoster(data.roster || []);
        setWishlist(data.wishlist || []);
        setLoadError(false);
        setHasLoadedFromServer(true);
        setLoading(false);
      })
      .catch(err => {
        console.error('Load error:', err);
        setLoadError(true);
        setLoading(false);
      });
  }, []);

  // Save data function
  const saveData = useCallback(async (newRoster, newWishlist) => {
    console.log('saveData called:', { roster: newRoster?.length, wishlist: newWishlist?.length });
    if (!newRoster || !newWishlist) {
      console.error('saveData: missing data', { newRoster, newWishlist });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roster: newRoster, wishlist: newWishlist })
      });
      const result = await res.json();
      console.log('Save result:', result);
    } catch (err) {
      console.error('Save error:', err);
    }
  }, []);

  // Wrap setRoster to handle both direct values and updater functions
  const handleSetRoster = useCallback((newRosterOrUpdater) => {
    console.log('handleSetRoster called, type:', typeof newRosterOrUpdater);

    if (typeof newRosterOrUpdater === 'function') {
      // It's a state updater function, need to get current state
      setRoster(prevRoster => {
        const newRoster = newRosterOrUpdater(prevRoster);
        console.log('Updater produced roster with', newRoster?.length, 'members');
        // Don't save here - we'll save after the state is updated
        return newRoster;
      });
    } else {
      // It's a direct value
      console.log('Direct roster update with', newRosterOrUpdater?.length, 'members');
      setRoster(newRosterOrUpdater);
    }
  }, []);

  // Similarly for wishlist
  const handleSetWishlist = useCallback((newWishlistOrUpdater) => {
    console.log('handleSetWishlist called, type:', typeof newWishlistOrUpdater);

    if (typeof newWishlistOrUpdater === 'function') {
      setWishlist(prevWishlist => {
        const newWishlist = newWishlistOrUpdater(prevWishlist);
        console.log('Updater produced wishlist with', newWishlist?.length, 'entries');
        return newWishlist;
      });
    } else {
      console.log('Direct wishlist update with', newWishlistOrUpdater?.length, 'entries');
      setWishlist(newWishlistOrUpdater);
    }
  }, []);

  // Save only after successful initial load to prevent accidental wipes on load errors
  useEffect(() => {
    if (!loading && hasLoadedFromServer && !loadError) {
      console.log('Auto-saving due to state change');
      saveData(roster, wishlist);
    }
  }, [roster, wishlist, loading, hasLoadedFromServer, loadError, saveData]);

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
            element={<WishlistPage roster={roster} wishlist={wishlist} setWishlist={handleSetWishlist} />}
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