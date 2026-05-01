import { useState, useEffect } from 'react';

const roles = [
  { value: 'tank', label: 'Tank' },
  { value: 'healer', label: 'Healer' },
  { value: 'melee', label: 'Melee DPS' },
  { value: 'ranged', label: 'Ranged DPS' }
];

const specs = [
  { value: '', label: '— Select Spec —' },
  // Death Knight
  { value: 'Blood DK', label: 'Death Knight - Blood', role: 'tank' },
  { value: 'Frost DK', label: 'Death Knight - Frost', role: 'melee' },
  { value: 'Unholy DK', label: 'Death Knight - Unholy', role: 'melee' },
  // Demon Hunter
  { value: 'Vengeance DH', label: 'Demon Hunter - Vengeance', role: 'tank' },
  { value: 'Havoc DH', label: 'Demon Hunter - Havoc', role: 'melee' },
  // Druid
  { value: 'Bear Druid', label: 'Druid - Guardian (Bear)', role: 'tank' },
  { value: 'Resto Druid', label: 'Druid - Restoration', role: 'healer' },
  { value: 'Feral Druid', label: 'Druid - Feral', role: 'melee' },
  { value: 'Balance Druid', label: 'Druid - Balance', role: 'ranged' },
  // Hunter
  { value: 'BM Hunter', label: 'Hunter - Beast Mastery', role: 'ranged' },
  { value: 'MM Hunter', label: 'Hunter - Marksmanship', role: 'ranged' },
  { value: 'Survival Hunter', label: 'Hunter - Survival', role: 'melee' },
  // Mage
  { value: 'Arcane Mage', label: 'Mage - Arcane', role: 'ranged' },
  { value: 'Fire Mage', label: 'Mage - Fire', role: 'ranged' },
  { value: 'Frost Mage', label: 'Mage - Frost', role: 'ranged' },
  // Monk
  { value: 'Brewmaster Monk', label: 'Monk - Brewmaster', role: 'tank' },
  { value: 'Mistweaver Monk', label: 'Monk - Mistweaver', role: 'healer' },
  { value: 'Windwalker Monk', label: 'Monk - Windwalker', role: 'melee' },
  // Paladin
  { value: 'Prot Paladin', label: 'Paladin - Protection', role: 'tank' },
  { value: 'Holy Paladin', label: 'Paladin - Holy', role: 'healer' },
  { value: 'Ret Paladin', label: 'Paladin - Retribution', role: 'melee' },
  // Priest
  { value: 'Holy Priest', label: 'Priest - Holy', role: 'healer' },
  { value: 'Disc Priest', label: 'Priest - Discipline', role: 'healer' },
  { value: 'Shadow Priest', label: 'Priest - Shadow', role: 'ranged' },
  // Rogue
  { value: 'Assassination Rogue', label: 'Rogue - Assassination', role: 'melee' },
  { value: 'Outlaw Rogue', label: 'Rogue - Outlaw', role: 'melee' },
  { value: 'Subtlety Rogue', label: 'Rogue - Subtlety', role: 'melee' },
  // Shaman
  { value: 'Resto Shaman', label: 'Shaman - Restoration', role: 'healer' },
  { value: 'Enhancement Shaman', label: 'Shaman - Enhancement', role: 'melee' },
  { value: 'Elemental Shaman', label: 'Shaman - Elemental', role: 'ranged' },
  // Warlock
  { value: 'Affliction Warlock', label: 'Warlock - Affliction', role: 'ranged' },
  { value: 'Demonology Warlock', label: 'Warlock - Demonology', role: 'ranged' },
  { value: 'Destruction Warlock', label: 'Warlock - Destruction', role: 'ranged' },
  // Warrior
  { value: 'Prot Warrior', label: 'Warrior - Protection', role: 'tank' },
  { value: 'Arms Warrior', label: 'Warrior - Arms', role: 'melee' },
  { value: 'Fury Warrior', label: 'Warrior - Fury', role: 'melee' },
  // Evoker
  { value: 'Devastation Evoker', label: 'Evoker - Devastation', role: 'ranged' },
  { value: 'Preservation Evoker', label: 'Evoker - Preservation', role: 'healer' },
  { value: 'Augmentation Evoker', label: 'Evoker - Augmentation', role: 'ranged' },
];

export default function MemberForm({ member, onSave, onCancel, isWishlist = false }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'melee',
    spec: '',
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
        notes: member.notes || '',
        priority: member.priority || 'medium'
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'spec' && value) {
        const selectedSpec = specs.find(s => s.value === value);
        if (selectedSpec && selectedSpec.role) {
          newData.role = selectedSpec.role;
        }
      }
      return newData;
    });
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
              placeholder={isWishlist ? "e.g. 1x Shadow Priest" : "Character name"}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Spec</label>
            <select
              name="spec"
              value={formData.spec}
              onChange={handleChange}
              className="form-select"
            >
              {specs.map(spec => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </select>
          </div>

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