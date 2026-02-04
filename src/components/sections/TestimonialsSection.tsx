'use client';

import { useState, useEffect } from 'react';
import { TestimonialCard } from '@/components/features/TestimonialCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { testimonials as staticTestimonials } from '@/data/testimonials';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Testimonial } from '@/types';
import { TestimonialCardSkeleton } from '@/components/ui/skeleton';

export function TestimonialsSection() {
  // Start with static testimonials immediately for instant rendering
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(staticTestimonials);

  useEffect(() => {
    // Fetch additional testimonials from API in the background
    const loadTestimonials = async () => {
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Use no-store to always get fresh data, especially after admin uploads
        const response = await fetch('/api/admin/testimonials', {
          signal: controller.signal,
          cache: 'no-store', // Always fetch fresh data
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const testimonials = data.testimonials || [];
          
          // Combine with static testimonials and remove duplicates
          const combined = [...testimonials, ...staticTestimonials];
          const uniqueTestimonials = combined.reduce((acc, current) => {
            if (!acc.find((t: Testimonial) => t.id === current.id)) {
              acc.push(current);
            }
            return acc;
          }, [] as Testimonial[]);
          
          setAllTestimonials(uniqueTestimonials);
        }
      } catch (error: any) {
        // Silently fail - we already have static testimonials displayed
        if (error.name !== 'AbortError') {
          console.error('Error loading testimonials:', error);
        }
      }
    };

    // Load testimonials after initial render
    loadTestimonials();
  }, []);

  const featuredTestimonials = allTestimonials.slice(0, 3);

  return (
    <section className="py-16 bg-gradient-to-b from-muted/50 via-background to-muted/50">
      <div className="container px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from satisfied clients about their experience working with Martin Doks Homes
            </p>
          </div>
        </FadeIn>

        {featuredTestimonials.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredTestimonials.map((testimonial, index) => (
                <FadeIn key={testimonial.id} delay={index * 0.1}>
                  <TestimonialCard testimonial={testimonial} />
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.4}>
              <div className="text-center">
                <Button href="/testimonials" variant="outline" size="lg">
                  View All Testimonials
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </FadeIn>
          </>
        ) : (
          <FadeIn>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Client testimonials will be displayed here.
              </p>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

