'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styles from './SpellFilter.module.css';

export function SpellFilter({
  availableSpells,
  selectedSpells,
  onSelectionChange,
}: {
  availableSpells: Array<string>;
  selectedSpells: Set<string>;
  onSelectionChange: (newSelection: Set<string>) => void;
}) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const fields = availableSpells
    .sort((lhs, rhs) => {
      const lhsName = t(`Spells.${lhs}`);
      const rhsName = t(`Spells.${rhs}`);

      return lhsName.localeCompare(rhsName);
    })
    .map((name) => (
      <label key={name} className={styles.label}>
        <input
          type="checkbox"
          checked={selectedSpells.has(name)}
          className={styles.input}
          onChange={() => {
            const newSelection = new Set(selectedSpells);

            if (newSelection.has(name)) {
              newSelection.delete(name);
            } else {
              newSelection.add(name);
            }

            onSelectionChange(newSelection);
          }}
        />
        {t(`Spells.${name}`)}
      </label>
    ));

  const { fieldset, suffix } = isOpen
    ? {
        fieldset: <fieldset className={styles.fields}>{fields}</fieldset>,
        suffix: '-',
      }
    : { fieldset: null, suffix: '+' };

  return (
    <form className={styles.root}>
      <h2 className={styles.title} onClick={() => setIsOpen(!isOpen)}>
        {t('SpellFilter.title')} [{suffix}]
      </h2>
      {fieldset}
    </form>
  );
}
