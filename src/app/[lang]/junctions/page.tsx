import magic from '../../../../data/magic.json';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';
import { ALL_STATS } from '@/models/stat';
import StatCell from '@/components/junctions/StatCell';

export default function Home() {
  const t = useTranslations();

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
    <th key={stat}>{t(`Stats.${stat}`)}</th>
  ));
  const spellRows = Object.entries(magic).map(([spellName, spellStats]) => (
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
