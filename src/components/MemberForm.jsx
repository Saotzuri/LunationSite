import { useState, useEffect } from 'react';

const roles = [
  { value: 'tank', label: 'Tank' },
  { value: 'healer', label: 'Healer' },
  { value: 'melee', label: 'Melee DPS' },
  { value: 'ranged', label: 'Ranged DPS' }
];

export default function MemberForm({ member, onSave, onCancel, isWishlist = false }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'melee',
    spec: '',
    wowheadUrl: '',
    notes: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (member) {
      setFormData({
        id: member.id || '',
        name: member.name || '',
        role: member.role || 'melee',
        spec: member.spec || '',
        wowheadUrl: member.wowheadUrl || '',
        notes: member.notes || '',
        priority: member.priority || 'medium'
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">
          {member?.id ? (isWishlist ? 'Edit Wishlist Entry' : 'Edit Member') : (isWishlist ? 'Add to Wishlist' : 'Add Member')}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
              placeholder={isWishlist ? "e.g. 1x Shadow Priest" : "Character name"}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {!isWishlist && (
            <div className="form-group">
              <label className="form-label">Spec</label>
              <input
                type="text"
                name="spec"
                value={formData.spec}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Frost Mage, Arms Warrior"
              />
            </div>
          )}

          {!isWishlist && (
            <div className="form-group">
              <label className="form-label">WoWHead URL</label>
              <input
                type="url"
                name="wowheadUrl"
                value={formData.wowheadUrl}
                onChange={handleChange}
                className="form-input"
                placeholder="https://www.wowhead.com/..."
              />
            </div>
          )}

          {isWishlist && (
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Notes</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input"
              placeholder="Optional notes..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}