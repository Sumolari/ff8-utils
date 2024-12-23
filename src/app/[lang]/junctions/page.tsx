'use client';

import magic from '../../../../data/magic.json';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';
import { ALL_STATS, Stat } from '@/models/stat';
import StatCell from '@/components/junctions/StatCell';
import { useState } from 'react';
import { SortingOrder } from '@/models/sortingOrder';
import HeaderCell from '@/components/junctions/HeaderCell';
import { SpellFilter } from '@/components/junctions/SpellFilter';

const ALL_SPELLS = Object.keys(magic);
const DEFAULT_ORDER = SortingOrder.descending;

export default function Home() {
  const t = useTranslations();
  const [selectedSpells, setSelectedSpells] = useState(
    new Set(ALL_SPELLS).difference(new Set(['apocalypse'])),
  );
  const filteredSpells = ALL_SPELLS.filter((spell) =>
    selectedSpells.has(spell),
  );

  const [sortingCriteria, setSortingCriteria] = useState({
    stat: Stat.vit,
    order: DEFAULT_ORDER,
  });
  const sortByStat = (stat: Stat) => {
    const order =
      sortingCriteria.stat === stat
        ? sortingCriteria.order === SortingOrder.ascending
          ? SortingOrder.descending
          : SortingOrder.ascending
        : DEFAULT_ORDER;

    setSortingCriteria({
      stat,
      order,
    });
  };

  const maximumStatValue = filteredSpells
    .map((spell) => magic[spell as keyof typeof magic])
    .reduce(
      (accum, spellStats) =>
        Object.fromEntries(
          ALL_STATS.map((stat) => [
            stat,
            Math.max(accum[stat], spellStats[stat]),
          ]),
        ),
      Object.fromEntries(ALL_STATS.map((stat) => [stat, 0])),
    );

  const headerCells = ALL_STATS.map((stat) => (
    <HeaderCell
      key={stat}
      stat={stat}
      sortingCriteria={sortingCriteria}
      onClick={() => {
        sortByStat(stat);
      }}
    />
  ));

  const spellRows = filteredSpells
    .sort((lhs, rhs) => {
      const lhsValue = magic[lhs as keyof typeof magic][sortingCriteria.stat];
      const rhsValue = magic[rhs as keyof typeof magic][sortingCriteria.stat];

      const diff = lhsValue - rhsValue;

      return sortingCriteria.order === SortingOrder.ascending ? diff : -diff;
    })
    .map((spellName) => (
      <tr key={spellName}>
        <td align="right">{t(`Spells.${spellName}`)}</td>
        {ALL_STATS.map((stat) => (
          <StatCell
            key={stat}
            spell={magic[spellName as keyof typeof magic]}
            stat={stat}
            maxValue={maximumStatValue[stat]}
          />
        ))}
      </tr>
    ));

  return (
    <>
      <SpellFilter
        availableSpells={Object.keys(magic)}
        selectedSpells={selectedSpells}
        onSelectionChange={(newSelectedSpells) => {
          setSelectedSpells(newSelectedSpells);
        }}
      />
      <h2>{t('JuctionsTable.title')}</h2>
      <table className={styles.root}>
        <thead>
          <tr>
            <th align="right">{t('JuctionsTable.spell')}</th>
            {headerCells}
          </tr>
        </thead>
        <tbody>{spellRows}</tbody>
      </table>
    </>
  );
}
