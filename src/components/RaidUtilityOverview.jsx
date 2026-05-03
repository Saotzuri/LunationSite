import { useState } from 'react';
import { buildRaidUtilityStatsWithSources, UTILITY_SECTIONS } from '../utils/raidUtility';

export default function RaidUtilityOverview({ entries, title = 'Raid Utility Overview', specUtilityConfig = {} }) {
  const stats = buildRaidUtilityStatsWithSources(entries || [], specUtilityConfig);
  const [hoveredMetric, setHoveredMetric] = useState(null);

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
              {section.metrics.map(metric => {
                const metricData = stats[metric.key];
                const count = metricData?.count || 0;
                const sources = metricData?.sources || [];

                return (
                  <div
                    key={`${section.title}-${metric.key}`}
                    className="utility-row"
                    onMouseEnter={() => setHoveredMetric({ key: metric.key, sources })}
                    onMouseLeave={() => setHoveredMetric(null)}
                  >
                    <span className="utility-value">{count}</span>
                    <span className="utility-label">{metric.label}</span>
                    {hoveredMetric?.key === metric.key && sources.length > 0 && (
                      <div className="utility-tooltip">
                        <div className="utility-tooltip-title">Von:</div>
                        {sources.map(source => (
                          <div key={source} className="utility-tooltip-source">{source}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}