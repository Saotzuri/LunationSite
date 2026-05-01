import { isOfficer } from '../utils/auth';
import { getClassColor } from '../utils/classColors';
import { getSpecIcon } from '../utils/classIcons';

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
  const classColor = getClassColor(entry.role);

  return (
    <div className="wishlist-card">
      <div className="wishlist-priority-badge" style={{ backgroundColor: priorityColors[entry.priority] }}>
        {entry.priority}
      </div>
      <div className="wishlist-info">
        <div className="wishlist-role" style={{ color: classColor || `var(--role-${entry.role})` }}>
          {roleLabels[entry.role]}
        </div>
        <div className="wishlist-name">{entry.name}</div>
        {entry.notes && (
          <div className="wishlist-notes">{entry.notes}</div>
        )}
      </div>
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