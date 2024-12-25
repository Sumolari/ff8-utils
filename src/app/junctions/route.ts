import { permanentRedirect } from '@/i18n/routing';

export async function GET() {
  permanentRedirect({ href: '/junctions/all', locale: 'en' });
}
