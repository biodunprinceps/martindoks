'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle, Loader2, Bell } from 'lucide-react';

const alertFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  alertTypes: z.array(z.enum(['new', 'price', 'status'])).min(1, 'Select at least one alert type'),
  criteria: z.object({
    type: z.array(z.string()).optional(),
    status: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
  }).optional(),
});

type AlertFormData = z.infer<typeof alertFormSchema>;

export function PropertyAlertsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AlertFormData>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      alertTypes: [],
      criteria: {},
    },
  });

  const alertTypes = watch('alertTypes') || [];

  const toggleAlertType = (type: 'new' | 'price' | 'status') => {
    const current = alertTypes || [];
    if (current.includes(type)) {
      setValue('alertTypes', current.filter((t) => t !== type));
    } else {
      setValue('alertTypes', [...current, type]);
    }
  };

  const onSubmit = async (data: AlertFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/property-alerts', {
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
        <CardTitle className="text-2xl flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Set Up Property Alerts
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get notified when properties matching your criteria are added or updated
        </p>
      </CardHeader>
      <CardContent>
        {submitStatus === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Alert Set Up Successfully!</h3>
            <p className="text-muted-foreground">
              We'll notify you when properties matching your criteria are available.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="your@email.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+234 800 000 0000"
              />
            </div>

            <div>
              <Label>Alert Types *</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertTypes.includes('new')}
                    onChange={() => toggleAlertType('new')}
                    className="rounded"
                  />
                  <span>New properties matching my criteria</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertTypes.includes('price')}
                    onChange={() => toggleAlertType('price')}
                    className="rounded"
                  />
                  <span>Price changes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertTypes.includes('status')}
                    onChange={() => toggleAlertType('status')}
                    className="rounded"
                  />
                  <span>Status changes (e.g., available to sold)</span>
                </label>
              </div>
              {errors.alertTypes && (
                <p className="text-sm text-red-500 mt-1">{errors.alertTypes.message}</p>
              )}
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
              <h4 className="font-semibold">Filter Criteria (Optional)</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPrice">Min Price (₦)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    {...register('criteria.minPrice', { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice">Max Price (₦)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    {...register('criteria.maxPrice', { valueAsNumber: true })}
                    placeholder="No limit"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Min Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    {...register('criteria.bedrooms', { valueAsNumber: true })}
                    placeholder="Any"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Min Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    {...register('criteria.bathrooms', { valueAsNumber: true })}
                    placeholder="Any"
                  />
                </div>
              </div>
            </div>

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to set up alert. Please try again.</span>
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
                  Setting up...
                </>
              ) : (
                <>
                  <Bell className="mr-2 h-4 w-4" />
                  Set Up Alert
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

