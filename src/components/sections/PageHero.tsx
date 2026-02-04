'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FadeIn } from '@/components/animations/FadeIn';

interface PageHeroProps {
  title: string;
  description: string;
  backgroundImage?: string;
  backgroundImages?: string[]; // For slider effect
  className?: string;
}

export function PageHero({ 
  title, 
  description, 
  backgroundImage,
  backgroundImages,
  className = ''
}: PageHeroProps) {
  // Use slider if multiple images provided, otherwise single image
  const useSlider = backgroundImages && backgroundImages.length > 1;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!useSlider) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages!.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [useSlider, backgroundImages]);

  const displayImage = useSlider 
    ? backgroundImages![currentIndex] 
    : backgroundImage || '/images/hero/hero-background.jpg';

  return (
    <section className={`relative py-20 bg-gradient-to-br from-black via-[#0a0a0a] to-black text-white overflow-hidden ${className}`}>
      {/* Background Image */}
      {displayImage && (
        <div className="absolute inset-0 z-[0]">
          {useSlider ? (
            <AnimatePresence mode="sync">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={displayImage}
                  alt=""
                  fill
                  className="object-cover"
                  priority
                  quality={75}
                  sizes="100vw"
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <Image
              src={displayImage}
              alt=""
              fill
              className="object-cover"
              priority
              quality={75}
              sizes="100vw"
            />
          )}
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50 z-[1]" />
          {/* Gradient overlay with brand yellow accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#efb105]/10 via-transparent to-transparent z-[1]" />
        </div>
      )}
      
      {/* Gradient overlay fallback */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#efb105]/5 via-transparent to-transparent z-[1]" />
      
      {/* Content */}
      <div className="container px-4 relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {title}
            </h1>
            <p className="text-xl text-slate-300">
              {description}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

