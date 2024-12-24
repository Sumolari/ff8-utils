import magic from '../../data/magic.json';

export function useAllSpells() {
  return Object.keys(magic) as Array<keyof typeof magic>;
}
