'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, type NewsletterFormData } from '@/lib/validations';
import { X, Mail, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  // Show popup after 3 seconds on page load
  useEffect(() => {
    // Check if user has already dismissed it (stored in localStorage)
    const hasSeenPopup = localStorage.getItem('newsletter-popup-dismissed');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

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

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        if (result.requiresVerification) {
          setMessage('Please check your email to verify your subscription.');
        } else {
          setMessage('Thank you for subscribing!');
        }
        reset();
        // Close popup after 3 seconds on success
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        console.error('Newsletter subscription failed:', result);
        setSubmitStatus('error');
        setMessage('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Remember that user dismissed it
    localStorage.setItem('newsletter-popup-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 border-[#efb105]">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close popup"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#efb105]/20 rounded-full blur-xl" />
                    <Gift className="h-12 w-12 text-[#efb105] relative z-10" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  Stay Updated!
                </h2>
                <p className="text-gray-600 mb-6">
                  Subscribe to our newsletter and get exclusive updates on new projects, construction insights, and special offers.
                </p>

                {submitStatus === 'success' ? (
                  <div className="text-green-600 py-4">
                    <Mail className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-semibold">
                      {message || 'Thank you for subscribing!'}
                    </p>
                    {message.includes('verify') && (
                      <p className="text-sm text-gray-600 mt-2">
                        Check your inbox for the verification email.
                      </p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...register('email')}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1 text-left">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#efb105] hover:bg-[#d9a004] text-black font-semibold"
                      size="lg"
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                    </Button>

                    {submitStatus === 'error' && (
                      <p className="text-sm text-red-500">
                        Something went wrong. Please try again.
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Maybe later
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

