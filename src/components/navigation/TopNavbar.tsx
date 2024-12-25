'use client';

import { useTranslations } from 'next-intl';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/navbar';
import LanguageSelector from './LanguageSelector';
import { Link } from '@/i18n/routing';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { ChevronDown } from '@/components/icons/ChevronDown';

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
      <NavbarContent justify="end">
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                endContent={<ChevronDown fill="currentColor" size={16} />}
                radius="sm"
                variant="light"
              >
                {t('TopNavbar.items.junctions')}
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label={t('LanguageSelector.supportedLanguagesList')}
            itemClasses={{
              base: 'gap-4',
            }}
          >
            <DropdownItem key="/junctions/all" as={Link} href="/junctions/all">
              {t('TopNavbar.items.allJunctions')}
            </DropdownItem>
            <DropdownItem
              key="/junctions/best"
              as={Link}
              href="/junctions/best"
            >
              {t('TopNavbar.items.bestJunctions')}
            </DropdownItem>
            <DropdownItem
              key="/junctions/builder"
              as={Link}
              href="/junctions/builder"
            >
              {t('TopNavbar.items.junctionsBuilder')}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <LanguageSelector />
      </NavbarContent>
    </Navbar>
  );
}
