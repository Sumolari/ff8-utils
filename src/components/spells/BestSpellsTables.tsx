import { ALL_STATS } from '@/models/stat';
import BestSpellTable from '@/components/spells/BestSpellTable';

export default function BestSpellsTables() {
  const bestSpellsSection = ALL_STATS.map((stat) => (
    <BestSpellTable key={stat} stat={stat} />
  ));

  return <>{bestSpellsSection}</>;
}
