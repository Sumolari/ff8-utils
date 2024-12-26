export enum BaseStat {
  hp = 'hp',
  str = 'str',
  vit = 'vit',
  mag = 'mag',
  spr = 'spr',
  spd = 'spd',
  eva = 'eva',
  hit = 'hit',
  luck = 'luck',
}

export enum ElementalStat {
  atk = 'elemAtk',
  def = 'elemDef',
}

export enum StatusStat {
  atk = 'stAtk',
  def = 'stDef',
}

export type Stat = BaseStat | ElementalStat | StatusStat;

export const ALL_BASE_STATS = [
  BaseStat.hp,
  BaseStat.str,
  BaseStat.vit,
  BaseStat.mag,
  BaseStat.spr,
  BaseStat.spd,
  BaseStat.eva,
  BaseStat.hit,
  BaseStat.luck,
];

export const ALL_ELEMENTAL_STATS = [ElementalStat.atk, ElementalStat.def];

export const ALL_STATUS_STATS = [StatusStat.atk, StatusStat.def];

export const ALL_STATS = [
  ...ALL_BASE_STATS,
  ...ALL_ELEMENTAL_STATS,
  ...ALL_STATUS_STATS,
];
