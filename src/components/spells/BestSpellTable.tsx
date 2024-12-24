'use client';

import { useTranslations } from 'next-intl';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
} from '@nextui-org/table';
import { Tooltip } from '@nextui-org/react';
import {
  useMaxStatValueForSpellSelection,
  useSortedSpellSelection,
} from '@/context/SpellSelectionContext';
import { Stat } from '@/models/stat';
import { getSpellCell, SPELL_COLUMN_KEY } from './getSpellCell';

export default function BestSpellTable({ stat }: { stat: Stat }) {
  const t = useTranslations();

  const sortedItems = useSortedSpellSelection({
    sortDescriptor: {
      column: stat,
      direction: 'descending',
    },
    t,
  });

  const maxStats = useMaxStatValueForSpellSelection();

  return (
    <Table
      aria-label={'BestJunctionsTable.title'}
      removeWrapper
      isStriped
      isHeaderSticky
      fullWidth={false}
    >
      <TableHeader>
        <TableColumn key={stat} className="uppercase">
          <Tooltip content={t(`Stats.${stat}.full`)} showArrow as="span">
            <span>{t(`Stats.${stat}.short`)}</span>
          </Tooltip>
        </TableColumn>
      </TableHeader>
      <TableBody items={sortedItems}>
        {({ name, stats }) => (
          <TableRow key={name}>
            {(columnKey) =>
              getSpellCell({
                columnKey: columnKey as typeof SPELL_COLUMN_KEY | Stat,
                maxStats,
                name,
                showName: true,
                spellStats: stats,
                t,
              })
            }
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
