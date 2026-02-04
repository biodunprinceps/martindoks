import { Testimonial } from '@/types';
import { getTestimonialPlaceholder } from '@/lib/image-placeholders';

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Homeowner',
    company: 'Tech Executive',
    content: 'Working with Martin Doks Homes was an exceptional experience. They delivered beyond our expectations.',
    image: getTestimonialPlaceholder(), // Replace with '/images/testimonials/john-smith.jpg' when available
    rating: 5,
  },
];

