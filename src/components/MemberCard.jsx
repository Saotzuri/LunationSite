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
      <div className="member-links">
        {member.wowheadUrl && (
          <a
            href={member.wowheadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="member-link"
          >
            WoWHead ↗
          </a>
        )}
      </div>
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