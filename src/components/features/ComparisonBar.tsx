'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, GitCompare } from 'lucide-react';
import { getComparison, clearComparison } from '@/lib/property-client-storage';

export function ComparisonBar() {
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const updateComparison = () => {
      const ids = getComparison();
      setComparisonIds(ids);
      setIsVisible(ids.length > 0);
    };

    updateComparison();

    window.addEventListener('comparison-changed', updateComparison);

    return () => {
      window.removeEventListener('comparison-changed', updateComparison);
    };
  }, []);

  const handleCompare = () => {
    router.push('/compare');
  };

  const handleClear = () => {
    clearComparison();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-[#efb105]" />
                <span className="font-semibold">
                  {comparisonIds.length} {comparisonIds.length === 1 ? 'property' : 'properties'} selected
                </span>
              </div>
              <Button
                onClick={handleCompare}
                className="bg-[#efb105] hover:bg-[#d9a004] text-black"
              >
                Compare Now
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

