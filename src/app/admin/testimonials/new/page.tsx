'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  company: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  rating: z.number().min(1).max(5),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

export default function NewTestimonialPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      rating: 5,
    },
  });

  const rating = watch('rating');

  const onSubmit = async (data: TestimonialFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          image: image || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create testimonial');
      }

      router.push('/admin/testimonials');
    } catch (error: any) {
      alert(error.message || 'Failed to create testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/testimonials">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Testimonial</h1>
          <p className="text-gray-600">Add a client testimonial</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Testimonial Information</span>
                  <span className="text-xs font-normal text-muted-foreground">(Client details)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Client's Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="e.g., John Smith"
                    className={`text-base ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    Enter the full name of the person giving the testimonial.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Client's Role or Position <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('role')}
                    placeholder="e.g., Homeowner, Business Owner, Property Investor"
                    className={`text-base ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.role && (
                    <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    What is their role? Examples: "Homeowner", "Business Owner", "Property Investor"
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Company or Organization
                    <span className="text-xs font-normal text-gray-500 ml-2">(Optional)</span>
                  </label>
                  <Input
                    {...register('company')}
                    placeholder="e.g., ABC Corporation, Self-Employed, or leave blank"
                    className={`text-base ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.company && (
                    <p className="text-sm text-red-500 mt-1">{errors.company.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    Only include if relevant. Leave blank if not applicable.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Testimonial Text <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('content')}
                    rows={8}
                    placeholder="Write what the client said about their experience. For example:

'Working with Martin Doks Homes was an exceptional experience. From the initial consultation to the final handover, their team demonstrated professionalism, attention to detail, and genuine care for our project. The quality of work exceeded our expectations, and we couldn't be happier with our new home.'"
                    className={`w-full px-3 py-2 border rounded-md text-base leading-relaxed ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-3 rounded border border-blue-200">
                    ✍️ <strong>Writing Tips:</strong>
                    <br />• Write in first person (as if the client is speaking)
                    <br />• Be authentic and specific
                    <br />• Mention specific services or features they appreciated
                    <br />• Keep it genuine - real testimonials are more effective
                    <br />• Aim for 2-4 sentences for best impact
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Client Rating <span className="text-red-500">*</span>
                    <span className="text-xs font-normal text-gray-500 ml-2">(How many stars?)</span>
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue('rating', value)}
                        className={`p-3 rounded-lg text-2xl transition-all ${
                          rating >= value
                            ? 'bg-yellow-100 text-yellow-600 scale-110'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        } hover:scale-105`}
                        title={`${value} star${value > 1 ? 's' : ''}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-3 text-base font-medium text-gray-700">
                      {rating} out of 5 {rating === 1 ? 'star' : 'stars'}
                    </span>
                  </div>
                  <input
                    type="hidden"
                    {...register('rating', { valueAsNumber: true })}
                  />
                  {errors.rating && (
                    <p className="text-sm text-red-500 mt-1">{errors.rating.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    Click the stars above to select the rating. Most testimonials are 4 or 5 stars.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={image}
                  onChange={setImage}
                  folder="testimonials"
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#efb105] hover:bg-[#d9a004] text-black"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Creating...' : 'Create Testimonial'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

