import { SortingOrder } from '@/models/sortingOrder';
import { Stat } from '@/models/stat';
import { useTranslations } from 'next-intl';
import classnames from 'classnames';
import styles from './HeaderCell.module.css';
import { MouseEventHandler } from 'react';

export default function HeaderCell({
  stat,
  sortingCriteria,
  onClick,
}: {
  stat: Stat;
  sortingCriteria: { stat: Stat; order: SortingOrder };
  onClick?: MouseEventHandler<HTMLTableCellElement>;
}) {
  const t = useTranslations();

  const isSortingColumn = sortingCriteria.stat === stat;
  const sortingOrderIndicator =
    sortingCriteria.order === SortingOrder.ascending ? '▲' : '▼';
  const sortingOrderNode = isSortingColumn ? (
    <span className={styles.orderIndicator}>{sortingOrderIndicator}</span>
  ) : null;

  return (
    <th
      className={classnames(styles.root, {
        [styles.rootIsSorting]: isSortingColumn,
      })}
      onClick={onClick}
    >
      <span className={styles.label}>{t(`Stats.${stat}`)}</span>
      {sortingOrderNode}
    </th>
  );
}
