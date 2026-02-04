'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Property } from '@/types/property';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '2349139694471'; // Remove leading + for URL

// Official WhatsApp SVG Icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16 0C7.164 0 0 7.164 0 16c0 2.825.74 5.473 2.031 7.771L0 32l8.467-2.031C10.698 31.26 13.23 32 16 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.333c-2.347 0-4.555-.612-6.467-1.68l-.453-.213-4.72 1.131 1.131-4.587-.213-.453c-1.067-1.947-1.68-4.155-1.68-6.502 0-7.364 5.989-13.333 13.333-13.333S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.307-10.16l-2.027-.933c-.16-.08-.373-.133-.56.08l-1.24 1.467c-.213.213-.427.16-.72-.053-1.84-1.013-3.04-1.52-4.24-2.533-.747-.667-1.253-1.493-1.76-2.32-.213-.373-.027-.587.16-.853l1.467-1.84c.16-.213.08-.427-.053-.56l-1.947-2.027c-.213-.213-.56-.453-.853-.24l-2.453 1.2c-.853.427-1.44 1.333-1.44 2.293 0 1.467.747 2.933 1.84 4.133 2.24 2.453 4.96 3.84 7.947 4.48.96.24 1.84.16 2.667-.32l2.453-1.467c.373-.213.56-.64.347-1.013z" />
  </svg>
);

interface PropertyWhatsAppButtonProps {
  property: Property;
  variant?: 'floating' | 'inline';
  className?: string;
}

export function PropertyWhatsAppButton({ 
  property, 
  variant = 'inline',
  className = '' 
}: PropertyWhatsAppButtonProps) {
  // Create pre-filled message with property details
  const priceText = property.price ? `💰 ₦${property.price.toLocaleString()}\n` : '';
  const message = `Hello! I'm interested in this property:\n\n*${property.title}*\n📍 ${property.location}\n${priceText}\nCould you please provide more information?`;
  
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="fixed bottom-20 right-4 sm:right-6 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center rounded-full h-14 w-14 sm:h-16 sm:w-16 bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg hover:shadow-2xl transition-all duration-300"
            aria-label="Chat about this property on WhatsApp"
          >
            <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                Chat about this property
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg transition-colors ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span>Chat on WhatsApp</span>
    </Link>
  );
}

