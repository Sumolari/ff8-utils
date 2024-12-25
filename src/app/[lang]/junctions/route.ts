import { getLocale } from 'next-intl/server';
import { permanentRedirect } from '@/i18n/routing';

export async function GET() {
  const locale = await getLocale();
  permanentRedirect({ href: '/junctions/all', locale });
}
