import { isOfficer } from '../utils/auth';
import { getClassColor } from '../utils/classColors';

const roleLabels = {
  tank: 'Tank',
  healer: 'Healer',
  melee: 'Melee DPS',
  ranged: 'Ranged DPS'
};

const roleIcons = {
  tank: '🛡',
  healer: '✚',
  melee: '⚔',
  ranged: '🏹'
};

export default function MemberCard({ member, onEdit, onDelete, compact = false }) {
  const officer = isOfficer();
  const classColor = getClassColor(member.spec);

  return (
    <div className={`member-card ${compact ? 'compact-member-card' : ''}`}>
      {classColor && (
        <div className="class-color-bar" style={{ backgroundColor: classColor }} />
      )}
      <span className={`member-role ${member.role}`}>
        {roleIcons[member.role]} {roleLabels[member.role]}
      </span>
      <h3 className="member-name" style={classColor ? { color: classColor } : {}}>
        {member.name}
      </h3>
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