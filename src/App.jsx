import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [conflictError, setConflictError] = useState(null);
  const [roster, setRoster] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recruits, setRecruits] = useState([]);
  const [specUtilityConfig, setSpecUtilityConfig] = useState({});
  const lastKnownVersion = useRef(null);

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
        setRecruits(data.recruits || []);
        setSpecUtilityConfig(data.specUtilityConfig || {});
        lastKnownVersion.current = data.lastModified || Date.now();
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
  const saveData = useCallback(async (newRoster, newWishlist, newRecruits, newSpecUtilityConfig) => {
    console.log('saveData called:', { roster: newRoster?.length, wishlist: newWishlist?.length, recruits: newRecruits?.length, version: lastKnownVersion.current });
    if (!newRoster || !newWishlist) {
      console.error('saveData: missing data', { newRoster, newWishlist });
      return;
    }
    const recruitsToSave = newRecruits !== undefined ? newRecruits : recruits;
    const configToSave = newSpecUtilityConfig !== undefined ? newSpecUtilityConfig : specUtilityConfig;
    try {
      const res = await fetch(`${API_URL}/api/data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roster: newRoster,
          wishlist: newWishlist,
          recruits: recruitsToSave,
          specUtilityConfig: configToSave,
          knownVersion: lastKnownVersion.current
        })
      });
      const result = await res.json();
      console.log('Save result:', result);

      if (result.conflict) {
        console.warn('Data conflict detected! Another user has saved changes.');
        setConflictError('Ein anderer Offizier hat gerade Änderungen gespeichert. Deine Änderungen wurden nicht gespeichert.');
        setRoster(result.currentRoster);
        setWishlist(result.currentWishlist);
        lastKnownVersion.current = result.lastModified;
        setTimeout(() => setConflictError(null), 8000);
      } else if (result.success) {
        lastKnownVersion.current = result.lastModified;
      }
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

  // Handle setRecruits
  const handleSetRecruits = useCallback((newRecruitsOrUpdater) => {
    console.log('handleSetRecruits called, type:', typeof newRecruitsOrUpdater);

    if (typeof newRecruitsOrUpdater === 'function') {
      setRecruits(prevRecruits => {
        const newRecruits = newRecruitsOrUpdater(prevRecruits);
        console.log('Updater produced recruits with', newRecruits?.length, 'entries');
        return newRecruits;
      });
    } else {
      console.log('Direct recruits update with', newRecruitsOrUpdater?.length, 'entries');
      setRecruits(newRecruitsOrUpdater);
    }
  }, []);

  // Save only after successful initial load to prevent accidental wipes on load errors
  useEffect(() => {
    if (!loading && hasLoadedFromServer && !loadError) {
      console.log('Auto-saving due to state change');
      saveData(roster, wishlist, recruits);
    }
  }, [loading, hasLoadedFromServer, loadError, roster, wishlist, recruits, saveData]);

  // Function to update spec utility config
  const updateSpecUtilityConfig = useCallback((newConfig) => {
    setSpecUtilityConfig(newConfig);
    saveData(roster, wishlist, recruits, newConfig);
  }, [roster, wishlist, recruits, saveData]);

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
      {conflictError && (
        <div className="conflict-alert">
          {conflictError}
        </div>
      )}
      <main>
        <Routes>
          <Route
            path="/"
            element={<RosterPage roster={roster} setRoster={handleSetRoster} specUtilityConfig={specUtilityConfig} updateSpecUtilityConfig={updateSpecUtilityConfig} />}
          />
          <Route
            path="/wishlist"
            element={<WishlistPage roster={roster} wishlist={wishlist} setWishlist={handleSetWishlist} recruits={recruits} setRecruits={handleSetRecruits} specUtilityConfig={specUtilityConfig} updateSpecUtilityConfig={updateSpecUtilityConfig} />}
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