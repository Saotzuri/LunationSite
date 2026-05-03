import { getClassFromSpec } from './classColors';

export const UTILITY_SECTIONS = [
  {
    title: 'Roles',
    metrics: [
      { key: 'role_melee', label: 'Melee' },
      { key: 'role_ranged', label: 'Ranged' },
      { key: 'role_healers', label: 'Healers' },
      { key: 'role_tanks', label: 'Tanks' }
    ]
  },
  {
    title: 'Buffs',
    metrics: [
      { key: 'buff_versatility', label: 'Versatility' },
      { key: 'buff_intellect', label: 'Intellect' },
      { key: 'buff_attack_power', label: 'Attack Power' },
      { key: 'buff_stamina', label: 'Stamina' },
      { key: 'buff_damage_dealt', label: 'Damage dealt' },
      { key: 'buff_movement', label: 'Movement Abilities' },
      { key: 'buff_melee', label: 'Melee' }
    ]
  },
  {
    title: 'Debuffs',
    metrics: [
      { key: 'debuff_physical_taken', label: 'Physical Damage Taken' },
      { key: 'debuff_magic_taken', label: 'Magic Damage Taken' }
    ]
  },
  {
    title: 'External Cooldowns',
    metrics: [
      { key: 'external_mitigation', label: 'Damage Mitigation' },
      { key: 'external_immunity', label: 'Immunities' },
      { key: 'external_movement', label: 'Movement Abilities' },
      { key: 'external_cheat_death', label: 'Cheat Death' },
      { key: 'external_health', label: 'Health' },
      { key: 'external_reduced_threat', label: 'Reduced Threat' }
    ]
  },
  {
    title: 'Personal Cooldowns',
    metrics: [
      { key: 'personal_mitigation', label: 'Damage Mitigation' },
      { key: 'personal_immunity', label: 'Immunities' },
      { key: 'personal_movement', label: 'Movement Abilities' },
      { key: 'personal_cheat_death', label: 'Cheat Death' },
      { key: 'personal_stuns', label: 'Stuns' }
    ]
  },
  {
    title: 'Crowd Control',
    metrics: [
      { key: 'cc_incapacitates', label: 'Incapacitates' },
      { key: 'cc_roots', label: 'Roots' },
      { key: 'cc_slows', label: 'Slows' },
      { key: 'cc_taunts', label: 'Taunts' },
      { key: 'cc_stuns', label: 'Stuns' },
      { key: 'cc_external_cooldowns', label: 'External Cooldowns' },
      { key: 'cc_disorients', label: 'Disorients' },
      { key: 'cc_knockbacks', label: 'Knockbacks' },
      { key: 'cc_misc', label: 'Miscellaneous Utility' }
    ]
  },
  {
    title: 'Other',
    metrics: [
      { key: 'other_offensive_magic_dispel', label: 'Offensive Magic Dispels' },
      { key: 'other_friendly_curse_dispel', label: 'Friendly Curse Dispels' },
      { key: 'other_friendly_magic_dispel', label: 'Friendly Magic Dispels' },
      { key: 'other_friendly_disease_dispel', label: 'Friendly Disease Dispels' },
      { key: 'other_silences', label: 'Silences' },
      { key: 'other_short_interrupts', label: 'Short CD Interrupts' },
      { key: 'other_long_interrupts', label: 'Long CD Interrupts' },
      { key: 'other_friendly_poison_dispel', label: 'Friendly Poison Dispels' },
      { key: 'other_enrage_dispel', label: 'Offensive Enrage Dispels' },
      { key: 'other_battle_res', label: 'Battle Resurrections' },
      { key: 'other_haste', label: 'Haste' },
      { key: 'other_misc', label: 'Miscellaneous Utility' },
      { key: 'other_friendly_bleed_dispel', label: 'Friendly Bleed Dispels' },
      { key: 'other_slows', label: 'Slows' }
    ]
  }
];

const CLASS_BUFF_SOURCES = {
  Druid: { buff_versatility: 1 },
  Mage: { buff_intellect: 1 },
  Warrior: { buff_attack_power: 1 },
  Priest: { buff_stamina: 1 }
};

