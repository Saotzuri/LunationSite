import { isOfficer } from '../utils/auth';

const roleLabels = {
  tank: 'Tank',
  healer: 'Healer',
  melee: 'Melee DPS',
  ranged: 'Ranged DPS'
};

export default function MemberCard({ member, onEdit, onDelete }) {
  const officer = isOfficer();

  return (
    <div className="member-card">
      <span className={`member-role ${member.role}`}>
        {roleLabels[member.role]}
      </span>
      <h3 className="member-name">{member.name}</h3>
      <p className="member-spec">{member.spec}</p>
      {member.notes && (
        <p className="member-notes" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          {member.notes}
        </p>
      )}
      {officer && (
        <div className="member-actions">
          <button
            className="action-btn"
            onClick={() => onEdit(member)}
            title="Edit"
          >
            ✎
          </button>
          <button
            className="action-btn delete"
            onClick={() => onDelete(member.id)}
            title="Delete"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}