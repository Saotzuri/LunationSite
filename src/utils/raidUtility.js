import { getClassFromSpec } from './classColors';

export const UTILITY_SECTIONS = [
  {
    title: 'Roles',
    metrics: ['Melee', 'Ranged', 'Healers', 'Tanks']
  },
  {
    title: 'Buffs',
    metrics: ['Versatility', 'Intellect', 'Attack Power', 'Stamina', 'Damage dealt', 'Movement Abilities', 'Melee']
  },
  {
    title: 'Debuffs',
    metrics: ['Physical Damage Taken', 'Magic Damage Taken']
  },
  {
    title: 'External Cooldowns',
    metrics: ['Damage Mitigation', 'Immunities', 'Movement Abilities', 'Cheat Death', 'Health', 'Reduced Threat']
  },
  {
    title: 'Personal Cooldowns',
    metrics: ['Damage Mitigation', 'Immunities', 'Movement Abilities', 'Cheat Death', 'Stuns']
  },
  {
    title: 'Crowd Control',
    metrics: ['Incapacitates', 'Roots', 'Slows', 'Taunts', 'Stuns', 'External Cooldowns', 'Disorients', 'Knockbacks', 'Miscellaneous Utility']
  },
  {
    title: 'Other',
    metrics: [
      'Offensive Magic Dispels',
      'Friendly Curse Dispels',
      'Friendly Magic Dispels',
      'Friendly Disease Dispels',
      'Silences',
      'Short CD Interrupts',
      'Long CD Interrupts',
      'Friendly Poison Dispels',
      'Offensive Enrage Dispels',
      'Battle Resurrections',
      'Haste',
      'Miscellaneous Utility',
      'Friendly Bleed Dispels',
      'Slows'
    ]
  }
];

const CLASS_UTILITY = {
  'Death Knight': {
    Stamina: 1,
    'Magic Damage Taken': 1,
    Taunts: 1,
    'Short CD Interrupts': 1,
    Slows: 1
  },
  'Demon Hunter': {
    'Damage dealt': 1,
    'Magic Damage Taken': 1,
    'Movement Abilities': 1,
    Silences: 1,
    Slows: 1
  },
  Druid: {
    Versatility: 1,
    Roots: 1,
    'Battle Resurrections': 1,
    'Offensive Enrage Dispels': 1,
    'Friendly Curse Dispels': 1
  },
  Hunter: {
    'Attack Power': 1,
    Slows: 1,
    Knockbacks: 1,
    'Long CD Interrupts': 1
  },
  Mage: {
    Intellect: 1,
    Roots: 1,
    Slows: 1,
    'Friendly Curse Dispels': 1,
    'Offensive Magic Dispels': 1
  },
  Monk: {
    'Physical Damage Taken': 1,
    Incapacitates: 1,
    'Movement Abilities': 1,
    'Friendly Poison Dispels': 1,
    'Friendly Disease Dispels': 1
  },
  Paladin: {
    'Attack Power': 1,
    Health: 1,
    Immunities: 1,
    Stuns: 1,
    'Friendly Poison Dispels': 1,
    'Friendly Disease Dispels': 1
  },
  Priest: {
    Stamina: 1,
    'Friendly Magic Dispels': 1,
    'Offensive Magic Dispels': 1,
    'Damage Mitigation': 1
  },
  Rogue: {
    'Physical Damage Taken': 1,
    Incapacitates: 1,
    Stuns: 1,
    'Cheat Death': 1,
    'Reduced Threat': 1
  },
  Shaman: {
    Haste: 1,
    'Movement Abilities': 1,
    Knockbacks: 1,
    Slows: 1,
    'Friendly Curse Dispels': 1
  },
  Warlock: {
    Intellect: 1,
    'Battle Resurrections': 1,
    Health: 1,
    'Magic Damage Taken': 1,
    'Miscellaneous Utility': 1
  },
  Warrior: {
    'Attack Power': 1,
    Taunts: 1,
    Stuns: 1,
    'Damage Mitigation': 1,
    'Short CD Interrupts': 1
  },
  Evoker: {
    'Movement Abilities': 1,
    'Damage dealt': 1,
    'Magic Damage Taken': 1,
    'Friendly Poison Dispels': 1,
    'Friendly Bleed Dispels': 1
  }
};

const ROLE_UTILITY = {
  tank: { 'Damage Mitigation': 3, Taunts: 1, Health: 1 },
  healer: { 'External Cooldowns': 1, 'Friendly Magic Dispels': 1, Immunities: 1 },
  melee: { Melee: 1, 'Short CD Interrupts': 1, Slows: 1, Stuns: 1 },
  ranged: { Ranged: 1, 'Long CD Interrupts': 1, Knockbacks: 1, Disorients: 1 }
};

function createBaseStats() {
  const stats = {};
  UTILITY_SECTIONS.forEach(section => {
    section.metrics.forEach(metric => {
      if (stats[metric] === undefined) stats[metric] = 0;
    });
  });
  return stats;
}

function addValues(stats, values) {
  Object.entries(values).forEach(([metric, amount]) => {
    if (stats[metric] === undefined) {
      stats[metric] = 0;
    }
    stats[metric] += amount;
  });
}

export function buildRaidUtilityStats(entries) {
  const stats = createBaseStats();

  entries.forEach(entry => {
    if (entry.role === 'melee') stats.Melee += 1;
    if (entry.role === 'ranged') stats.Ranged += 1;
    if (entry.role === 'healer') stats.Healers += 1;
    if (entry.role === 'tank') stats.Tanks += 1;

    addValues(stats, ROLE_UTILITY[entry.role] || {});
    const className = getClassFromSpec(entry.spec);
    if (className) {
      addValues(stats, CLASS_UTILITY[className] || {});
    }
  });

  return stats;
}
