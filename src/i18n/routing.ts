import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const availableLocales = {
  es: 'Español',
  en: 'English',
};

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'es',

  pathnames: {
    '/junctions': {
      en: '/junctions',
      es: '/enlaces',
    },

    '/junctions/all': {
      en: '/junctions/all',
      es: '/enlaces/todos',
    },

    '/junctions/best': {
      en: '/junctions/best',
      es: '/enlaces/mejores',
    },
  },
});

export type Locale = (typeof routing.locales)[number];

export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
  permanentRedirect,
} = createNavigation(routing);