export const SPEC_UTILITY = {
  // Death Knight
  'Blood DK': { cc_taunts: 1, personal_mitigation: 2, other_short_interrupts: 1, other_battle_res: 1, cc_slows: 1, other_slows: 1 },
  'Frost DK': { personal_mitigation: 1, personal_movement: 1, other_short_interrupts: 1, other_battle_res: 1, cc_slows: 1, other_slows: 1 },
  'Unholy DK': { personal_mitigation: 1, personal_movement: 1, other_short_interrupts: 1, other_battle_res: 1, cc_slows: 1, other_slows: 1 },

  // Demon Hunter
  'Vengeance DH': { debuff_magic_taken: 1, cc_taunts: 1, personal_mitigation: 2, other_short_interrupts: 1, other_silences: 1, cc_slows: 1, other_slows: 1 },
  'Havoc DH': { debuff_magic_taken: 1, personal_movement: 2, other_short_interrupts: 1, other_silences: 1, cc_slows: 1, other_slows: 1 },
  'Devourer DH': { debuff_magic_taken: 1, personal_movement: 2, other_short_interrupts: 1, other_silences: 1, cc_slows: 1, other_slows: 1 },

  // Druid
  'Bear Druid': { cc_taunts: 1, personal_mitigation: 2, cc_roots: 1, other_battle_res: 1, other_enrage_dispel: 1, other_friendly_curse_dispel: 1 },
  'Resto Druid': { external_mitigation: 1, external_health: 1, external_movement: 1, other_battle_res: 1, other_friendly_curse_dispel: 1, other_friendly_poison_dispel: 1, other_enrage_dispel: 1, cc_roots: 1, cc_external_cooldowns: 1 },
  'Feral Druid': { personal_mitigation: 1, personal_movement: 1, other_battle_res: 1, other_friendly_curse_dispel: 1, other_enrage_dispel: 1, cc_roots: 1, cc_stuns: 1, personal_stuns: 1 },
  'Balance Druid': { personal_mitigation: 1, personal_movement: 1, other_battle_res: 1, other_friendly_curse_dispel: 1, other_enrage_dispel: 1, cc_roots: 1, cc_knockbacks: 1 },

  // Hunter
  'BM Hunter': { personal_mitigation: 1, personal_movement: 1, other_long_interrupts: 1, cc_knockbacks: 1, cc_slows: 1, other_slows: 1 },
  'MM Hunter': { personal_mitigation: 1, personal_movement: 1, other_long_interrupts: 1, cc_knockbacks: 1, cc_slows: 1, other_slows: 1 },
  'Survival Hunter': { personal_mitigation: 1, personal_movement: 1, other_long_interrupts: 1, cc_knockbacks: 1, cc_slows: 1, other_slows: 1, cc_stuns: 1, personal_stuns: 1 },

  // Mage
  'Arcane Mage': { personal_mitigation: 1, personal_immunity: 1, personal_movement: 1, cc_roots: 1, cc_slows: 1, other_slows: 1, other_offensive_magic_dispel: 1, other_friendly_curse_dispel: 1 },
  'Fire Mage': { personal_mitigation: 1, personal_immunity: 1, personal_movement: 1, cc_roots: 1, cc_slows: 1, other_slows: 1, other_offensive_magic_dispel: 1, other_friendly_curse_dispel: 1 },
  'Frost Mage': { personal_mitigation: 1, personal_immunity: 1, personal_movement: 1, cc_roots: 1, cc_slows: 1, other_slows: 1, other_offensive_magic_dispel: 1, other_friendly_curse_dispel: 1 },

  // Monk
  'Brewmaster Monk': { debuff_physical_taken: 1, cc_taunts: 1, personal_mitigation: 2, other_short_interrupts: 1, cc_incapacitates: 1, cc_stuns: 1, personal_stuns: 1, other_friendly_disease_dispel: 1, other_friendly_poison_dispel: 1 },
  'Mistweaver Monk': { debuff_physical_taken: 1, external_mitigation: 1, external_movement: 1, cc_incapacitates: 1, other_friendly_disease_dispel: 1, other_friendly_poison_dispel: 1, cc_external_cooldowns: 1 },
  'Windwalker Monk': { debuff_physical_taken: 1, personal_mitigation: 1, personal_movement: 1, other_short_interrupts: 1, cc_incapacitates: 1, cc_stuns: 1, personal_stuns: 1, other_friendly_disease_dispel: 1, other_friendly_poison_dispel: 1 },

  // Paladin
  'Prot Paladin': { cc_taunts: 1, personal_mitigation: 2, external_mitigation: 1, external_immunity: 1, other_short_interrupts: 1, cc_stuns: 1, personal_stuns: 1, other_friendly_disease_dispel: 1, other_friendly_poison_dispel: 1 },
  'Holy Paladin': { external_mitigation: 1, external_immunity: 1, external_health: 1, other_short_interrupts: 1, cc_stuns: 1, personal_stuns: 1, other_friendly_disease_dispel: 1, other_friendly_poison_dispel: 1, cc_external_cooldowns: 1 },
  'Ret Paladin': { personal_mitigation: 1, personal_immunity: 1, external_mitigation: 1, external_immunity: 1, other_short_interrupts: 1, cc_stuns: 1, personal_stuns: 1, other_friendly_disease_dispel: 1, other_friendly_poison_dispel: 1, cc_external_cooldowns: 1 },

  // Priest
  'Holy Priest': { external_mitigation: 1, external_health: 1, other_offensive_magic_dispel: 1, other_friendly_magic_dispel: 1, cc_fears: 0, cc_external_cooldowns: 1 },
  'Disc Priest': { external_mitigation: 1, external_health: 1, other_offensive_magic_dispel: 1, other_friendly_magic_dispel: 1, cc_external_cooldowns: 1 },
  'Shadow Priest': { personal_mitigation: 1, other_offensive_magic_dispel: 1, other_friendly_magic_dispel: 1, cc_disorients: 1, other_silences: 1 },

  // Rogue
  'Assassination Rogue': { personal_mitigation: 1, personal_cheat_death: 1, external_reduced_threat: 1, other_short_interrupts: 1, cc_incapacitates: 1, cc_stuns: 1, personal_stuns: 1 },
  'Outlaw Rogue': { personal_mitigation: 1, personal_cheat_death: 1, external_reduced_threat: 1, other_short_interrupts: 1, cc_incapacitates: 1, cc_stuns: 1, personal_stuns: 1 },
  'Subtlety Rogue': { personal_mitigation: 1, personal_cheat_death: 1, external_reduced_threat: 1, other_short_interrupts: 1, cc_incapacitates: 1, cc_stuns: 1, personal_stuns: 1 },

  // Shaman
  'Resto Shaman': { other_haste: 1, external_mitigation: 1, external_health: 1, other_friendly_curse_dispel: 1, cc_knockbacks: 1, other_short_interrupts: 1, cc_slows: 1, other_slows: 1, cc_external_cooldowns: 1 },
  'Enhancement Shaman': { other_haste: 1, buff_melee: 1, personal_mitigation: 1, other_friendly_curse_dispel: 1, cc_knockbacks: 1, other_short_interrupts: 1, cc_slows: 1, other_slows: 1 },
  'Elemental Shaman': { other_haste: 1, personal_mitigation: 1, other_friendly_curse_dispel: 1, cc_knockbacks: 1, other_short_interrupts: 1, cc_slows: 1, other_slows: 1 },

  // Warlock
  'Affliction Warlock': { external_health: 1, other_battle_res: 1, personal_mitigation: 1, personal_movement: 1, other_long_interrupts: 1, cc_fears: 0, cc_stuns: 1, personal_stuns: 1, other_misc: 1 },
  'Demonology Warlock': { external_health: 1, other_battle_res: 1, personal_mitigation: 1, personal_movement: 1, other_long_interrupts: 1, cc_stuns: 1, personal_stuns: 1, other_misc: 1 },
  'Destruction Warlock': { external_health: 1, other_battle_res: 1, personal_mitigation: 1, personal_movement: 1, other_long_interrupts: 1, cc_stuns: 1, personal_stuns: 1, other_misc: 1 },

  // Warrior
  'Prot Warrior': { cc_taunts: 1, personal_mitigation: 2, external_mitigation: 1, other_short_interrupts: 1, cc_stuns: 1, personal_stuns: 1 },
  'Arms Warrior': { personal_mitigation: 1, personal_movement: 1, other_short_interrupts: 1, cc_stuns: 1, personal_stuns: 1, cc_slows: 1, other_slows: 1 },
  'Fury Warrior': { personal_mitigation: 1, personal_movement: 1, other_short_interrupts: 1, cc_stuns: 1, personal_stuns: 1, cc_slows: 1, other_slows: 1 },

  // Evoker
  'Devastation Evoker': { external_movement: 1, personal_movement: 1, other_friendly_poison_dispel: 1, other_friendly_bleed_dispel: 1, cc_knockbacks: 1, other_long_interrupts: 1 },
  'Preservation Evoker': { external_movement: 1, external_mitigation: 1, external_health: 1, other_friendly_poison_dispel: 1, other_friendly_bleed_dispel: 1, cc_knockbacks: 1, cc_external_cooldowns: 1 },
  'Augmentation Evoker': { buff_damage_dealt: 1, external_movement: 1, external_mitigation: 1, other_friendly_poison_dispel: 1, other_friendly_bleed_dispel: 1, cc_knockbacks: 1, other_long_interrupts: 1, cc_external_cooldowns: 1 }
};

