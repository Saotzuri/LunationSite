import { useState } from 'react';
import { isOfficer } from '../utils/auth';
import RaidComposition from '../components/RaidComposition';
import RaidUtilityOverview from '../components/RaidUtilityOverview';
import WishlistGroups from '../components/WishlistGroups';
import MemberForm from '../components/MemberForm';

const raidTargets = {
  tank: 2,
  healer: 4,
  dps: 14
};

export default function WishlistPage({ roster, wishlist, setWishlist }) {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [addToGroup, setAddToGroup] = useState(null);
  const officer = isOfficer();
  const mirroredRosterEntries = roster.map(member => ({
    id: `mirror-${member.id}`,
    role: member.role,
    spec: member.spec,
    group: member.group || 1,
    locked: true
  }));
  const wishlistEntries = wishlist.map(entry => ({ ...entry, locked: false }));
  const combinedEntries = [...mirroredRosterEntries, ...wishlistEntries];

  const handleAddEntry = (groupId = null) => {
    setAddToGroup(groupId);
    setEditingEntry(null);
    setShowForm(true);
  };

  const handleEditEntry = (entry) => {
    if (entry.locked) return;
    setAddToGroup(null);
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDeleteEntry = (id) => {
    if (id.toString().startsWith('mirror-')) return;
    if (window.confirm('Are you sure you want to remove this entry?')) {
      setWishlist(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleSaveEntry = (data) => {
    const normalizedData = {
      role: data.role,
      spec: data.spec,
      group: data.group || addToGroup || getNextAvailableGroup()
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
    setAddToGroup(null);
  };

  const getNextAvailableGroup = () => {
    const groupCounts = {};
    combinedEntries.forEach(entry => {
      const g = entry.group || 1;
      groupCounts[g] = (groupCounts[g] || 0) + 1;
    });
    for (let i = 1; i <= 8; i++) {
      if (!groupCounts[i] || groupCounts[i] < 5) return i;
    }
    return 1;
  };

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
        <h1 className="page-title">Wunsch-Roster</h1>
        <p className="page-subtitle">Was uns für die 2/4/14-Raid-Comp noch fehlt</p>
      </div>

      <RaidComposition roster={combinedEntries} />
      <RaidUtilityOverview entries={combinedEntries} title="Wunsch-Roster Buffs & Utility" />

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
            Wunsch-Roster Gruppen
            <span className="section-count">{combinedEntries.length}</span>
          </h2>
          {officer && (
            <button className="add-btn" onClick={handleAddEntry}>
              + Add Wunsch-Spec
            </button>
          )}
        </div>

        {combinedEntries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No open positions in wishlist.</p>
          </div>
        ) : (
          <WishlistGroups
            entries={combinedEntries}
            wishlist={wishlist}
            setWishlist={setWishlist}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onAddEntry={handleAddEntry}
          />
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
            setAddToGroup(null);
          }}
        />
      )}
    </div>
  );
}