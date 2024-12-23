import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';
import styles from './layout.module.css';
import './globals.css';
import LanguageSelector from '@/components/navigation/LanguageSelector';

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
    <html lang={locale}>
      <body className={styles.root}>
        <div className={styles.content}>
          <NextIntlClientProvider messages={messages}>
            <LanguageSelector />
            {children}
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
