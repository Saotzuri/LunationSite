import { useMemo } from 'react';

const roleConfig = [
  { key: 'tank', label: 'Tanks', target: 2, colorClass: 'tank' },
  { key: 'healer', label: 'Healer', target: 4, colorClass: 'healer' },
  { key: 'dps', label: 'DPS', target: 14, colorClass: 'dps' }
];

export default function RaidComposition({ roster }) {
  const stats = useMemo(() => {
    const counts = { tank: 0, healer: 0, melee: 0, ranged: 0 };
    roster.forEach(member => {
      if (counts[member.role] !== undefined) {
        counts[member.role]++;
      }
    });
    return counts;
  }, [roster]);

  const totalDps = stats.melee + stats.ranged;

  return (
    <div className="raid-composition">
      {roleConfig.map(({ key, label, target, colorClass }) => {
        const count = key === 'dps' ? totalDps : stats[key];
        const percentage = Math.min((count / target) * 100, 100);

        return (
          <div key={key} className={`stat-card ${colorClass}`}>
            <div className="stat-header">
              <div className="stat-label">{label}</div>
              <div className="stat-target">/{target}</div>
            </div>
            <div className="stat-value-row">
              <div className="stat-value">{count}</div>
            </div>

            {key === 'dps' && (
              <div className="dps-breakdown" aria-hidden="true">
                <span>Melee: {stats.melee}</span>
                <span>Ranged: {stats.ranged}</span>
              </div>
            )}

            <div className="stat-bar">
              <div
                className="stat-bar-fill"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}