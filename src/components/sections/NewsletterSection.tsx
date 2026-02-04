'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, type NewsletterFormData } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

export function NewsletterSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/newsletter', {
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
    <section className="py-12 sm:py-16 bg-gradient-to-br from-black via-[#0a0a0a] to-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[#efb105]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[#efb105]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="container px-4 relative z-10">
        <FadeIn>
          <Card className="bg-gradient-to-r from-[#efb105]/20 via-[#efb105]/15 to-[#efb105]/20 border-[#efb105]/30 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="max-w-2xl mx-auto text-center">
                <div className="flex justify-center mb-4">
                  <Mail className="h-12 w-12 text-[#efb105]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Stay Updated
                </h2>
                <p className="text-lg text-slate-300 mb-8">
                  Subscribe to our newsletter for weekly updates, project news, and industry insights.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...register('email')}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-[#efb105]"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400 mt-1 text-left">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#efb105] hover:bg-[#d9a004] text-black font-semibold"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>

                {submitStatus === 'success' && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <p>Successfully subscribed! Check your email.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <p>Something went wrong. Please try again.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}

