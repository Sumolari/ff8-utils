'use client';

import magic from '../../../../data/magic.json';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';
import { ALL_STATS, Stat } from '@/models/stat';
import StatCell from '@/components/junctions/StatCell';
import { useState } from 'react';
import { SortingOrder } from '@/models/sortingOrder';
import HeaderCell from '@/components/junctions/HeaderCell';

const DEFAULT_ORDER = SortingOrder.descending;

export default function Home() {
  const t = useTranslations();
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

  const maximumStatValue = Object.values(magic).reduce(
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

  const spellRows = Object.entries(magic)
    .sort(([, lhs], [, rhs]) => {
      const lhsValue = lhs[sortingCriteria.stat];
      const rhsValue = rhs[sortingCriteria.stat];

      const diff = lhsValue - rhsValue;

      return sortingCriteria.order === SortingOrder.ascending ? diff : -diff;
    })
    .map(([spellName, spellStats]) => (
      <tr key={spellName}>
        <td align="right">{t(`Spells.${spellName}`)}</td>
        {ALL_STATS.map((stat) => (
          <StatCell
            key={stat}
            spell={spellStats}
            stat={stat}
            maxValue={maximumStatValue[stat]}
          />
        ))}
      </tr>
    ));

  return (
    <table className={styles.root}>
      <thead>
        <tr>
          <th align="right">{t('JuctionsTable.spell')}</th>
          {headerCells}
        </tr>
      </thead>
      <tbody>{spellRows}</tbody>
    </table>
  );
}
