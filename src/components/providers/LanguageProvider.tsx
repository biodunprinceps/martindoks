'use client';

import { useEffect } from 'react';
import { getLanguage } from '@/lib/i18n';

/**
 * Language Provider - Updates HTML lang attribute based on current language
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set initial language
    const lang = getLanguage();
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, []);

  return <>{children}</>;
}

