// WoW class colors
export const classColors = {
  'Death Knight': '#C41E3A',
  'Demon Hunter': '#A330C9',
  'Druid': '#FF7C0A',
  'Hunter': '#AAD372',
  'Mage': '#3FC7EB',
  'Monk': '#00FF98',
  'Paladin': '#F48CBA',
  'Priest': '#FFFFFF',
  'Rogue': '#FFF468',
  'Shaman': '#0070DD',
  'Warlock': '#8788EE',
  'Warrior': '#C69B6D',
  'Evoker': '#8497ED'
};

// Map specs to classes
export const specToClass = {
  'Blood DK': 'Death Knight',
  'Frost DK': 'Death Knight',
  'Unholy DK': 'Death Knight',
  'Vengeance DH': 'Demon Hunter',
  'Devourer DH': 'Demon Hunter',
  'Havoc DH': 'Demon Hunter',
  'Bear Druid': 'Druid',
  'Resto Druid': 'Druid',
  'Feral Druid': 'Druid',
  'Balance Druid': 'Druid',
  'BM Hunter': 'Hunter',
  'MM Hunter': 'Hunter',
  'Survival Hunter': 'Hunter',
  'Arcane Mage': 'Mage',
  'Fire Mage': 'Mage',
  'Frost Mage': 'Mage',
  'Brewmaster Monk': 'Monk',
  'Mistweaver Monk': 'Monk',
  'Windwalker Monk': 'Monk',
  'Prot Paladin': 'Paladin',
  'Holy Paladin': 'Paladin',
  'Ret Paladin': 'Paladin',
  'Holy Priest': 'Priest',
  'Disc Priest': 'Priest',
  'Shadow Priest': 'Priest',
  'Assassination Rogue': 'Rogue',
  'Outlaw Rogue': 'Rogue',
  'Subtlety Rogue': 'Rogue',
  'Resto Shaman': 'Shaman',
  'Enhancement Shaman': 'Shaman',
  'Elemental Shaman': 'Shaman',
  'Affliction Warlock': 'Warlock',
  'Demonology Warlock': 'Warlock',
  'Destruction Warlock': 'Warlock',
  'Prot Warrior': 'Warrior',
  'Arms Warrior': 'Warrior',
  'Fury Warrior': 'Warrior',
  'Devastation Evoker': 'Evoker',
  'Preservation Evoker': 'Evoker',
  'Augmentation Evoker': 'Evoker'
};

export function getClassFromSpec(spec) {
  return specToClass[spec] || null;
}

export function getClassColor(spec) {
  const className = getClassFromSpec(spec);
  return className ? classColors[className] : null;
}