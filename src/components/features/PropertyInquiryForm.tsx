'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Property } from '@/types/property';
import { Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const propertyInquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  inquiryType: z.enum(['general', 'viewing', 'pricing', 'financing']),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type PropertyInquiryFormData = z.infer<typeof propertyInquirySchema>;

interface PropertyInquiryFormProps {
  property: Property;
  onSuccess?: () => void;
}

export function PropertyInquiryForm({ property, onSuccess }: PropertyInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PropertyInquiryFormData>({
    resolver: zodResolver(propertyInquirySchema),
    defaultValues: {
      inquiryType: 'general',
    },
  });

  const inquiryType = watch('inquiryType');
  const showScheduleFields = inquiryType === 'viewing';

  const onSubmit = async (data: PropertyInquiryFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          message: `Property Inquiry: ${property.title}\n\n${data.message}\n\nProperty Details:\n- Location: ${property.location}\n${property.price ? `- Price: ₦${property.price.toLocaleString()}\n` : ''}- Type: ${property.type}\n- Status: ${property.status}`,
          propertyId: property.id,
          propertyTitle: property.title,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        if (onSuccess) onSuccess();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Inquire About This Property</CardTitle>
        <p className="text-sm text-muted-foreground">
          {property.title} - {property.location}
        </p>
      </CardHeader>
      <CardContent>
        {submitStatus === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-muted-foreground">
              We've received your inquiry and will get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="John Doe"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+234 800 000 0000"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="inquiryType">Inquiry Type *</Label>
              <select
                id="inquiryType"
                {...register('inquiryType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#efb105]"
              >
                <option value="general">General Inquiry</option>
                <option value="viewing">Schedule a Viewing</option>
                <option value="pricing">Pricing Information</option>
                <option value="financing">Financing Options</option>
              </select>
            </div>

            {showScheduleFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="preferredDate">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Preferred Date
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    {...register('preferredDate')}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    {...register('preferredTime')}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="message">Message *</Label>
              <textarea
                id="message"
                {...register('message')}
                rows={4}
                placeholder="Tell us more about your inquiry..."
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#efb105] ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
              )}
            </div>

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to submit. Please try again.</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#efb105] hover:bg-[#d9a004] text-black"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  {inquiryType === 'viewing' ? 'Schedule Viewing' : 'Send Inquiry'}
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

