import { useTranslations } from 'next-intl';
import { ALL_STATS } from '@/models/stat';
import SpellFilter from '@/components/spells/SpellFilter';
import AllSpellsTable from '@/components/spells/AllSpellsTable';
import H2 from '@/components/typography/H2';
import BestSpellTable from '@/components/spells/BestSpellTable';

export default function Home() {
  const t = useTranslations();

  const bestSpellsSection = ALL_STATS.map((stat) => (
    <BestSpellTable key={stat} stat={stat} />
  ));

  return (
    <>
      <H2 id="all">{t('JuctionsTable.title')}</H2>
      <div className="flex flex-row gap-4 overflow-x-auto">
        <AllSpellsTable />
      </div>

      <H2 id="best">{t('BestJunctionsTable.title')}</H2>
      <SpellFilter className="mb-3" />
      <div className="flex flex-row gap-4 overflow-x-auto">
        {bestSpellsSection}
      </div>
    </>
  );
}
