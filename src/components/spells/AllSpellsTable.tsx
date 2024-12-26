'use client';

import { useTranslations } from 'next-intl';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  SortDescriptor,
} from '@nextui-org/table';
import { Tooltip } from '@nextui-org/react';
import {
  useMaxStatValueForSpellSelection,
  useSortedSpellSelection,
} from '@/context/SpellSelectionContext';
import { ALL_BASE_STATS, Stat } from '@/models/stat';
import { useState } from 'react';

import { getSpellCell, SPELL_COLUMN_KEY } from './getSpellCell';

export default function AllSpellsTable() {
  const t = useTranslations();

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: SPELL_COLUMN_KEY,
    direction: 'ascending',
  });

  const sortedItems = useSortedSpellSelection({
    disallowedSpells: new Set(),
    sortDescriptor,
    t,
  });

  const maxStats = useMaxStatValueForSpellSelection();

  const columns = [
    <TableColumn key={SPELL_COLUMN_KEY} className="uppercase" allowsSorting>
      {t('JuctionsTable.spell')}
    </TableColumn>,
    ...ALL_BASE_STATS.map((stat) => (
      <TableColumn key={stat} className="uppercase" allowsSorting>
        <Tooltip content={t(`Stats.${stat}.full`)} showArrow as="span">
          <span>{t(`Stats.${stat}.short`)}</span>
        </Tooltip>
      </TableColumn>
    )),
  ];

  return (
    <Table
      aria-label={'JunctionsTable.title'}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      removeWrapper
      isStriped
      isHeaderSticky
      fullWidth={false}
      className="mb-6"
    >
      <TableHeader>{columns}</TableHeader>
      <TableBody items={sortedItems}>
        {({ name, stats }) => (
          <TableRow key={name}>
            {(columnKey) =>
              getSpellCell({
                columnKey: columnKey as typeof SPELL_COLUMN_KEY | Stat,
                maxStats,
                name,
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
