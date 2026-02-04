'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Testimonial } from '@/types';
import Image from 'next/image';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { PERMISSIONS } from '@/lib/permissions';

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/testimonials');
      if (!response.ok) {
        throw new Error('Failed to load testimonials');
      }
      const data = await response.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      alert('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete testimonial');
      }

      // Reload testimonials
      loadTestimonials();
    } catch (error: any) {
      alert(error.message || 'Failed to delete testimonial');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#efb105]" />
      </div>
    );
  }

  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_TESTIMONIALS}>
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600">Manage client testimonials</p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button className="bg-[#efb105] hover:bg-[#d9a004] text-black">
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">No testimonials yet.</p>
            <Link href="/admin/testimonials/new">
              <Button className="bg-[#efb105] hover:bg-[#d9a004] text-black">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Testimonial
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{testimonial.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  </div>
                  {testimonial.image && (
                    <div className="relative h-12 w-12 rounded-full overflow-hidden ml-4 flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 line-clamp-3 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex space-x-2">
                  <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
                    onClick={() => handleDelete(testimonial.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </PermissionGuard>
  );
}

