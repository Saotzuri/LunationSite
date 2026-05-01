import { isOfficer } from '../utils/auth';
import { getClassColor, getClassFromSpec } from '../utils/classColors';

const roleLabels = {
  tank: 'Tank',
  healer: 'Healer',
  melee: 'Melee DPS',
  ranged: 'Ranged DPS'
};

export default function WishlistCard({ entry, onEdit, onDelete, showActions = true, locked = false }) {
  const officer = isOfficer();
  const classColor = getClassColor(entry.spec);
  const className = getClassFromSpec(entry.spec);

  const displayName = entry.spec || roleLabels[entry.role] || 'Any';

  return (
    <div className={`wishlist-card ${locked ? 'wishlist-card-locked' : ''}`}>
      {locked && <div className="wishlist-lock-badge">Belegt</div>}
      <div className="wishlist-info">
        <div className="wishlist-role" style={{ color: classColor || `var(--role-${entry.role})` }}>
          {roleLabels[entry.role] || 'Flex'}
        </div>
        <div className="wishlist-spec">
          {displayName}
        </div>
        {className && <div className="wishlist-class">{className}</div>}
      </div>
      {officer && showActions && !locked && (
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