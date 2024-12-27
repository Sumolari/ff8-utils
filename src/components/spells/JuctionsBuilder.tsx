'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BaseStat, ElementalStat, Stat, StatusStat } from '@/models/stat';
import { SpellName } from '@/models/spell';
import {
  useMaxStatValueForSpellSelection,
  useSpellSelection,
} from '@/context/SpellSelectionContext';
import { setRemoving } from '@/utils/Set';
import SpellPicker from './SpellPicker';
import StatCellBody from './StatCellBody';
import magic from '../../../data/magic.json';
import { Button } from '@nextui-org/react';

type JunctionSlot =
  | BaseStat
  | ElementalStat.atk
  | 'elemDef1'
  | 'elemDef2'
  | 'elemDef3'
  | 'elemDef4'
  | StatusStat.atk
  | 'stDef1'
  | 'stDef2'
  | 'stDef3'
  | 'stDef4';

const statByJunctionSlot: Record<JunctionSlot, Stat> = {
  [BaseStat.eva]: BaseStat.eva,
  [BaseStat.hit]: BaseStat.hit,
  [BaseStat.hp]: BaseStat.hp,
  [BaseStat.luck]: BaseStat.luck,
  [BaseStat.mag]: BaseStat.mag,
  [BaseStat.spd]: BaseStat.spd,
  [BaseStat.spr]: BaseStat.spr,
  [BaseStat.str]: BaseStat.str,
  [BaseStat.vit]: BaseStat.vit,
  [ElementalStat.atk]: ElementalStat.atk,
  elemDef1: ElementalStat.def,
  elemDef2: ElementalStat.def,
  elemDef3: ElementalStat.def,
  elemDef4: ElementalStat.def,
  [StatusStat.atk]: StatusStat.atk,
  stDef1: StatusStat.def,
  stDef2: StatusStat.def,
  stDef3: StatusStat.def,
  stDef4: StatusStat.def,
};

const ALL_JUNCTION_SLOTS: Array<JunctionSlot> = [
  BaseStat.eva,
  BaseStat.hit,
  BaseStat.hp,
  BaseStat.luck,
  BaseStat.mag,
  BaseStat.spd,
  BaseStat.spr,
  BaseStat.str,
  BaseStat.vit,
  ElementalStat.atk,
  'elemDef1',
  'elemDef2',
  'elemDef3',
  'elemDef4',
  StatusStat.atk,
  'stDef1',
  'stDef2',
  'stDef3',
  'stDef4',
];

function JunctionSlot({
  junctionedSpell,
  slot,
  junctionSpell,
  removeJunction,
  disallowedSpells,
}: {
  junctionedSpell: SpellName | null;
  slot: JunctionSlot;
  junctionSpell: (spell: SpellName) => void;
  removeJunction: () => void;
  disallowedSpells: Set<SpellName>;
}) {
  const t = useTranslations();
  const maxStats = useMaxStatValueForSpellSelection();
  const stat = statByJunctionSlot[slot];

  return junctionedSpell ? (
    <StatCellBody
      columnKey={stat}
      maxStats={maxStats}
      spellStats={magic[junctionedSpell]}
      key={slot}
      leadingNode={
        <span className="mr-3 whitespace-nowrap">
          {t(`Stats.${stat}.short`)}
        </span>
      }
      trailingNode={
        <Button
          className="ml-3 my-1"
          size="sm"
          variant="ghost"
          color="danger"
          onPress={() => {
            removeJunction();
          }}
        >
          {t('JunctionsBuilder.actions.release')}
        </Button>
      }
    >
      <span className="mr-auto pr-6">{t(`Spells.${junctionedSpell}`)}</span>
    </StatCellBody>
  ) : (
    <div key={slot} className="flex flex-row items-center">
      <span className="mr-auto">{t(`Stats.${stat}.short`)}</span>
      <SpellPicker
        disallowedSpells={disallowedSpells}
        selectedSpell={junctionedSpell}
        stat={stat}
        junctionSpell={junctionSpell}
        removeJunction={removeJunction}
        buttonClassName="my-1"
      />
    </div>
  );
}

export default function JunctionsBuilder() {
  const selectedSpells = useSpellSelection();

  const [spellByJunctionSlot, setSpellByJunctionSlot] = useState(
    Object.fromEntries(
      ALL_JUNCTION_SLOTS.map((slot) => [slot, null]),
    ) as Record<JunctionSlot, SpellName | null>,
  );

  const junctionedSpells = new Set(
    Object.entries(spellByJunctionSlot)
      .map(([, spell]) => spell)
      .filter((spell) => !!spell),
  );

  const unavailableSpellsByJunctionSlot = Object.fromEntries(
    ALL_JUNCTION_SLOTS.map((slot) => [
      slot,
      spellByJunctionSlot[slot]
        ? setRemoving(selectedSpells, spellByJunctionSlot[slot])
        : junctionedSpells,
    ]),
  ) as Record<JunctionSlot, Set<SpellName>>;

  const junctionSpell = ({
    spell,
    slot,
  }: {
    spell: SpellName;
    slot: JunctionSlot;
  }) => {
    setSpellByJunctionSlot((spellByJunctionSlot) => ({
      ...spellByJunctionSlot,
      [slot]: spell,
    }));
  };

  const removeJunction = (slot: JunctionSlot) => {
    setSpellByJunctionSlot((spellByJunctionSlot) => ({
      ...spellByJunctionSlot,
      [slot]: null,
    }));
  };

  useEffect(() => {
    setSpellByJunctionSlot(
      (spellByJunctionSlot) =>
        Object.fromEntries(
          Object.entries(spellByJunctionSlot).map(([stat, spell]) => [
            stat,
            spell && selectedSpells.has(spell) ? spell : null,
          ]),
        ) as Record<JunctionSlot, null | SpellName>,
    );
  }, [selectedSpells]);

  const getJunctionSlotNode = (slot: JunctionSlot) => (
    <JunctionSlot
      disallowedSpells={unavailableSpellsByJunctionSlot[slot]}
      junctionSpell={(spell) => junctionSpell({ spell, slot })}
      junctionedSpell={spellByJunctionSlot[slot]}
      removeJunction={() => removeJunction(slot)}
      slot={slot}
      key={slot}
    />
  );

  const baseStatsJunctions = [
    BaseStat.str,
    BaseStat.vit,
    BaseStat.mag,
    BaseStat.spr,
    BaseStat.spd,
    BaseStat.eva,
    BaseStat.hit,
    BaseStat.luck,
  ].map((slot) => getJunctionSlotNode(slot));

  const elementalStatsJunctions = [
    ElementalStat.atk as const,
    'elemDef1' as const,
    'elemDef2' as const,
    'elemDef3' as const,
    'elemDef4' as const,
  ].map((slot) => getJunctionSlotNode(slot));

  const statusStatsJunctions = [
    StatusStat.atk as const,
    'stDef1' as const,
    'stDef2' as const,
    'stDef3' as const,
    'stDef4' as const,
  ].map((slot) => getJunctionSlotNode(slot));

  return (
    <div className="w-full">
      <div className="w-full sm:w-1/2 sm:pr-2">
        {getJunctionSlotNode(BaseStat.hp)}
      </div>
      <div className="w-full sm:columns-2">{baseStatsJunctions}</div>
      <div className="w-full sm:columns-2">
        {elementalStatsJunctions}
        {statusStatsJunctions}
      </div>
    </div>
  );
}
