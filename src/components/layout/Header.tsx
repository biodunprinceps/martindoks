'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher';
import { useTheme } from '@/components/theme/ThemeProvider';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { resolvedTheme } = useTheme();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  // Use white logo in dark mode, black logo in light mode
  const logoSrc = resolvedTheme === 'dark' 
    ? '/images/team/MDH white logo .png'
    : '/images/team/MD3 black logo.png';

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        height: isScrolled ? '3.5rem' : '4rem',
      }}
      transition={{ 
        duration: 0.3,
        ease: 'easeOut',
        height: { duration: 0.3 }
      }}
      className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-background via-background/98 to-background backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm"
    >
      <div className="container flex h-full items-center justify-between px-3 sm:px-4 lg:px-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={cn(
            'transition-all duration-300',
            isScrolled ? 'scale-90' : 'scale-100'
          )}
        >
          <Link href="/" className="flex items-center">
            <Image
              src={logoSrc}
              alt="Martin Doks Homes"
              width={150}
              height={50}
              className="h-auto object-contain transition-all duration-300"
              priority
              style={{
                maxWidth: isScrolled 
                  ? 'clamp(100px, 20vw, 120px)' 
                  : 'clamp(120px, 25vw, 150px)',
                width: 'auto',
                height: 'auto',
              }}
            />
          </Link>
        </motion.div>

        <Navigation />

        <div className="flex items-center space-x-3 sm:space-x-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block"
          >
            <LanguageSwitcher />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              href="/virtual-tour" 
              variant="outline" 
              className="hidden md:inline-flex border-[#efb105] text-[#efb105] hover:bg-[#efb105] hover:text-black transition-all duration-300"
            >
              Virtual Tour
            </Button>
          </motion.div>
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
}

