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
import { Button, Chip, Divider } from '@nextui-org/react';
import { ALL_ELEMENTS, Element } from '@/models/element';
import { ALL_STATUS, Status } from '@/models/status';

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

const statByJunctionSlot = {
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
} satisfies Record<JunctionSlot, Stat>;

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

function ElementalDefenseSum({
  element,
  value,
}: {
  element: Element;
  value: number;
}) {
  const t = useTranslations();

  const percentageNode =
    value >= 100 ? (
      <Chip color="success">{value - 100}%</Chip>
    ) : (
      <Chip>{value}%</Chip>
    );

  return (
    <div className="flex flex-row items-center mb-2 break-inside-avoid-column">
      <span className="mr-auto">{t(`Stats.${element}`)}</span> {percentageNode}
    </div>
  );
}

function StatusDefenseSum({
  status,
  value,
}: {
  status: Status;
  value: number;
}) {
  const t = useTranslations();

  const percentageNode =
    value >= 100 ? (
      <Chip color="success">{t('JunctionsBuilder.immune')}</Chip>
    ) : (
      <Chip>{value}%</Chip>
    );

  return (
    <div className="flex flex-row items-center mb-2 break-inside-avoid-column">
      <span className="mr-auto">{t(`Stats.${status}`)}</span> {percentageNode}
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

  const elementalDefenseJunctionsSum = [
    'elemDef1' as const,
    'elemDef2' as const,
    'elemDef3' as const,
    'elemDef4' as const,
  ].reduce<Record<Element, number>>(
    (accum, slot) =>
      Object.fromEntries(
        ALL_ELEMENTS.map((element) => {
          const spell = spellByJunctionSlot[slot];

          if (!spell) {
            return [element, accum[element]];
          }

          const stats = magic[spell][statByJunctionSlot[slot]];

          return [
            element,
            accum[element] +
              (element in stats ? stats[element as keyof typeof stats] : 0),
          ];
        }),
      ) as Record<Element, number>,
    Object.fromEntries(ALL_ELEMENTS.map((element) => [element, 0])) as Record<
      Element,
      number
    >,
  );

  const statusDefenseJunctionsSum = [
    'stDef1' as const,
    'stDef2' as const,
    'stDef3' as const,
    'stDef4' as const,
  ].reduce<Record<Status, number>>(
    (accum, slot) =>
      Object.fromEntries(
        ALL_STATUS.map((status) => {
          const spell = spellByJunctionSlot[slot];

          if (!spell) {
            return [status, accum[status]];
          }

          const stats = magic[spell][statByJunctionSlot[slot]];

          return [
            status,
            accum[status] +
              (status in stats ? stats[status as keyof typeof stats] : 0),
          ];
        }),
      ) as Record<Status, number>,
    Object.fromEntries(ALL_STATUS.map((status) => [status, 0])) as Record<
      Status,
      number
    >,
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

  const elementalDefenseNodes = ALL_ELEMENTS.map((element) => (
    <ElementalDefenseSum
      key={element}
      element={element}
      value={elementalDefenseJunctionsSum[element]}
    />
  ));

  const elementalStatsJunctions = [
    'elemDef1' as const,
    'elemDef2' as const,
    'elemDef3' as const,
    'elemDef4' as const,
  ].map((slot) => getJunctionSlotNode(slot));

  const statusDefenseNodes = ALL_STATUS.map((status) => (
    <StatusDefenseSum
      key={status}
      status={status}
      value={statusDefenseJunctionsSum[status]}
    />
  ));

  const statusStatsJunctions = [
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

      <Divider className="my-4" />

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="row-span-1 col-span-1">
          {getJunctionSlotNode(ElementalStat.atk)}
          <Divider className="my-4" />
          <div className="columns-2 mt-1 py-2">{elementalDefenseNodes}</div>
          <Divider className="my-4" />
          {elementalStatsJunctions}
        </div>

        <div className="row-span-1 col-span-1">
          {getJunctionSlotNode(StatusStat.atk)}
          <Divider className="my-4" />
          <div className="columns-2 mt-1 py-2">{statusDefenseNodes}</div>
          <Divider className="my-4" />
          {statusStatsJunctions}
        </div>
      </div>
    </div>
  );
}
