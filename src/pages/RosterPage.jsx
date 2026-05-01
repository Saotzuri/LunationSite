import { useState } from 'react';
import { isOfficer } from '../utils/auth';
import RaidComposition from '../components/RaidComposition';
import MemberCard from '../components/MemberCard';
import MemberForm from '../components/MemberForm';

export default function RosterPage({ roster, setRoster }) {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const officer = isOfficer();

  const handleAddMember = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEditMember = (member) => {
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
        id: Date.now().toString()
      };
      setRoster(prev => [...prev, newMember]);
    }
    setShowForm(false);
    setEditingMember(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Current Roster</h1>
        <p className="page-subtitle">Lunation raid team composition</p>
      </div>

      <RaidComposition roster={roster} />

      <div className="roster-section">
        <div className="section-header">
          <h2 className="section-title">
            Members
            <span className="section-count">{roster.length}</span>
          </h2>
          {officer && (
            <button className="add-btn" onClick={handleAddMember}>
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
          <div className="roster-grid">
            {roster.map(member => (
              <MemberCard
                key={member.id}
                member={member}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <MemberForm
          member={editingMember}
          onSave={handleSaveMember}
          onCancel={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
        />
      )}
    </div>
  );
}