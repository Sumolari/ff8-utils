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

  const [isJuctionsTableOpen, setIsJuctionsTableOpen] = useState(true);
  const [isBestJuctionsTableOpen, setIsBestJuctionsTableOpen] = useState(true);

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

  const { junctionsTable, junctionsTableSuffix } = isJuctionsTableOpen
    ? {
        junctionsTable: (
          <table className={styles.root}>
            <thead>
              <tr>
                <th align="right">{t('JuctionsTable.spell')}</th>
                {headerCells}
              </tr>
            </thead>
            <tbody>{spellRows}</tbody>
          </table>
        ),
        junctionsTableSuffix: '-',
      }
    : { junctionsTable: null, junctionsTableSuffix: '+' };

  const bestSpellsSortedByStat = Object.fromEntries(
    ALL_STATS.map((stat) => [
      stat,
      Array.from(filteredSpells).sort(
        (lhs, rhs) =>
          magic[rhs as keyof typeof magic][stat] -
          magic[lhs as keyof typeof magic][stat],
      ),
    ]),
  );

  const bestSpellsRows = filteredSpells.map((_, index) => (
    <tr key={index}>
      {ALL_STATS.map((stat) => {
        const spell = bestSpellsSortedByStat[stat][index];

        return (
          <>
            <td>{t(`Spells.${spell}`)}</td>
            <StatCell
              key={stat}
              spell={magic[spell as keyof typeof magic]}
              stat={stat}
              maxValue={maximumStatValue[stat]}
            />
          </>
        );
      })}
    </tr>
  ));

  const { bestJunctionsTable, bestJunctionsTableSuffix } =
    isBestJuctionsTableOpen
      ? {
          bestJunctionsTable: (
            <table className={styles.root}>
              <thead>
                <tr>
                  {ALL_STATS.map((stat) => (
                    <>
                      <th key={stat} colSpan={2} align="left">
                        {t(`Stats.${stat}`)}
                      </th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>{bestSpellsRows}</tbody>
            </table>
          ),
          bestJunctionsTableSuffix: '-',
        }
      : { bestJunctionsTable: null, bestJunctionsTableSuffix: '+' };

  return (
    <>
      <SpellFilter
        availableSpells={Object.keys(magic)}
        selectedSpells={selectedSpells}
        onSelectionChange={(newSelectedSpells) => {
          setSelectedSpells(newSelectedSpells);
        }}
      />
      <h2
        className={styles.title}
        onClick={() => {
          setIsJuctionsTableOpen(!isJuctionsTableOpen);
        }}
      >
        {t('JuctionsTable.title')} [{junctionsTableSuffix}]
      </h2>
      {junctionsTable}
      <h2
        className={styles.title}
        onClick={() => {
          setIsBestJuctionsTableOpen(!isBestJuctionsTableOpen);
        }}
      >
        {t('BestJunctionsTable.title')} [{bestJunctionsTableSuffix}]
      </h2>
      {bestJunctionsTable}
    </>
  );
}
