'use client';

import { NextUIProvider } from '@nextui-org/react';
import { SpellSelectionProvider } from '@/context/SpellSelectionContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <SpellSelectionProvider>{children}</SpellSelectionProvider>
    </NextUIProvider>
  );
}
