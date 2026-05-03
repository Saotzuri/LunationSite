import { useState, useEffect } from 'react';
import { UTILITY_SECTIONS, SPEC_UTILITY } from '../utils/raidUtility';

const allSpecs = Object.keys(SPEC_UTILITY);

export default function SpecUtilityConfig({ isOpen, onClose, specUtilityConfig, updateSpecUtilityConfig }) {
  const [selectedSpec, setSelectedSpec] = useState(allSpecs[0] || '');
  const [config, setConfig] = useState({});
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setConfig(specUtilityConfig || {});
      if (allSpecs.length > 0 && !selectedSpec) {
        setSelectedSpec(allSpecs[0]);
      }
    }
  }, [isOpen, specUtilityConfig]);

  const currentConfig = config[selectedSpec] || {};
  const defaultConfig = SPEC_UTILITY[selectedSpec] || {};

  const handleToggle = (metricKey) => {
    const newConfig = { ...config };
    if (!newConfig[selectedSpec]) {
      newConfig[selectedSpec] = {};
    }

    const currentValue = newConfig[selectedSpec][metricKey];
    if (currentValue === 1) {
      newConfig[selectedSpec][metricKey] = 0;
    } else {
      newConfig[selectedSpec][metricKey] = 1;
    }

    setConfig(newConfig);
  };

  const handleSave = () => {
    updateSpecUtilityConfig(config);
    onClose();
  };

  const handleReset = () => {
    const newConfig = { ...config };
    delete newConfig[selectedSpec];
    setConfig(newConfig);
  };

  if (!isOpen) return null;

  const sectionMetrics = UTILITY_SECTIONS[activeSection]?.metrics || [];
  const defaultKeys = Object.keys(defaultConfig).filter(k => defaultConfig[k] > 0);
  const customKeys = Object.keys(currentConfig).filter(k => currentConfig[k] > 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal spec-utility-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Spec Utility Konfiguration</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="spec-utility-content">
          <div className="spec-utility-sidebar">
            <label className="form-label">Spec auswählen</label>
            <select
              className="form-select"
              value={selectedSpec}
              onChange={e => setSelectedSpec(e.target.value)}
            >
              {allSpecs.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <div className="spec-utility-actions">
              <button className="btn btn-secondary" onClick={handleReset}>
                Zurücksetzen
              </button>
            </div>
          </div>

          <div className="spec-utility-main">
            <div className="spec-utility-tabs">
              {UTILITY_SECTIONS.map((section, idx) => (
                <button
                  key={section.title}
                  className={`spec-utility-tab ${activeSection === idx ? 'active' : ''}`}
                  onClick={() => setActiveSection(idx)}
                >
                  {section.title}
                </button>
              ))}
            </div>

            <div className="spec-utility-grid">
              {sectionMetrics.map(metric => {
                const isDefault = defaultKeys.includes(metric.key);
                const isCustom = customKeys.includes(metric.key);
                const isActive = isCustom || isDefault;

                return (
                  <label
                    key={metric.key}
                    className={`spec-utility-checkbox ${isActive ? 'active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isCustom || (isDefault && !currentConfig[metric.key])}
                      onChange={() => handleToggle(metric.key)}
                    />
                    <span className="checkbox-label">{metric.label}</span>
                    {isDefault && !isCustom && (
                      <span className="checkbox-default">(default)</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-primary" onClick={handleSave}>Speichern</button>
        </div>
      </div>
    </div>
  );
}