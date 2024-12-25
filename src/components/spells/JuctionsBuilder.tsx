'use client';

import { ComponentProps, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ALL_STATS, Stat } from '@/models/stat';
import BestSpellTable from '@/components/spells/BestSpellTable';
import { SpellName } from '@/models/spell';
import { useSpellSelection } from '@/context/SpellSelectionContext';
import { SPELL_COLUMN_KEY } from './getSpellCell';
import { setRemoving } from '@/utils/Set';
import { Button } from '@nextui-org/react';

export default function JunctionsBuilder() {
  const t = useTranslations();
  const selectedSpells = useSpellSelection();

  const [fixedSpellByStat, setFixedSpellByStat] = useState(
    Object.fromEntries(ALL_STATS.map((stat) => [stat, null])) as Record<
      Stat,
      null | SpellName
    >,
  );

  const junctionedSpells = new Set(
    Object.entries(fixedSpellByStat)
      .map(([, spell]) => spell)
      .filter((spell) => !!spell),
  );

  useEffect(() => {
    setFixedSpellByStat(
      (fixedSpellByStat) =>
        Object.fromEntries(
          Object.entries(fixedSpellByStat).map(([stat, spell]) => [
            stat,
            spell && selectedSpells.has(spell) ? spell : null,
          ]),
        ) as Record<Stat, null | SpellName>,
    );
  }, [selectedSpells]);

  const getUnavailableSpells = (stat: Stat) =>
    fixedSpellByStat[stat]
      ? setRemoving(selectedSpells, fixedSpellByStat[stat])
      : junctionedSpells;

  const getTrailingNode: ComponentProps<
    typeof BestSpellTable
  >['getTrailingNode'] = ({ columnKey, spell }) => {
    if (columnKey === SPELL_COLUMN_KEY) {
      return null;
    }

    const isJunctioned = junctionedSpells.has(spell);

    const { title, color, action } = isJunctioned
      ? {
          title: t('JunctionsBuilder.actions.release'),
          color: 'danger' as const,
          action: () => {
            setFixedSpellByStat({
              ...fixedSpellByStat,
              [columnKey]: null,
            });
          },
        }
      : {
          title: t('JunctionsBuilder.actions.junction'),
          color: 'primary' as const,
          action: () => {
            setFixedSpellByStat({
              ...fixedSpellByStat,
              [columnKey]: spell,
            });
          },
        };

    return (
      <Button
        onPress={action}
        size="sm"
        color={color}
        variant="solid"
        className="ml-4 grow-0"
      >
        {title}
      </Button>
    );
  };

  const bestSpellsSection = ALL_STATS.map((stat) => (
    <BestSpellTable
      key={stat}
      stat={stat}
      getTrailingNode={getTrailingNode}
      disallowedSpells={getUnavailableSpells(stat)}
    />
  ));

  return <>{bestSpellsSection}</>;
}
