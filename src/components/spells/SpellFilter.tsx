'use client';

import {
  useDisableAllSpells,
  useSelectAllSpells,
  useSpellSelection,
  useToggleSpell,
} from '@/context/SpellSelectionContext';
import { useAllSpells } from '@/hooks/useAllSpells';
import {
  Button,
  Checkbox,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';

export default function SpellFilter({ className }: { className?: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const t = useTranslations();

  const availableSpells = useAllSpells();
  const selectedSpells = useSpellSelection();
  const toggleSpell = useToggleSpell();
  const disableAllSpells = useDisableAllSpells();
  const selectAllSpells = useSelectAllSpells();

  const fields = availableSpells
    .sort((lhs, rhs) => {
      const lhsName = t(`Spells.${lhs}`);
      const rhsName = t(`Spells.${rhs}`);

      return lhsName.localeCompare(rhsName);
    })
    .map((name) => (
      <Checkbox
        key={name}
        isSelected={selectedSpells.has(name)}
        onValueChange={() => {
          toggleSpell(name);
        }}
        className="block"
      >
        {t(`Spells.${name}`)}
      </Checkbox>
    ));

  return (
    <>
      <Button
        color="default"
        variant="ghost"
        onPress={onOpen}
        className={className}
      >
        {t('SpellFilter.title')}
      </Button>
      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        onOpenChange={onOpenChange}
        placement="bottom-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{t('SpellFilter.title')}</ModalHeader>
              <ModalBody>
                <div className="block columns-2 sm:columns-3">{fields}</div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={selectAllSpells}
                >
                  {t('SpellFilter.actions.selectAll')}
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={disableAllSpells}
                >
                  {t('SpellFilter.actions.disableAll')}
                </Button>
                <Button
                  className="ml-auto"
                  color="primary"
                  variant="ghost"
                  onPress={onClose}
                >
                  {t('SpellFilter.actions.close')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
