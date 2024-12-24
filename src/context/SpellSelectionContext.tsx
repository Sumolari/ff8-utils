'use client';

import { SortDescriptor } from '@nextui-org/react';
import { SpellName } from '@/models/spell';
import {
  ActionDispatch,
  createContext,
  ReactNode,
  useContext,
  useReducer,
} from 'react';
import magic from '../../data/magic.json';
import { ALL_STATS, Stat } from '@/models/stat';

const ALL_SPELLS = Object.keys(magic) as Array<keyof typeof magic>;
const initialSpellSelection = new Set(ALL_SPELLS);
initialSpellSelection.delete('apocalypse');

type SpellSelectionAction =
  | { type: 'toggle'; spell: SpellName }
  | { type: 'selectAll' }
  | { type: 'disableAll' };

const SpellSelectionContext = createContext<typeof initialSpellSelection>(
  new Set(),
);
const SpellSelectionDispatchContext = createContext<
  ActionDispatch<[action: SpellSelectionAction]>
>(() => {});

export function SpellSelectionProvider({ children }: { children: ReactNode }) {
  const [spellSelection, dispatch] = useReducer(
    spellSelectionReducer,
    new Set(initialSpellSelection),
  );

  return (
    <SpellSelectionContext.Provider value={spellSelection}>
      <SpellSelectionDispatchContext.Provider value={dispatch}>
        {children}
      </SpellSelectionDispatchContext.Provider>
    </SpellSelectionContext.Provider>
  );
}

export function useSpellSelection() {
  return useContext(SpellSelectionContext);
}

export function useMaxStatValueForSpellSelection() {
  const selectedSpells = useSpellSelection();
  const spells = Array.from(selectedSpells);

  const entries = ALL_STATS.map((stat) => [
    stat,
    spells.reduce((max, spell) => Math.max(max, magic[spell][stat]), 0),
  ]);

  return Object.fromEntries(entries) as Record<Stat, number>;
}

export function useSortedSpellSelection({
  sortDescriptor,
  t,
}: {
  sortDescriptor: SortDescriptor;
  t: (key: string) => string;
}) {
  const selectedSpells = useSpellSelection();

  return Array.from(selectedSpells)
    .map((name) => ({
      name,
      stats: magic[name],
    }))
    .sort((lhs, rhs) => {
      const direction = sortDescriptor.direction === 'descending' ? -1 : 1;
      const { column } = sortDescriptor;

      if (column in lhs.stats) {
        const lhsValue = lhs.stats[column as Stat];
        const rhsValue = rhs.stats[column as Stat];
        const diff = lhsValue - rhsValue;
        return diff * direction;
      }

      return (
        t(`Spells.${lhs.name}`).localeCompare(t(`Spells.${rhs.name}`)) *
        direction
      );
    });
}

function useSpellSelectionDispatch() {
  return useContext(SpellSelectionDispatchContext);
}

export function useToggleSpell() {
  const dispatch = useSpellSelectionDispatch();

  return (spell: SpellName) => {
    dispatch({
      spell,
      type: 'toggle',
    });
  };
}

export function useDisableAllSpells() {
  const dispatch = useSpellSelectionDispatch();

  return () => {
    dispatch({
      type: 'disableAll',
    });
  };
}

export function useSelectAllSpells() {
  const dispatch = useSpellSelectionDispatch();

  return () => {
    dispatch({
      type: 'selectAll',
    });
  };
}

function spellSelectionReducer(
  spellSelection: typeof initialSpellSelection,
  action: SpellSelectionAction,
): typeof initialSpellSelection {
  switch (action.type) {
    case 'toggle': {
      const newSelection = new Set(spellSelection);

      if (spellSelection.has(action.spell)) {
        newSelection.delete(action.spell);
      } else {
        newSelection.add(action.spell);
      }

      return newSelection;
    }

    case 'selectAll': {
      return new Set(ALL_SPELLS);
    }

    case 'disableAll': {
      return new Set();
    }
  }
}
