'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { SEOTools } from '@/components/admin/SEOTools';
import { ArrowLeft, Save, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Property } from '@/types/property';

const propertySchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  price: z.string().optional(),
  type: z.enum(['construction', 'rent', 'sale', 'land']),
  status: z.enum(['ongoing', 'completed', 'upcoming']),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  squareFeet: z.string().optional(),
  virtualTourUrl: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [currency, setCurrency] = useState<'NGN' | 'USD' | 'EUR' | 'GBP'>('NGN');
  const [priceValue, setPriceValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  // Watch form values for SEO analysis
  const formValues = watch();

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/properties/${id}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to load property (${response.status})`);
      }
      const data = await response.json();
      const property = data.property;

      if (!property) {
        throw new Error('Property data is missing');
      }

      // Extract currency and price value from existing price
      let extractedPrice = '';
      let detectedCurrency: 'NGN' | 'USD' | 'EUR' | 'GBP' = 'NGN';
      
      if (property.price) {
        // Check if it's a currency format or "Contact for Pricing"
        if (property.price.includes('₦')) {
          detectedCurrency = 'NGN';
          extractedPrice = property.price.replace(/[₦,]/g, '').trim();
        } else if (property.price.includes('$')) {
          detectedCurrency = 'USD';
          extractedPrice = property.price.replace(/[$,]/g, '').trim();
        } else if (property.price.includes('€')) {
          detectedCurrency = 'EUR';
          extractedPrice = property.price.replace(/[€,]/g, '').trim();
        } else if (property.price.includes('£')) {
          detectedCurrency = 'GBP';
          extractedPrice = property.price.replace(/[£,]/g, '').trim();
        } else if (!property.price.toLowerCase().includes('contact')) {
          // Try to extract numbers if no currency symbol
          extractedPrice = property.price.replace(/[,]/g, '').trim();
        }
      }

      // Format the extracted price with commas
      const formatNumberWithCommas = (value: string): string => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      };

      setCurrency(detectedCurrency);
      setPriceValue(formatNumberWithCommas(extractedPrice));

      // Reset form with property data
      reset({
        slug: property.slug,
        title: property.title,
        description: property.description,
        location: property.location,
        price: property.price || '',
        type: property.type || 'construction',
        status: property.status,
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        squareFeet: property.squareFeet?.toString() || '',
        virtualTourUrl: property.virtualTourUrl || '',
      });
      
      setFeaturedImage(property.featuredImage || '');
      setImages(property.images?.filter((img: string) => img !== property.featuredImage) || []);
    } catch (error: any) {
      console.error('Error loading property:', error);
      alert(error.message || 'Failed to load property. Please try again.');
      router.push('/admin/properties');
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = (url: string) => {
    if (url && !images.includes(url)) {
      setImages([...images, url]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const formatNumberWithCommas = (value: string): string => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');
    // Add commas for thousands
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Check if it's "Contact for Pricing" or similar text
    if (value.toLowerCase().includes('contact')) {
      setPriceValue('');
      setValue('price', value);
      return;
    }
    
    const formatted = formatNumberWithCommas(value);
    setPriceValue(formatted);
    // Store the formatted price with currency symbol
    const currencySymbols = {
      NGN: '₦',
      USD: '$',
      EUR: '€',
      GBP: '£',
    };
    const finalPrice = formatted ? `${currencySymbols[currency]}${formatted}` : '';
    setValue('price', finalPrice);
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    try {
      const allImages = featuredImage ? [featuredImage, ...images] : images;
      const finalFeaturedImage = featuredImage || images[0] || '';

      // Convert string fields to numbers where needed
      const submitData = {
        ...data,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : undefined,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : undefined,
        squareFeet: data.squareFeet ? parseInt(data.squareFeet) : undefined,
        images: allImages,
        featuredImage: finalFeaturedImage,
      };

      const response = await fetch(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update property');
      }

      router.push('/admin/properties');
    } catch (error: any) {
      alert(error.message || 'Failed to update property');
    } finally {
      setIsSubmitting(false);
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
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/properties">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-600">Update property details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    {...register('title')}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <Input
                    {...register('slug')}
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={8}
                    placeholder="Property description. You can use formatting:&#10;&#10;**Bold text** with **&#10;*Italic text* with *&#10;&#10;Bullet lists:&#10;- Item 1&#10;- Item 2&#10;&#10;Numbered lists:&#10;1. First item&#10;2. Second item&#10;&#10;Headings:&#10;# Main Heading&#10;## Subheading"
                    className={`w-full px-3 py-2 border rounded-md font-mono text-sm ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-800">
                    <p className="font-semibold mb-1">Formatting Tips:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><strong>**Bold**</strong> or <strong>__Bold__</strong> for bold text</li>
                      <li><em>*Italic*</em> or <em>_Italic_</em> for italic text</li>
                      <li>Start lines with <strong>-</strong> or <strong>*</strong> for bullet lists</li>
                      <li>Start lines with <strong>1.</strong> <strong>2.</strong> etc. for numbered lists</li>
                      <li>Use <strong>#</strong> for headings (## for subheadings)</li>
                      <li>Empty lines create paragraph breaks</li>
                    </ul>
                  </div>
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <Input
                    {...register('location')}
                    className={errors.location ? 'border-red-500' : ''}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={currency}
                      onChange={(e) => {
                        setCurrency(e.target.value as 'NGN' | 'USD' | 'EUR' | 'GBP');
                        if (priceValue) {
                          const currencySymbols = {
                            NGN: '₦',
                            USD: '$',
                            EUR: '€',
                            GBP: '£',
                          };
                          setValue('price', `${currencySymbols[e.target.value as keyof typeof currencySymbols]}${priceValue}`);
                        }
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="NGN">NGN (₦)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                    <Input
                      value={priceValue}
                      onChange={handlePriceChange}
                      placeholder="e.g., 85000000 or 'Contact for Pricing'"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Or enter "Contact for Pricing" in the field above
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image
                  </label>
                  <ImageUpload
                    value={featuredImage}
                    onChange={setFeaturedImage}
                    folder="properties"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images
                  </label>
                  <div className="space-y-2">
                    {images.map((url, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                        <img src={url} alt={`Image ${index + 1}`} className="h-16 w-16 object-cover rounded" />
                        <span className="flex-1 text-sm text-gray-600 truncate">{url}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <ImageUpload
                      value=""
                      onChange={addImage}
                      folder="properties"
                      label="Add Another Image"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#efb105] hover:bg-[#d9a004] text-black"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status & Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    {...register('type')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="construction">Construction</option>
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                    <option value="land">Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status * (for construction only)
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <Input type="number" {...register('bedrooms')} min="0" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <Input type="number" {...register('bathrooms')} min="0" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet
                  </label>
                  <Input type="number" {...register('squareFeet')} min="0" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Virtual Tour URL
                  </label>
                  <Input type="url" {...register('virtualTourUrl')} />
                </div>
              </CardContent>
            </Card>

            <SEOTools
              content={{
                title: formValues.title || '',
                description: formValues.description || '',
                content: formValues.description || '',
                keywords: [
                  formValues.location || '',
                  formValues.type || '',
                  ...(formValues.title ? formValues.title.split(' ') : []),
                ].filter(Boolean),
              }}
              onUpdate={(updates) => {
                if (updates.title) {
                  setValue('title', updates.title);
                }
                if (updates.description) {
                  setValue('description', updates.description);
                }
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

