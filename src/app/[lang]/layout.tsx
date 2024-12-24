import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';
import './globals.css';
import TopNavbar from '@/components/navigation/TopNavbar';
import { Providers } from '../providers';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LocaleLayout' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <TopNavbar />
            <main className="flex items-center justify-center w-full">
              <div className="p-6 w-full relative flex-nowrap items-center justify-between max-w-[1024px]">
                {children}
              </div>
            </main>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
