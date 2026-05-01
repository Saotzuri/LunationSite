import { useState } from 'react';
import { isOfficer } from '../utils/auth';
import { getClassColor } from '../utils/classColors';
import { getSpecIcon } from '../utils/classIcons';

const roleLabels = {
  tank: 'Tank',
  healer: 'Healer',
  melee: 'Melee DPS',
  ranged: 'Ranged DPS'
};

export default function MemberCard({ member, onEdit, onDelete }) {
  const officer = isOfficer();
  const classColor = getClassColor(member.spec);
  const specIcon = getSpecIcon(member.spec);
  const [iconError, setIconError] = useState(false);

  return (
    <div className="member-card">
      {classColor && (
        <div className="class-color-bar" style={{ backgroundColor: classColor }} />
      )}
      <span className={`member-role ${member.role}`}>
        {roleLabels[member.role]}
      </span>
      <div className="member-header">
        {specIcon && !iconError && (
          <img
            src={specIcon}
            alt=""
            className="spec-icon"
            onError={() => setIconError(true)}
          />
        )}
        <h3 className="member-name" style={classColor ? { color: classColor } : {}}>
          {member.name}
        </h3>
      </div>
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