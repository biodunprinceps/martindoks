'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, Tag, X } from 'lucide-react';
import { format } from 'date-fns';
import { FormattedText } from '@/components/ui/FormattedText';

interface BlogPreviewProps {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  publishedAt?: Date;
  onClose: () => void;
}

export function BlogPreview({
  title,
  excerpt,
  content,
  author,
  featuredImage,
  category,
  tags,
  publishedAt,
  onClose,
}: BlogPreviewProps) {
  // Keyboard shortcut: ESC to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">Preview</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-2"
            title="Press ESC to close"
          >
            <X className="h-4 w-4" />
            Close (ESC)
          </Button>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          {/* Hero Image */}
          {featuredImage && (
            <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={featuredImage}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title || 'Untitled Post'}</h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{author || 'Author'}</span>
            </div>
            {publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(publishedAt, 'MMMM d, yyyy')}</span>
              </div>
            )}
            {category && (
              <div className="px-3 py-1 bg-[#efb105]/10 text-[#efb105] rounded-full text-xs font-medium">
                {category}
              </div>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm"
                >
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          )}

          {/* Excerpt */}
          {excerpt && (
            <div className="text-lg text-muted-foreground mb-8 leading-relaxed border-l-4 border-[#efb105] pl-4 italic">
              {excerpt}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              <FormattedText content={content || 'No content yet...'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

