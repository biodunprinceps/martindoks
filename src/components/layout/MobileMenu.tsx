'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher';

const navItems = [
  { href: '/', key: 'page.home' },
  { href: '/about', key: 'page.about' },
  { href: '/services', key: 'page.services' },
  { href: '/portfolio', key: 'page.portfolio' },
  { href: '/listings', key: 'page.listings' },
  { href: '/mortgage-calculator', key: 'page.calculator' },
  { href: '/team', key: 'page.team' },
  { href: '/blog', key: 'page.blog' },
  { href: '/testimonials', key: 'page.testimonials' },
  { href: '/brand-associates', key: 'nav.brandAssociates' },
  { href: '/contact', key: 'page.contact' },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="md:hidden">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="relative"
        >
          <motion.div
            animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.div>
        </Button>
      </motion.div>

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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.3,
                type: 'spring',
                stiffness: 300,
                damping: 30
              }}
              className="absolute top-full left-0 right-0 bg-background border-b shadow-xl z-50 overflow-hidden md:hidden"
            >
              <div className="p-4 border-b">
                <LanguageSwitcher />
              </div>
              <nav className="flex flex-col p-4 space-y-1">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ 
                        delay: index * 0.05,
                        type: 'spring',
                        stiffness: 300,
                        damping: 25
                      }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'relative block text-base font-medium transition-all duration-200 py-3 px-4 rounded-lg',
                          'hover:bg-primary/10 active:scale-95',
                          isActive 
                            ? 'text-primary bg-primary/10 font-semibold' 
                            : 'text-muted-foreground hover:text-primary'
                        )}
                      >
                        <span className="relative z-10" suppressHydrationWarning>{t(item.key, item.href)}</span>
                        
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeMobileNavIndicator"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                            initial={false}
                            transition={{
                              type: 'spring',
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

