import type { Stat } from '@/models/stat';
import type { Spell } from '@/models/spell';
import { ReactNode } from 'react';

export default function StatCellBody({
  columnKey,
  maxStats,
  spellStats,
  children,
  trailingNode,
}: {
  columnKey: Stat;
  maxStats: Record<Stat, number>;
  spellStats: Spell;
  children?: ReactNode;
  trailingNode?: ReactNode;
}) {
  const value = spellStats[columnKey];
  const width = (value / maxStats[columnKey]) * 100;

  const body = (
    <div className="flex flex-row relative grow-1 w-full items-center">
      <div
        className="inset-y-0 absolute z-10 max-w-full rounded-md"
        style={{
          background: `var(--color-${columnKey})`,
          width: `${width}%`,
        }}
      />
      <span className="flex flex-row relative z-20 px-1 whitespace-nowrap items-center w-full">
        {children} {value}
      </span>
    </div>
  );

  return trailingNode ? (
    <div className="flex flex-row items-center">
      {body}
      {trailingNode}
    </div>
  ) : (
    body
  );
}
