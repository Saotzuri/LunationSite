import { isOfficer } from '../utils/auth';

const roleLabels = {
  tank: 'Tank',
  healer: 'Healer',
  melee: 'Melee DPS',
  ranged: 'Ranged DPS'
};

export default function WishlistCard({ entry, onEdit, onDelete }) {
  const officer = isOfficer();

  return (
    <div className="wishlist-card">
      <div className="wishlist-info">
        <div className="wishlist-role" style={{ color: `var(--role-${entry.role})` }}>
          {roleLabels[entry.role]}
        </div>
        <div className="wishlist-name">{entry.name}</div>
      </div>
      <span className={`wishlist-priority ${entry.priority}`}>
        {entry.priority}
      </span>
      {officer && (
        <div className="member-actions" style={{ opacity: 1, position: 'static', marginLeft: '1rem' }}>
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