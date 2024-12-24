'use client';

import { useTranslations } from 'next-intl';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/navbar';
import { Link } from '@nextui-org/link';
import LanguageSelector from './LanguageSelector';

export default function TopNavbar() {
  const t = useTranslations();

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="hidden sm:flex font-bold text-inherit">
          {t('TopNavbar.title.long')}
        </p>
        <p className="sm:hidden font-bold text-inherit">
          {t('TopNavbar.title.short')}
        </p>
      </NavbarBrand>
      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="#all">{t('TopNavbar.items.allJunctions')}</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#best">{t('TopNavbar.items.bestJunctions')}</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <LanguageSelector />
      </NavbarContent>
    </Navbar>
  );
}
