'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { virtualTourBookingSchema, type VirtualTourBookingFormData } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface BookingFormProps {
  propertyId?: string;
}

export function BookingForm({ propertyId }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VirtualTourBookingFormData>({
    resolver: zodResolver(virtualTourBookingSchema),
    defaultValues: {
      propertyId: propertyId || '',
    },
  });

  const onSubmit = async (data: VirtualTourBookingFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/virtual-tour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
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
        <CardTitle className="text-2xl">Schedule Your Virtual Tour</CardTitle>
        <p className="text-muted-foreground">
          Fill out the form below and we'll get back to you to confirm your virtual tour appointment.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Full Name *
              </label>
              <Input
                {...register('name')}
                placeholder="John Doe"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address *
              </label>
              <Input
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
            <label className="block text-sm font-medium mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone Number *
            </label>
            <Input
              type="tel"
              {...register('phone')}
              placeholder="+234 915 916 2025"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Preferred Date *
              </label>
              <Input
                type="date"
                {...register('preferredDate')}
                min={new Date().toISOString().split('T')[0]}
                className={errors.preferredDate ? 'border-red-500' : ''}
              />
              {errors.preferredDate && (
                <p className="text-sm text-red-500 mt-1">{errors.preferredDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Preferred Time *
              </label>
              <Input
                type="time"
                {...register('preferredTime')}
                className={errors.preferredTime ? 'border-red-500' : ''}
              />
              {errors.preferredTime && (
                <p className="text-sm text-red-500 mt-1">{errors.preferredTime.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <MessageSquare className="inline h-4 w-4 mr-1" />
              Additional Message (Optional)
            </label>
            <textarea
              {...register('message')}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Any specific areas you'd like to focus on during the tour?"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#efb105] hover:bg-[#d9a004] text-black font-semibold"
            size="lg"
          >
            {isSubmitting ? 'Submitting...' : 'Schedule Virtual Tour'}
          </Button>

          {submitStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-md">
              <CheckCircle className="h-5 w-5" />
              <p>Booking request submitted successfully! We'll contact you shortly to confirm.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p>Something went wrong. Please try again or contact us directly.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

