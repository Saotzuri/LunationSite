import { useState } from 'react';
import { isOfficer } from '../utils/auth';
import WishlistCard from '../components/WishlistCard';
import MemberForm from '../components/MemberForm';

const raidTargets = {
  tank: 2,
  healer: 4,
  dps: 14
};

export default function WishlistPage({ roster, wishlist, setWishlist }) {
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
    const normalizedData = {
      role: data.role,
      spec: data.spec,
      priority: data.priority || 'medium'
    };

    if (editingEntry) {
      setWishlist(prev => prev.map(e => e.id === editingEntry.id ? { ...e, ...normalizedData } : e));
    } else {
      const newEntry = {
        ...normalizedData,
        id: Date.now().toString()
      };
      setWishlist(prev => [...prev, newEntry]);
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedWishlist = [...wishlist].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const currentCounts = roster.reduce(
    (acc, member) => {
      if (member.role === 'tank') acc.tank += 1;
      if (member.role === 'healer') acc.healer += 1;
      if (member.role === 'melee' || member.role === 'ranged') acc.dps += 1;
      return acc;
    },
    { tank: 0, healer: 0, dps: 0 }
  );

  const missingSlots = [
    { key: 'tank', label: 'Tanks fehlen' },
    { key: 'healer', label: 'Healer fehlen' },
    { key: 'dps', label: 'DPS fehlen' }
  ].map(item => ({
    ...item,
    missing: Math.max(raidTargets[item.key] - currentCounts[item.key], 0)
  }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Roster Wishlist</h1>
        <p className="page-subtitle">Was uns fuer die 2/4/14-Raid-Comp noch fehlt</p>
      </div>

      <div className="roster-section">
        <div className="wishlist-context">
          {missingSlots.map(item => (
            <div key={item.key} className="wishlist-gap-pill">
              <span>{item.label}</span>
              <strong>{item.missing}</strong>
            </div>
          ))}
        </div>

        <div className="section-header">
          <h2 className="section-title">
            Wunsch-Specs fuer fehlende Slots
            <span className="section-count">{wishlist.length}</span>
          </h2>
          {officer && (
            <button className="add-btn" onClick={handleAddEntry}>
              + Wunsch-Spec
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