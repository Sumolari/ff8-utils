import magic from '../../../../data/magic.json';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

export default function Home() {
  const t = useTranslations();

  const stats = [
    'hp',
    'str',
    'vit',
    'mag',
    'spr',
    'spd',
    'eva',
    'hit',
    'luck',
  ] as const;

  const headerCells = stats.map((stat) => (
    <th key={stat}>{t(`Stats.${stat}`)}</th>
  ));
  const spellRows = Object.entries(magic).map(([spell, spellStats]) => (
    <tr key={spell}>
      <td align="right">{t(`Spells.${spell}`)}</td>
      {stats.map((stat) => (
        <td key={stat}>{spellStats[stat]}</td>
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
