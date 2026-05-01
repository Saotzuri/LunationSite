// WoW Spec Icons - using World of Warcraft icons API
// Using 36px icons which are more likely to work

export const specIcons = {
  // Death Knight
  'Blood DK': 'ability_deathknight_bloodpresence',
  'Frost DK': 'ability_deathknight_frostpresence',
  'Unholy DK': 'ability_deathknight_unholypresence',
  // Demon Hunter
  'Vengeance DH': 'ability_demonhunter_souldebris',
  'Havoc DH': 'ability_demonhunter_blur',
  // Druid
  'Bear Druid': 'ability_racial_bearform',
  'Resto Druid': 'spell_nature_healingtouch',
  'Feral Druid': 'ability_druid_catform',
  'Balance Druid': 'spell_nature_starfall',
  // Hunter
  'BM Hunter': 'ability_hunter_beastmastery',
  'MM Hunter': 'ability_hunter_aimedshoot',
  'Survival Hunter': 'ability_hunter_expertiserider',
  // Mage
  'Arcane Mage': 'spell_arcane_arcanetorrent',
  'Fire Mage': 'spell_fire_fireball',
  'Frost Mage': 'spell_frost_frostbolt',
  // Monk
  'Brewmaster Monk': 'ability_monk_chiwave',
  'Mistweaver Monk': 'spell_monk_zen_serenity',
  'Windwalker Monk': 'ability_monk_flyingsnake',
  // Paladin
  'Prot Paladin': 'ability_paladin_shieldofthetemplar',
  'Holy Paladin': 'ability_paladin_holyavenger',
  'Ret Paladin': 'ability_paladin_righteousvengeance',
  // Priest
  'Holy Priest': 'spell_holy_guardianspirit',
  'Disc Priest': 'spell_paladin_divinepurpose',
  'Shadow Priest': 'spell_shadow_shadowwordpain',
  // Rogue
  'Assassination Rogue': 'ability_rogue_deadlypoison',
  'Outlaw Rogue': 'ability_rogue_cannonballbarrage',
  'Subtlety Rogue': 'ability_rogue_shadowdance',
  // Shaman
  'Resto Shaman': 'spell_nature_magicregen',
  'Enhancement Shaman': 'spell_shaman_stormearthfire',
  'Elemental Shaman': 'spell_nature_lightning',
  // Warlock
  'Affliction Warlock': 'spell_shadow_souldrain',
  'Demonology Warlock': 'spell_shadow_metamorphosis',
  'Destruction Warlock': 'spell_fire_hellfire',
  // Warrior
  'Prot Warrior': 'ability_warrior_defensivestance',
  'Arms Warrior': 'ability_warrior_savageblow',
  'Fury Warrior': 'ability_warrior_rampage',
  // Evoker
  'Devastation Evoker': 'inv_devastationevoker_misc',
  'Preservation Evoker': 'inv_preservationevoker_misc',
  'Augmentation Evoker': 'inv_augmentationevoker_misc'
};

export function getSpecIcon(spec) {
  const icon = specIcons[spec];
  if (icon) {
    return `https://render.worldofwarcraft.com/eu/icons/36/${icon}.png`;
  }
  return null;
}