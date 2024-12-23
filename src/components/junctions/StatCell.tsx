import type { Stat } from '@/models/stat';
import type { Spell } from '@/models/spell';
import styles from './StatCell.module.css';

export default function StatCell({
  spell,
  maxValue,
  stat,
}: {
  spell: Spell;
  maxValue: number;
  stat: Stat;
}) {
  const value = spell[stat];
  const width = (value / maxValue) * 100;

  return (
    <td className={styles.root}>
      <div
        className={styles.background}
        style={{ background: `var(--color-${stat})`, width: `${width}%` }}
      />
      <span className={styles.label}>{value}</span>
    </td>
  );
}
