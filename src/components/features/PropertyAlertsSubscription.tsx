'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { subscribeToAlerts, type PropertyAlert } from '@/lib/property-alerts';

const alertSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  alertTypes: z.array(z.enum(['new', 'price_drop', 'status_change'])).min(1, 'Select at least one alert type'),
  type: z.array(z.string()).optional(),
  location: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
});

type AlertFormData = z.infer<typeof alertSchema>;

export function PropertyAlertsSubscription() {
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
    resolver: zodResolver(alertSchema),
    defaultValues: {
      alertTypes: ['new'],
    },
  });

  const alertTypes = watch('alertTypes') || [];

  const onSubmit = async (data: AlertFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const criteria: PropertyAlert['criteria'] = {};

      if (data.type && data.type.length > 0) {
        criteria.type = data.type;
      }

      if (data.location) {
        criteria.location = data.location.split(',').map((l) => l.trim()).filter(Boolean);
      }

      if (data.minPrice) {
        criteria.minPrice = parseFloat(data.minPrice);
      }

      if (data.maxPrice) {
        criteria.maxPrice = parseFloat(data.maxPrice);
      }

      if (data.bedrooms) {
        criteria.bedrooms = parseInt(data.bedrooms);
      }

      if (data.bathrooms) {
        criteria.bathrooms = parseInt(data.bathrooms);
      }

      const alertId = subscribeToAlerts({
        email: data.email,
        phone: data.phone,
        criteria,
        alertTypes: data.alertTypes as ('new' | 'price_drop' | 'status_change')[],
        isActive: true,
      });

      if (alertId) {
        setSubmitStatus('success');
        reset();
        
        // Show success message for 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
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
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Property Alerts
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get notified when new properties match your criteria, prices drop, or status changes
        </p>
      </CardHeader>
      <CardContent>
        {submitStatus === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Subscribed Successfully!</h3>
            <p className="text-muted-foreground">
              You'll receive email alerts when properties match your criteria.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
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
            </div>

            {/* Alert Types */}
            <div>
              <Label>Alert Types *</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alert-new"
                    checked={alertTypes.includes('new')}
                    onCheckedChange={(checked) => {
                      const current = watch('alertTypes') || [];
                      if (checked && !current.includes('new')) {
                        setValue('alertTypes', [...current, 'new']);
                      } else if (!checked) {
                        setValue('alertTypes', current.filter((t: string) => t !== 'new'));
                      }
                    }}
                  />
                  <Label htmlFor="alert-new" className="font-normal cursor-pointer">
                    New Properties
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alert-price"
                    checked={alertTypes.includes('price_drop')}
                    onCheckedChange={(checked) => {
                      const current = watch('alertTypes') || [];
                      if (checked && !current.includes('price_drop')) {
                        setValue('alertTypes', [...current, 'price_drop']);
                      } else if (!checked) {
                        setValue('alertTypes', current.filter((t: string) => t !== 'price_drop'));
                      }
                    }}
                  />
                  <Label htmlFor="alert-price" className="font-normal cursor-pointer">
                    Price Drops
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alert-status"
                    checked={alertTypes.includes('status_change')}
                    onCheckedChange={(checked) => {
                      const current = watch('alertTypes') || [];
                      if (checked && !current.includes('status_change')) {
                        setValue('alertTypes', [...current, 'status_change']);
                      } else if (!checked) {
                        setValue('alertTypes', current.filter((t: string) => t !== 'status_change'));
                      }
                    }}
                  />
                  <Label htmlFor="alert-status" className="font-normal cursor-pointer">
                    Status Changes
                  </Label>
                </div>
              </div>
              {errors.alertTypes && (
                <p className="text-sm text-red-500 mt-1">{errors.alertTypes.message}</p>
              )}
            </div>

            {/* Search Criteria */}
            <div className="space-y-4">
              <h3 className="font-semibold">Search Criteria (Optional)</h3>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="e.g., Lagos, Abuja, Port Harcourt"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple locations with commas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPrice">Min Price (₦)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    {...register('minPrice')}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice">Max Price (₦)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    {...register('maxPrice')}
                    placeholder="100000000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Min Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    {...register('bedrooms')}
                    placeholder="Any"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Min Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    {...register('bathrooms')}
                    placeholder="Any"
                  />
                </div>
              </div>
            </div>

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">Failed to subscribe. Please try again.</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#efb105] hover:bg-[#d9a004] text-black"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe to Alerts'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

