import { useState } from 'react';
import { isOfficer } from '../utils/auth';
import RaidComposition from '../components/RaidComposition';
import RaidUtilityOverview from '../components/RaidUtilityOverview';
import SpecUtilityConfig from '../components/SpecUtilityConfig';
import WishlistGroups from '../components/WishlistGroups';
import RecruitmentTracker from '../components/RecruitmentTracker';
import MemberForm from '../components/MemberForm';

export default function WishlistPage({ roster, wishlist, setWishlist, recruits, setRecruits, specUtilityConfig, updateSpecUtilityConfig }) {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [addToGroup, setAddToGroup] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [activeTab, setActiveTab] = useState('wishlist');
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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Wunsch-Roster</h1>
        <p className="page-subtitle">Wunsch-Specs für unseren Raid-Roster</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          Wunsch-Roster
        </button>
        <button
          className={`tab ${activeTab === 'recruits' ? 'active' : ''}`}
          onClick={() => setActiveTab('recruits')}
        >
          Rekrutierte
        </button>
      </div>

      {activeTab === 'wishlist' && (
        <>
          <RaidComposition roster={combinedEntries} />
          <RaidUtilityOverview entries={combinedEntries} title="Wunsch-Roster Buffs & Utility" specUtilityConfig={specUtilityConfig} />
          {officer && (
            <button className="btn btn-secondary" onClick={() => setShowConfig(true)} style={{ marginTop: '1rem' }}>
              Configure Spec Utility
            </button>
          )}

          <div className="roster-section">
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
        </>
      )}

      {activeTab === 'recruits' && (
        <RecruitmentTracker recruits={recruits} setRecruits={setRecruits} />
      )}

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

      <SpecUtilityConfig isOpen={showConfig} onClose={() => setShowConfig(false)} specUtilityConfig={specUtilityConfig} updateSpecUtilityConfig={updateSpecUtilityConfig} />
    </div>
  );
}