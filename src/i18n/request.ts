import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const reqLocale = await requestLocale;

  const locale =
    reqLocale && routing.locales.includes(reqLocale as never)
      ? reqLocale
      : routing.defaultLocale;

  const messagesModule = await import(`../../messages/${locale}.json`);
  const messages = messagesModule.default;

  return {
    locale,
    messages,
  };
});
