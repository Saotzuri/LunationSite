import { isOfficer } from '../utils/auth';
import { getClassColor, getClassFromSpec } from '../utils/classColors';

const roleLabels = {
  tank: 'Tank',
  healer: 'Healer',
  melee: 'Melee DPS',
  ranged: 'Ranged DPS'
};

const priorityColors = {
  high: 'var(--error)',
  medium: 'var(--warning)',
  low: 'var(--text-muted)'
};

export default function WishlistCard({ entry, onEdit, onDelete }) {
  const officer = isOfficer();
  const classColor = getClassColor(entry.spec);
  const className = getClassFromSpec(entry.spec);

  const displayName = entry.spec || roleLabels[entry.role] || 'Any';

  return (
    <div className="wishlist-card">
      <div className="wishlist-priority-badge" style={{ backgroundColor: priorityColors[entry.priority] }}>
        {entry.priority}
      </div>
      <div className="wishlist-info">
        <div className="wishlist-role" style={{ color: classColor || `var(--role-${entry.role})` }}>
          {roleLabels[entry.role] || 'Flex'}
        </div>
        <div className="wishlist-spec">
          {displayName}
        </div>
        {className && <div className="wishlist-class">{className}</div>}
      </div>
      {officer && (
        <div className="member-actions wishlist-actions">
          <button
            className="action-btn"
            onClick={() => onEdit(entry)}
            title="Edit"
          >
            ✎
          </button>
          <button
            className="action-btn delete"
            onClick={() => onDelete(entry.id)}
            title="Delete"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}