function createBaseStats() {
  const stats = {};
  UTILITY_SECTIONS.forEach(section => {
    section.metrics.forEach(metric => {
      if (stats[metric.key] === undefined) stats[metric.key] = 0;
    });
  });
  return stats;
}

function createBaseStatsWithSources() {
  const stats = {};
  UTILITY_SECTIONS.forEach(section => {
    section.metrics.forEach(metric => {
      if (stats[metric.key] === undefined) stats[metric.key] = { count: 0, sources: [] };
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

function addValuesWithSources(stats, values, source) {
  Object.entries(values).forEach(([metric, amount]) => {
    if (stats[metric] === undefined) {
      stats[metric] = { count: 0, sources: [] };
    }
    if (amount !== 0) {
      stats[metric].count += amount;
      if (!stats[metric].sources.includes(source)) {
        stats[metric].sources.push(source);
      }
    }
  });
}

export function buildRaidUtilityStats(entries, customUtility = {}) {
  const stats = createBaseStats();

  entries.forEach(entry => {
    if (entry.role === 'melee') stats.role_melee += 1;
    if (entry.role === 'ranged') stats.role_ranged += 1;
    if (entry.role === 'healer') stats.role_healers += 1;
    if (entry.role === 'tank') stats.role_tanks += 1;

    const className = getClassFromSpec(entry.spec);
    if (className) {
      addValues(stats, CLASS_BUFF_SOURCES[className] || {});
    }
    const customSpecConfig = customUtility[entry.spec];
    if (customSpecConfig) {
      addValues(stats, customSpecConfig);
    } else {
      addValues(stats, SPEC_UTILITY[entry.spec] || {});
    }
  });

  return stats;
}

export function buildRaidUtilityStatsWithSources(entries, customUtility = {}) {
  const stats = createBaseStatsWithSources();

  entries.forEach(entry => {
    if (entry.role === 'melee') stats.role_melee.count += 1;
    if (entry.role === 'ranged') stats.role_ranged.count += 1;
    if (entry.role === 'healer') stats.role_healers.count += 1;
    if (entry.role === 'tank') stats.role_tanks.count += 1;

    const className = getClassFromSpec(entry.spec);
    if (className) {
      addValuesWithSources(stats, CLASS_BUFF_SOURCES[className] || {}, entry.spec);
    }

    const customSpecConfig = customUtility[entry.spec];
    if (customSpecConfig) {
      addValuesWithSources(stats, customSpecConfig, entry.spec);
    } else {
      addValuesWithSources(stats, SPEC_UTILITY[entry.spec] || {}, entry.spec);
    }
  });

  return stats;
}
