import { useMemo } from 'react';

const roleLabels = {
  tank: 'Tanks',
  healer: 'Healer',
  melee: 'Melee DPS',
  ranged: 'Ranged DPS'
};

const roleTargets = {
  tank: 2,
  healer: 3,
  melee: 4,
  ranged: 4
};

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

  return (
    <div className="raid-composition">
      {Object.entries(roleLabels).map(([role, label]) => {
        const count = stats[role];
        const target = roleTargets[role];
        const percentage = Math.min((count / target) * 100, 100);

        return (
          <div key={role} className={`stat-card ${role}`}>
            <div className="stat-value">{count}</div>
            <div className="stat-label">{label}</div>
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