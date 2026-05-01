import { useState } from 'react';
import { isOfficer } from '../utils/auth';
import WishlistCard from '../components/WishlistCard';
import MemberForm from '../components/MemberForm';

export default function WishlistPage({ wishlist, setWishlist }) {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const officer = isOfficer();

  const handleAddEntry = () => {
    setEditingEntry(null);
    setShowForm(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm('Are you sure you want to remove this entry?')) {
      setWishlist(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleSaveEntry = (data) => {
    if (editingEntry) {
      setWishlist(prev => prev.map(e => e.id === editingEntry.id ? { ...e, ...data } : e));
    } else {
      const newEntry = {
        ...data,
        id: Date.now().toString()
      };
      setWishlist(prev => [...prev, newEntry]);
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedWishlist = [...wishlist].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Wishlist</h1>
        <p className="page-subtitle">Recruitment needs for the guild</p>
      </div>

      <div className="roster-section">
        <div className="section-header">
          <h2 className="section-title">
            Open Positions
            <span className="section-count">{wishlist.length}</span>
          </h2>
          {officer && (
            <button className="add-btn" onClick={handleAddEntry}>
              + Add Position
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No open positions in wishlist.</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {sortedWishlist.map(entry => (
              <WishlistCard
                key={entry.id}
                entry={entry}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <MemberForm
          member={editingEntry}
          isWishlist={true}
          onSave={handleSaveEntry}
          onCancel={() => {
            setShowForm(false);
            setEditingEntry(null);
          }}
        />
      )}
    </div>
  );
}