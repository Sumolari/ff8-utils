import { useTranslations } from 'next-intl';
import AllSpellsTable from '@/components/spells/AllSpellsTable';
import H2 from '@/components/typography/H2';

export default function Home() {
  const t = useTranslations();

  return (
    <>
      <H2>{t('JuctionsTable.title')}</H2>
      <div className="flex flex-row gap-4 overflow-x-auto">
        <AllSpellsTable />
      </div>
    </>
  );
}