'use client';

import { useTranslations } from 'next-intl';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@nextui-org/drawer';
import { Button, useDisclosure } from '@nextui-org/react';
import {
  useMaxStatValueForSpellSelection,
  useSortedSpellSelection,
} from '@/context/SpellSelectionContext';
import { Stat } from '@/models/stat';
import { SPELL_COLUMN_KEY } from './getSpellCell';
import { isJunctionableToStat, Spell, SpellName } from '@/models/spell';
import { ReactNode } from 'react';
import StatCellBody from './StatCellBody';

function JunctionableSpell({
  spell,
  stats,
  stat,
  junctionSpell,
  onClose,
}: {
  spell: SpellName;
  stats: Spell;
  stat: Stat;
  junctionSpell: (spell: SpellName) => void;
  onClose: () => void;
}) {
  const t = useTranslations();
  const maxStats = useMaxStatValueForSpellSelection();

  return (
    <StatCellBody
      columnKey={stat}
      maxStats={maxStats}
      spellStats={stats}
      trailingNode={
        <Button
          className="ml-3 my-1"
          size="sm"
          variant="ghost"
          onPress={() => {
            junctionSpell(spell);
            onClose();
          }}
        >
          {t('SpellPicker.pick')}
        </Button>
      }
    >
      <span className="mr-auto pr-6">{t(`Spells.${spell}`)}</span>
    </StatCellBody>
  );
}

function RemoveJunctionButton({
  selectedSpell,
  onClose,
  removeJunction,
}: {
  selectedSpell: SpellName | null;
  onClose: () => void;
  removeJunction: () => void;
}) {
  const t = useTranslations();

  return selectedSpell ? (
    <Button
      color="danger"
      variant="light"
      onPress={() => {
        onClose();
        removeJunction();
      }}
    >
      {t('SpellPicker.removeJunction')}
    </Button>
  ) : null;
}

export default function SpellPicker({
  disallowedSpells,
  selectedSpell,
  stat,
  junctionSpell,
  removeJunction,
  buttonClassName,
}: {
  disallowedSpells: Set<SpellName>;
  selectedSpell: SpellName | null;
  stat: Stat;
  getTrailingNode?: (params: {
    spell: SpellName;
    columnKey: typeof SPELL_COLUMN_KEY | Stat;
  }) => ReactNode;
  junctionSpell: (spellName: SpellName) => void;
  removeJunction: () => void;
  buttonClassName?: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const t = useTranslations();

  const sortedItems = useSortedSpellSelection({
    disallowedSpells,
    sortDescriptor: {
      column: stat,
      direction: 'descending',
    },
    t,
  }).filter(({ stats }) => isJunctionableToStat({ spell: stats, stat }));

  const pickerCta = selectedSpell
    ? t(`Spells.${selectedSpell}`)
    : t('SpellPicker.pickSpell');

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onPress={onOpen}
        className={buttonClassName}
      >
        {pickerCta}
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="bottom">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>{t('SpellPicker.pickSpell')}</DrawerHeader>
              <DrawerBody>
                <div className="block columns-3xs gap-8">
                  {sortedItems.map(({ name, stats }) => (
                    <JunctionableSpell
                      junctionSpell={junctionSpell}
                      onClose={onClose}
                      spell={name}
                      stat={stat}
                      stats={stats}
                      key={name}
                    />
                  ))}
                </div>
              </DrawerBody>
              <DrawerFooter>
                <RemoveJunctionButton
                  onClose={onClose}
                  removeJunction={removeJunction}
                  selectedSpell={selectedSpell}
                />
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
