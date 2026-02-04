'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

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

export function Navigation() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ y: -2 }}
            className="relative"
          >
            <Link
              href={item.href}
              className={cn(
                'relative block px-3 py-2 text-sm font-medium transition-all duration-300 rounded-md',
                'hover:text-primary hover:bg-primary/5',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              )}
            >
              <span className="relative z-10" suppressHydrationWarning>{t(item.key, item.href)}</span>
              
              {/* Active indicator underline */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              
              {/* Hover background effect */}
              <motion.div
                className="absolute inset-0 bg-primary/10 rounded-md"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{ borderRadius: 'inherit' }}
              />
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}

