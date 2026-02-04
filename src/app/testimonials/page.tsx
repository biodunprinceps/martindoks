'use client';

import { useState, useEffect } from 'react';
import { TestimonialCard } from '@/components/features/TestimonialCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { testimonials as staticTestimonials } from '@/data/testimonials';
import { Testimonial } from '@/types';
import { Star, Loader2 } from 'lucide-react';

export default function TestimonialsPage() {
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(staticTestimonials);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch all testimonials (static + dynamic) from API
    const loadTestimonials = async () => {
      try {
        const response = await fetch('/api/admin/testimonials');
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
      } catch (error) {
        console.error('Error loading testimonials:', error);
        // Fallback to static testimonials
        setAllTestimonials(staticTestimonials);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background/95 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#efb105]/5 via-transparent to-transparent" />
        <div className="container px-4 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Client Testimonials
              </h1>
              <p className="text-xl text-muted-foreground">
                Hear from our satisfied clients about their experience working with Martin Doks Homes
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="container px-4">
          {isLoading ? (
            <FadeIn>
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#efb105] mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">Loading testimonials...</p>
              </div>
            </FadeIn>
          ) : allTestimonials.length === 0 ? (
            <FadeIn>
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  Client testimonials will be displayed here.
                </p>
              </div>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allTestimonials.map((testimonial, index) => (
                <FadeIn key={testimonial.id} delay={index * 0.1}>
                  <TestimonialCard testimonial={testimonial} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

