'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Testimonial } from '@/types';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center mb-4">
          <Quote className="h-8 w-8 text-primary/20 mr-2" />
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < testimonial.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-muted-foreground italic">"{testimonial.content}"</p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center space-x-4">
          {testimonial.image && (
            <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <div className="font-semibold">{testimonial.name}</div>
            <div className="text-sm text-muted-foreground">
              {testimonial.role}
              {testimonial.company && ` at ${testimonial.company}`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

