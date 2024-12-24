import { Stat } from './stat';
import magic from '../../data/magic.json';

export type SpellName = keyof typeof magic;
export type Spell = Record<Stat, number>;
