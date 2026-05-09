import { useState, useEffect } from 'react';
import { getClassColor } from '../utils/classColors';

export default function RecruitmentTracker({ recruits, setRecruits, isOfficer: officerProp }) {
  const [officer, setOfficer] = useState(() => localStorage.getItem('lunation_officer') === 'true');

  useEffect(() => {
    const handleStorage = () => {
      setOfficer(localStorage.getItem('lunation_officer') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(() => {
      setOfficer(localStorage.getItem('lunation_officer') === 'true');
    }, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  console.log('RecruitmentTracker officer:', officer);
  const [showForm, setShowForm] = useState(false);
  const [editingRecruit, setEditingRecruit] = useState(null);

  const handleAdd = () => {
    setEditingRecruit(null);
    setShowForm(true);
  };

  const handleEdit = (recruit) => {
    setEditingRecruit(recruit);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this recruit from the list?')) {
      setRecruits(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSave = (data) => {
    if (editingRecruit) {
      setRecruits(prev => prev.map(r => r.id === editingRecruit.id ? { ...r, ...data } : r));
    } else {
      setRecruits(prev => [...prev, { ...data, id: Date.now().toString(), recruitedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setEditingRecruit(null);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const sortedRecruits = [...recruits].sort((a, b) =>
    new Date(b.recruitedAt) - new Date(a.recruitedAt)
  );

  return (
    <div className="recruitment-tracker">
      <div className="section-header">
        <h2 className="section-title">
          Rekrutierte Spieler
          <span className="section-count">{recruits.length}</span>
        </h2>
        {officer && (
          <button className="add-btn" onClick={handleAdd}>
            + Add Recruit
          </button>
        )}
      </div>

      {recruits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎉</div>
          <p>No recruits added yet.</p>
        </div>
      ) : (
        <div className="recruits-list">
          {sortedRecruits.map(recruit => {
            const classColor = getClassColor(recruit.spec);
            return (
              <div key={recruit.id} className="recruit-card">
                <div className="recruit-info">
                  <span className="recruit-name">{recruit.name}</span>
                  <span className="recruit-spec" style={classColor ? { color: classColor } : {}}>
                    {recruit.spec}
                  </span>
                </div>
                <div className="recruit-details">
                  {recruit.notes && <span className="recruit-notes">{recruit.notes}</span>}
                  <span className="recruit-date">{formatDate(recruit.recruitedAt)}</span>
                </div>
                {officer && (
                  <div className="member-actions">
                    <button className="action-btn" onClick={() => handleEdit(recruit)} title="Edit">✎</button>
                    <button className="action-btn delete" onClick={() => handleDelete(recruit.id)} title="Delete">✕</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <RecruitForm
          recruit={editingRecruit}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingRecruit(null); }}
        />
      )}
    </div>
  );
}

function RecruitForm({ recruit, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    spec: '',
    notes: ''
  });

  useEffect(() => {
    setFormData({
      name: recruit?.name || '',
      spec: recruit?.spec || '',
      notes: recruit?.notes || ''
    });
  }, [recruit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.spec) return;
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">
          {recruit?.id ? 'Edit Recruit' : 'Add Recruit'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Character Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Character name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Spec</label>
            <select
              name="spec"
              value={formData.spec}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">— Select Spec —</option>
              <option value="Blood DK">Death Knight - Blood</option>
              <option value="Frost DK">Death Knight - Frost</option>
              <option value="Unholy DK">Death Knight - Unholy</option>
              <option value="Vengeance DH">Demon Hunter - Vengeance</option>
              <option value="Havoc DH">Demon Hunter - Havoc</option>
              <option value="Devourer DH">Demon Hunter - Devourer</option>
              <option value="Bear Druid">Druid - Guardian (Bear)</option>
              <option value="Resto Druid">Druid - Restoration</option>
              <option value="Feral Druid">Druid - Feral</option>
              <option value="Balance Druid">Druid - Balance</option>
              <option value="BM Hunter">Hunter - Beast Mastery</option>
              <option value="MM Hunter">Hunter - Marksmanship</option>
              <option value="Survival Hunter">Hunter - Survival</option>
              <option value="Arcane Mage">Mage - Arcane</option>
              <option value="Fire Mage">Mage - Fire</option>
              <option value="Frost Mage">Mage - Frost</option>
              <option value="Brewmaster Monk">Monk - Brewmaster</option>
              <option value="Mistweaver Monk">Monk - Mistweaver</option>
              <option value="Windwalker Monk">Monk - Windwalker</option>
              <option value="Prot Paladin">Paladin - Protection</option>
              <option value="Holy Paladin">Paladin - Holy</option>
              <option value="Ret Paladin">Paladin - Retribution</option>
              <option value="Holy Priest">Priest - Holy</option>
              <option value="Disc Priest">Priest - Discipline</option>
              <option value="Shadow Priest">Priest - Shadow</option>
              <option value="Assassination Rogue">Rogue - Assassination</option>
              <option value="Outlaw Rogue">Rogue - Outlaw</option>
              <option value="Subtlety Rogue">Rogue - Subtlety</option>
              <option value="Resto Shaman">Shaman - Restoration</option>
              <option value="Enhancement Shaman">Shaman - Enhancement</option>
              <option value="Elemental Shaman">Shaman - Elemental</option>
              <option value="Affliction Warlock">Warlock - Affliction</option>
              <option value="Demonology Warlock">Warlock - Demonology</option>
              <option value="Destruction Warlock">Warlock - Destruction</option>
              <option value="Prot Warrior">Warrior - Protection</option>
              <option value="Arms Warrior">Warrior - Arms</option>
              <option value="Fury Warrior">Warrior - Fury</option>
              <option value="Devastation Evoker">Evoker - Devastation</option>
              <option value="Preservation Evoker">Evoker - Preservation</option>
              <option value="Augmentation Evoker">Evoker - Augmentation</option>
            </select>
          </div>

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