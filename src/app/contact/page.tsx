'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/validations';
import { FadeIn } from '@/components/animations/FadeIn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, MessageSquare, CheckCircle, AlertCircle, User } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
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
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background/95 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#efb105]/5 via-transparent to-transparent" />
        <div className="container px-4 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Contact Us</h1>
              <p className="text-xl text-muted-foreground">
                Let&apos;s work together. Get in touch with us to discuss your project needs.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <MapPin className="h-8 w-8 text-[#efb105] mb-4" />
                  <CardTitle>Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Block V, Plot 2 Land Bridge Ave.<br />
                    Abila Abiodun Oniru Rd, Lagos
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader>
                  <Phone className="h-8 w-8 text-[#efb105] mb-4" />
                  <CardTitle>Phone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      <a href="tel:+2349139694471" className="hover:text-[#efb105] transition-colors block">
                        +2349139694471
                      </a>
                    </p>
                    <p>
                      <a href="tel:+2349159162025" className="hover:text-[#efb105] transition-colors block">
                        +2349159162025
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card>
                <CardHeader>
                  <Mail className="h-8 w-8 text-[#efb105] mb-4" />
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    <a href="mailto:info@martindokshomes.com" className="hover:text-[#efb105] transition-colors">
                      info@martindokshomes.com
                    </a>
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and we&apos;ll get back to you as soon as possible.
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
                        Phone Number (Optional)
                      </label>
                      <Input
                        type="tel"
                        {...register('phone')}
                        placeholder="+234 915 916 2025"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <MessageSquare className="inline h-4 w-4 mr-1" />
                        Message *
                      </label>
                      <textarea
                        {...register('message')}
                        rows={6}
                        className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.message ? 'border-red-500' : ''}`}
                        placeholder="Tell us about your project or inquiry..."
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#efb105] hover:bg-[#d9a004] text-black font-semibold"
                      size="lg"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>

                    {submitStatus === 'success' && (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 rounded-md">
                        <CheckCircle className="h-5 w-5" />
                        <p>Message sent successfully! We&apos;ll get back to you soon.</p>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 rounded-md">
                        <AlertCircle className="h-5 w-5" />
                        <p>Something went wrong. Please try again or contact us directly.</p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
