import { useTranslations } from 'next-intl';
import H2 from '@/components/typography/H2';
import JunctionsBuilder from '@/components/spells/JuctionsBuilder';
import SpellFilter from '@/components/spells/SpellFilter';

export default function Home() {
  const t = useTranslations();

  return (
    <>
      <H2 id="best">{t('JunctionsBuilder.title')}</H2>
      <SpellFilter className="mb-3" />
      <div className="flex flex-row gap-4 overflow-x-auto">
        <JunctionsBuilder />
      </div>
    </>
  );
}
