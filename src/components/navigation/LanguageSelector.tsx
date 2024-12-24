'use client';

import { useLocale, useTranslations } from 'next-intl';
import { NavbarItem } from '@nextui-org/navbar';
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import { availableLocales, usePathname, Link } from '@/i18n/routing';
import { ChevronDown } from '@/components/icons/ChevronDown';

export default function LanguageSelector() {
  const pathname = usePathname();
  const t = useTranslations();
  const currentLocale = useLocale();

  const links = Object.entries(availableLocales).map(([locale, name]) => (
    <DropdownItem
      key={locale}
      description={
        currentLocale === locale
          ? t('LanguageSelector.currentLanguageHint')
          : null
      }
      as={Link}
      href={pathname}
      {...{ locale }}
    >
      {name}
    </DropdownItem>
  ));

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Button
            disableRipple
            endContent={<ChevronDown fill="currentColor" size={16} />}
            radius="sm"
            variant="light"
          >
            {t('LanguageSelector.languages')}
          </Button>
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label={t('LanguageSelector.supportedLanguagesList')}
        itemClasses={{
          base: 'gap-4',
        }}
      >
        {links}
      </DropdownMenu>
    </Dropdown>
  );
}
