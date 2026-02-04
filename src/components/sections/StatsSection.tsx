'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';
import { Building2, TrendingUp, Award, Users } from 'lucide-react';

const stats = [
  { label: 'Years in Business', value: '6+', icon: Building2 },
  { label: 'Projects Completed', value: '20+', icon: TrendingUp },
  { label: 'Industry Recognition', value: 'Award-Winning', icon: Award },
  { label: 'Employee Owned', value: '100%', icon: Users },
];

export function StatsSection() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-[#efb105] via-[#f5c020] to-[#efb105] text-black relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <FadeIn key={stat.label} delay={index * 0.1}>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4" />
                  <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-sm sm:text-base md:text-lg font-semibold">{stat.label}</div>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

