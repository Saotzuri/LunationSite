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
    const roleOrder = { tank: 0, healer: 1, melee: 2, ranged: 3 };
    const roleDelta = (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99);
    if (roleDelta !== 0) return roleDelta;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const groupedWishlist = sortedWishlist.reduce((acc, entry) => {
    const key = entry.role || 'flex';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(entry);
    return acc;
  }, {});

  const roleSections = [
    { key: 'tank', label: 'Tank' },
    { key: 'healer', label: 'Healer' },
    { key: 'melee', label: 'Melee DPS' },
    { key: 'ranged', label: 'Ranged DPS' }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Wishlist</h1>
        <p className="page-subtitle">Recruitment needs for the guild</p>
      </div>

      <div className="roster-section">
        <div className="section-header">
          <h2 className="section-title">
            Recruitment by Spec
            <span className="section-count">{wishlist.length}</span>
          </h2>
          {officer && (
            <button className="add-btn" onClick={handleAddEntry}>
              + Add Spec Need
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No open positions in wishlist.</p>
          </div>
        ) : (
          <div className="wishlist-role-board">
            {roleSections.map(section => {
              const entries = groupedWishlist[section.key] || [];
              if (entries.length === 0) return null;

              return (
                <div key={section.key} className="wishlist-role-column">
                  <div className="wishlist-role-header">
                    <span>{section.label}</span>
                    <span className="wishlist-role-count">{entries.length}</span>
                  </div>
                  <div className="wishlist-grid">
                    {entries.map(entry => (
                      <WishlistCard
                        key={entry.id}
                        entry={entry}
                        onEdit={handleEditEntry}
                        onDelete={handleDeleteEntry}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
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