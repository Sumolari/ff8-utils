import { Stat } from '@/models/stat';
import BestSpellTable from '@/components/spells/BestSpellTable';
import { SpellName } from '@/models/spell';
import { SPELL_COLUMN_KEY } from './getSpellCell';
import { ReactNode } from 'react';

export default function BestSpellsTables({
  disallowedSpells,
  getTrailingNode,
  stats,
}: {
  disallowedSpells: Set<SpellName>;
  getTrailingNode?: (params: {
    spell: SpellName;
    columnKey: typeof SPELL_COLUMN_KEY | Stat;
  }) => ReactNode;
  stats: Array<Stat>;
}) {
  const bestSpellsSection = stats.map((stat) => (
    <BestSpellTable
      key={stat}
      stat={stat}
      getTrailingNode={getTrailingNode}
      disallowedSpells={disallowedSpells}
    />
  ));

  return <>{bestSpellsSection}</>;
}
