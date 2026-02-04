'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, ChevronLeft, ChevronRight } from 'lucide-react';

// Hero images array - add all your images here
const heroImages = [
  '/images/hero/hero-background.jpg',
  '/images/hero/c32bf24f-d5a6-4ab6-a5c5-da28b1403a8d.jpeg',
  '/images/hero/IMG-20240124-WA0008.jpg',
  '/images/hero/IMG-20240124-WA0010.jpg',
  '/images/hero/IMG-20240124-WA0011.jpg',
  '/images/hero/IMG-20240124-WA0012.jpg',
  '/images/hero/IMG-20240124-WA0015.jpg',
  '/images/hero/IMG-20240124-WA0016.jpg',
  '/images/hero/IMG-20240124-WA0023.jpg',
  '/images/hero/IMG-20240124-WA0029.jpg',
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [nextIndex, setNextIndex] = useState(1);

  // Preload next image
  useEffect(() => {
    const next = (currentIndex + 1) % heroImages.length;
    setNextIndex(next);
    
    // Preload next image
    const img = new window.Image();
    img.src = heroImages[next];
  }, [currentIndex]);

  // Auto-advance slider
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Fallback gradient background */}
      <div className="absolute inset-0 z-[0] bg-gradient-to-br from-black via-[#0a0a0a] to-black" />
      
      {/* Image Slider */}
      <div className="absolute inset-0 z-[1]">
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
              src={heroImages[currentIndex]}
              alt={`Luxury Home ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0 || currentIndex === 1}
              loading={currentIndex <= 1 ? "eager" : "lazy"}
              quality={75}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Preload next image */}
        {nextIndex !== currentIndex && (
          <div className="absolute inset-0 opacity-0 pointer-events-none">
            <Image
              src={heroImages[nextIndex]}
              alt=""
              fill
              className="object-cover"
              quality={75}
              sizes="100vw"
            />
          </div>
        )}
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-[2]" />
        {/* Gradient overlay with brand yellow accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/50 z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#efb105]/10 via-transparent to-transparent z-[2]" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-300 hover:scale-110 touch-manipulation"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-300 hover:scale-110 touch-manipulation"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 touch-manipulation ${
              index === currentIndex
                ? 'w-6 sm:w-8 bg-[#efb105]'
                : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Animated background elements (subtle) */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content - Above all background layers */}
      <div className="relative z-20 container px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <Home className="h-8 w-8 text-primary mr-2" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Luxury Real Estate
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2"
          >
            Build Your Home
            <br />
            <span className="text-primary">With The People You Trust</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-6 sm:mb-10 max-w-2xl mx-auto px-4"
          >
            A beacon of innovation and excellence in Nigeria's construction landscape, 
            delivering reliable solutions with over a decade of expertise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full px-4"
          >
            <Button 
              href="/portfolio" 
              size="lg" 
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-[#efb105] hover:bg-[#d9a004] text-black font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Explore Portfolio
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              href="/virtual-tour" 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-transparent border-[#efb105] text-[#efb105] hover:bg-[#efb105] hover:text-black transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Schedule Virtual Tour
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

