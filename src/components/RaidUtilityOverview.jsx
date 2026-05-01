import { buildRaidUtilityStats, UTILITY_SECTIONS } from '../utils/raidUtility';

export default function RaidUtilityOverview({ entries, title = 'Raid Utility Overview' }) {
  const stats = buildRaidUtilityStats(entries || []);

  return (
    <div className="utility-overview">
      <div className="utility-overview-header">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="utility-sections">
        {UTILITY_SECTIONS.map(section => (
          <div key={section.title} className="utility-section-card">
            <h3 className="utility-section-title">{section.title}</h3>
            <div className="utility-section-list">
              {section.metrics.map(metric => (
                <div key={`${section.title}-${metric}`} className="utility-row">
                  <span className="utility-value">{stats[metric] || 0}</span>
                  <span className="utility-label">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
