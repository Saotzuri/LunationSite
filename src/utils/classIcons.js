// WoW Spec Icons - using Blizzard's CDN
// Format: https://render.worldofwarcraft.com/eu/icons/36/{icon}.png

export const specIcons = {
  // Death Knight
  'Blood DK': 'inv_helm_plate_raiddeathknight_d_01',
  'Frost DK': 'inv_sword_1h_grimbatol_d_01',
  'Unholy DK': 'inv_spear_05',
  // Demon Hunter
  'Vengeance DH': 'inv_helm_plate_raiddemonhunter_d_01',
  'Havoc DH': 'inv_warglaive_01',
  // Druid
  'Bear Druid': 'inv_helm_leather_feraldruid_d_01',
  'Resto Druid': 'inv_helm_cloth_raidrestodruid_d_01',
  'Feral Druid': 'inv_helm_leather_feraldruid_d_01',
  'Balance Druid': 'inv_helm_leather_balance druid_d_01',
  // Hunter
  'BM Hunter': 'inv_weapon_bow_07',
  'MM Hunter': 'inv_weapon_bow_07',
  'Survival Hunter': 'inv_weapon_staff_01',
  // Mage
  'Arcane Mage': 'inv_staff_13',
  'Fire Mage': 'inv_staff_13',
  'Frost Mage': 'inv_staff_13',
  // Monk
  'Brewmaster Monk': 'inv_helm_plate_raidmonk_d_01',
  'Mistweaver Monk': 'inv_helm_cloth_raidmonk_d_01',
  'Windwalker Monk': 'inv_helm_leather_raidmonk_d_01',
  // Paladin
  'Prot Paladin': 'inv_helm_plate_raidpaladin_d_01',
  'Holy Paladin': 'inv_helm_plate_raidpaladin_d_01',
  'Ret Paladin': 'inv_sword_1h_raidpaladin_d_01',
  // Priest
  'Holy Priest': 'inv_helm_cloth_raidpriest_d_01',
  'Disc Priest': 'inv_helm_cloth_raidpriest_d_01',
  'Shadow Priest': 'inv_helm_cloth_raidpriest_d_01',
  // Rogue
  'Assassination Rogue': 'inv_weapon_shortblade_06',
  'Outlaw Rogue': 'inv_weapon_shortblade_06',
  'Subtlety Rogue': 'inv_weapon_shortblade_06',
  // Shaman
  'Resto Shaman': 'inv_helm_mail_raidshaman_d_01',
  'Enhancement Shaman': 'inv_helm_mail_raidshaman_d_01',
  'Elemental Shaman': 'inv_helm_mail_raidshaman_d_01',
  // Warlock
  'Affliction Warlock': 'inv_wand_01',
  'Demonology Warlock': 'inv_wand_01',
  'Destruction Warlock': 'inv_wand_01',
  // Warrior
  'Prot Warrior': 'inv_helm_plate_raidwarrior_d_01',
  'Arms Warrior': 'inv_sword_2h_001',
  'Fury Warrior': 'inv_axe_1h_001',
  // Evoker
  'Devastation Evoker': 'inv_devastationevoker_misc',
  'Preservation Evoker': 'inv_preservationevoker_misc',
  'Augmentation Evoker': 'inv_augmentationevoker_misc'
};

export function getSpecIcon(spec) {
  const icon = specIcons[spec];
  if (icon) {
    return `https://render.worldofwarcraft.com/eu/icons/56/${icon}.png`;
  }
  return null;
}