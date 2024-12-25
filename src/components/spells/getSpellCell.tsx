import { TableCell } from '@nextui-org/react';
import { Spell, SpellName } from '@/models/spell';
import { Stat } from '@/models/stat';
import StatCellBody from './StatCellBody';
import { ReactNode } from 'react';

export const SPELL_COLUMN_KEY = 'spell' as const;

export const getSpellCell = ({
  columnKey,
  maxStats,
  name,
  showName = false,
  spellStats,
  t,
  trailingNode,
}: {
  columnKey: typeof SPELL_COLUMN_KEY | Stat;
  maxStats: Record<Stat, number>;
  name: SpellName;
  showName?: boolean;
  spellStats: Spell;
  t: (key: string) => string;
  trailingNode?: ReactNode;
}) => {
  switch (columnKey) {
    case SPELL_COLUMN_KEY: {
      return <TableCell>{t(`Spells.${name}`)}</TableCell>;
    }
    default: {
      const body = showName ? (
        <span className="mr-auto pr-6">{t(`Spells.${name}`)}</span>
      ) : null;

      return (
        <TableCell>
          <StatCellBody
            columnKey={columnKey}
            maxStats={maxStats}
            spellStats={spellStats}
            trailingNode={trailingNode}
          >
            {body}
          </StatCellBody>
        </TableCell>
      );
    }
  }
};
