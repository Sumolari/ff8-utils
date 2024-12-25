import { useTranslations } from 'next-intl';
import SpellFilter from '@/components/spells/SpellFilter';
import H2 from '@/components/typography/H2';
import BestSpellsTables from '@/components/spells/BestSpellsTables';

export default function Home() {
  const t = useTranslations();

  return (
    <>
      <H2 id="best">{t('BestJunctionsTable.title')}</H2>
      <SpellFilter className="mb-3" />
      <div className="flex flex-row gap-4 overflow-x-auto">
        <BestSpellsTables />
      </div>
    </>
  );
}
