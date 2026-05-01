import { isOfficer } from '../utils/auth';
import { getClassColor, getClassFromSpec } from '../utils/classColors';

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

export default function WishlistCard({ entry, onEdit, onDelete, showActions = true, locked = false }) {
  const officer = isOfficer();
  const classColor = getClassColor(entry.spec);

  const displayName = entry.spec || roleLabels[entry.role] || 'Any';

  return (
    <div className={`wishlist-card ${locked ? 'wishlist-card-locked' : ''}`}>
      <div className="wishlist-info">
        <span className={`member-role ${entry.role}`}>
          {roleIcons[entry.role]} {roleLabels[entry.role] || 'Flex'}
        </span>
        <div className="wishlist-spec" style={classColor ? { color: classColor } : {}}>
          {displayName}
        </div>
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