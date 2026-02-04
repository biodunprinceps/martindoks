'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Floating Toggle Button - Top Right */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed top-16 sm:top-20 right-3 sm:right-4 md:right-6 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size="icon"
            className={cn(
              'h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full shadow-lg',
              'bg-primary hover:bg-primary/90',
              'text-primary-foreground',
              'border-2 border-background',
              'transition-all duration-300'
            )}
            aria-label="Toggle theme"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            </motion.div>
          </Button>

          {/* Theme Options Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-40"
                />

                {/* Options Menu */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
                  className={cn(
                    'absolute top-12 right-0',
                    'bg-card border border-border rounded-lg shadow-xl',
                    'p-2 min-w-[140px]',
                    'z-50'
                  )}
                >
                  {themes.map((themeOption) => {
                    const Icon = themeOption.icon;
                    const isActive = theme === themeOption.value;
                    return (
                      <motion.button
                        key={themeOption.value}
                        onClick={() => handleThemeChange(themeOption.value)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-md',
                          'text-sm font-medium transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          isActive && 'bg-accent text-accent-foreground'
                        )}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{themeOption.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeTheme"
                            className="ml-auto h-2 w-2 rounded-full bg-primary"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

