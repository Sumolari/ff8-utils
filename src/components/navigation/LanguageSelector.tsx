'use client';

import { availableLocales, Link, usePathname } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import classname from 'classnames';
import styles from './LanguageSelector.module.css';

export default function LanguageSelector() {
  const pathname = usePathname();
  const t = useTranslations();
  const currentLocale = useLocale();

  const links = Object.entries(availableLocales).map(([locale, name]) => (
    <Link
      href={pathname}
      className={classname(styles.link, {
        [styles.active]: locale === currentLocale,
      })}
      key={locale}
      locale={locale}
    >
      {name}
    </Link>
  ));

  return (
    <nav className={styles.root}>
      <span className={styles.label}>{t('LocaleLayout.languages')}</span>
      {links}
    </nav>
  );
}
