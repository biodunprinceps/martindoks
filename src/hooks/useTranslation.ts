'use client';

import { useState, useEffect } from 'react';
import { getLanguage, setLanguage, t as translate, type Language } from '@/lib/i18n';

/**
 * React hook for translations
 * Provides reactive translation function that updates when language changes
 * Prevents hydration mismatch by starting with 'en' and updating after mount
 */
export function useTranslation() {
  // Always start with 'en' to match server-side rendering
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted flag and load language from storage after hydration
    setMounted(true);
    const storedLang = getLanguage();
    setCurrentLang(storedLang);
    
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = storedLang;
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Listen for language changes
    const handleStorageChange = () => {
      setCurrentLang(getLanguage());
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check periodically (for same-tab changes)
    const interval = setInterval(() => {
      const newLang = getLanguage();
      if (newLang !== currentLang) {
        setCurrentLang(newLang);
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentLang, mounted]);

  const t = (key: string, fallback?: string): string => {
    // Use current language if mounted, otherwise default to 'en' for SSR
    const lang = mounted ? currentLang : 'en';
    return translate(key, fallback, lang);
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setCurrentLang(lang);
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  return {
    t,
    currentLanguage: currentLang,
    changeLanguage,
    mounted,
  };
}

