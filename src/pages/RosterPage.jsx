import { useState } from 'react';
import { isOfficer } from '../utils/auth';
import RaidComposition from '../components/RaidComposition';
import RaidGroups from '../components/RaidGroups';
import RaidUtilityOverview from '../components/RaidUtilityOverview';
import MemberForm from '../components/MemberForm';

export default function RosterPage({ roster, setRoster }) {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [addToGroup, setAddToGroup] = useState(null);
  const officer = isOfficer();

  const handleAddMember = (groupId = null) => {
    setAddToGroup(groupId);
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEditMember = (member) => {
    setAddToGroup(null);
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      setRoster(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSaveMember = (data) => {
    if (editingMember) {
      setRoster(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...data } : m));
    } else {
      const newMember = {
        ...data,
        id: Date.now().toString(),
        group: addToGroup || getNextAvailableGroup()
      };
      setRoster(prev => [...prev, newMember]);
    }
    setShowForm(false);
    setEditingMember(null);
    setAddToGroup(null);
  };

  const getNextAvailableGroup = () => {
    const groupCounts = {};
    roster.forEach(m => {
      const g = m.group || 1;
      groupCounts[g] = (groupCounts[g] || 0) + 1;
    });
    for (let i = 1; i <= 8; i++) {
      if (!groupCounts[i] || groupCounts[i] < 5) return i;
    }
    return 1;
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMember(null);
    setAddToGroup(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Current Roster</h1>
        <p className="page-subtitle">Lunation raid team composition</p>
      </div>

      <RaidComposition roster={roster} />
      <RaidUtilityOverview entries={roster} title="Raid Buffs & Utility" />

      <div className="roster-section">
        <div className="section-header">
          <h2 className="section-title">
            Roster
            <span className="section-count">{roster.length}</span>
          </h2>
          {officer && (
            <button className="add-btn" onClick={() => handleAddMember()}>
              + Add Member
            </button>
          )}
        </div>

        {roster.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <p>No members in roster yet.</p>
          </div>
        ) : (
          <RaidGroups
            roster={roster}
            setRoster={setRoster}
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
            onAddMember={handleAddMember}
          />
        )}
      </div>

      {showForm && (
        <MemberForm
          member={editingMember}
          onSave={handleSaveMember}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}