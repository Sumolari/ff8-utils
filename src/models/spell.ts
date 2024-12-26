import { BaseStat, ElementalStat, StatusStat, Stat } from './stat';
import magic from '../../data/magic.json';
import { Element } from './element';
import { Status } from './status';

export type SpellName = keyof typeof magic;
export type Spell = Record<BaseStat, number> &
  Record<ElementalStat, Partial<Record<Element, number>>> &
  Record<StatusStat, Partial<Record<Status, number>>>;

export const isJunctionableToStat = ({
  spell,
  stat,
}: {
  spell: Spell;
  stat: Stat;
}): boolean =>
  typeof spell[stat] === 'number'
    ? true
    : Object.values(spell[stat]).length > 0;
