import type { Stat } from '@/models/stat';
import type { Spell } from '@/models/spell';
import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

function NumericValueBody({
  value,
  maxStats,
  stat,
  children,
  leadingNode,
  trailingNode,
}: {
  value: number;
  maxStats: Record<Stat, number>;
  stat: Stat;
  children?: ReactNode;
  leadingNode?: ReactNode;
  trailingNode?: ReactNode;
}) {
  const width = (value / maxStats[stat]) * 100;

  return (
    <OptionalWrapper
      className="flex flex-row items-center"
      leadingNode={leadingNode}
      trailingNode={trailingNode}
    >
      <div className="flex flex-row relative grow-1 w-full items-center break-inside-avoid-column">
        <div
          className="inset-y-0 absolute z-10 max-w-full rounded-md"
          style={{
            background: `var(--color-${stat})`,
            width: `${width}%`,
          }}
        />
        <span className="flex flex-row relative z-20 px-1 whitespace-nowrap items-center w-full">
          {children} {value}
        </span>
      </div>
    </OptionalWrapper>
  );
}

function DictionaryBody({
  dictionary,
  maxStats,
  stat,
  children,
  leadingNode,
  trailingNode,
}: {
  dictionary: Record<string, number>;
  maxStats: Record<Stat, number>;
  stat: Stat;
  children?: ReactNode;
  leadingNode?: ReactNode;
  trailingNode?: ReactNode;
}) {
  const t = useTranslations();
  const translatedKeys = Object.keys(dictionary)
    .map((key) => t(`Stats.${key}`))
    .join(', ');
  const values = Object.values(dictionary);

  if (values.length < 1) {
    return <span>{t('StatCellBody.value.notAllowed')}</span>;
  }

  const value = values.reduce((sum, value) => sum + value, 0) / values.length;
  const width = (value / maxStats[stat]) * 100;

  return (
    <div className="break-inside-avoid-column">
      <OptionalWrapper
        className="flex flex-row items-center"
        leadingNode={leadingNode}
        trailingNode={trailingNode}
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-row relative grow-1 w-full items-start">
            <div
              className="inset-y-0 absolute z-10 max-w-full rounded-md"
              style={{
                background: `var(--color-${stat})`,
                width: `${width}%`,
              }}
            />
            <span className="flex flex-row relative z-20 px-1 whitespace-nowrap items-center w-full">
              {children} {value}
            </span>
          </div>
        </div>
      </OptionalWrapper>
      <p className="px-1 pb-3">{translatedKeys}</p>
    </div>
  );
}

function OptionalWrapper({
  children,
  className,
  leadingNode,
  trailingNode,
}: {
  children: ReactNode;
  className: string;
  leadingNode?: ReactNode;
  trailingNode?: ReactNode;
}) {
  return leadingNode || trailingNode ? (
    <div className={className}>
      {leadingNode}
      {children}
      {trailingNode}
    </div>
  ) : (
    children
  );
}

export default function StatCellBody({
  columnKey,
  maxStats,
  spellStats,
  children,
  leadingNode,
  trailingNode,
}: {
  columnKey: Stat;
  maxStats: Record<Stat, number>;
  spellStats: Spell;
  children?: ReactNode;
  leadingNode?: ReactNode;
  trailingNode?: ReactNode;
}) {
  const value = spellStats[columnKey];

  return typeof value === 'number' ? (
    <NumericValueBody
      maxStats={maxStats}
      stat={columnKey}
      value={value}
      leadingNode={leadingNode}
      trailingNode={trailingNode}
    >
      {children}
    </NumericValueBody>
  ) : (
    <DictionaryBody
      maxStats={maxStats}
      stat={columnKey}
      dictionary={value}
      leadingNode={leadingNode}
      trailingNode={trailingNode}
    >
      {children}
    </DictionaryBody>
  );
}
