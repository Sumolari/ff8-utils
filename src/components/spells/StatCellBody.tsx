import type { Stat } from '@/models/stat';
import type { Spell } from '@/models/spell';
import { ReactNode } from 'react';

export default function StatCellBody({
  columnKey,
  maxStats,
  spellStats,
  children,
}: {
  columnKey: Stat;
  maxStats: Record<Stat, number>;
  spellStats: Spell;
  children?: ReactNode;
}) {
  const value = spellStats[columnKey];
  const width = (value / maxStats[columnKey]) * 100;

  return (
    <div className="relative">
      <div
        className="inset-y-0 absolute z-10 max-w-full rounded-md"
        style={{
          background: `var(--color-${columnKey})`,
          width: `${width}%`,
        }}
      />
      <span className="flex flex-row relative z-20 px-1 whitespace-nowrap">
        {children} {value}
      </span>
    </div>
  );
}
