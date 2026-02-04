'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { SEOTools } from '@/components/admin/SEOTools';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import Link from 'next/link';

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

export default function NewPropertyPage() {
  const router = useRouter();
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
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: 'construction',
      status: 'upcoming',
    },
  });

  // Watch form values for SEO analysis
  const formValues = watch();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title);
    if (!document.getElementById('slug')?.getAttribute('data-manual')) {
      setValue('slug', generateSlug(title));
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

      const response = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create property');
      }

      router.push('/admin/properties');
    } catch (error: any) {
      alert(error.message || 'Failed to create property');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">New Property</h1>
          <p className="text-gray-600">Add a new property listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Property Information</span>
                  <span className="text-xs font-normal text-muted-foreground">(Main details)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('title')}
                    onChange={handleTitleChange}
                    placeholder="e.g., Luxury 4-Bedroom Villa in Victoria Island"
                    className={`text-base ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded border border-blue-200">
                    💡 <strong>Tip:</strong> Include key features in the title (bedrooms, location, property type) to help buyers find it.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    URL Slug <span className="text-red-500">*</span>
                    <span className="text-xs font-normal text-gray-500 ml-2">(Auto-generated, you can edit if needed)</span>
                  </label>
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="luxury-4-bedroom-villa-victoria-island"
                    className={`text-sm font-mono ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                    onFocus={(e) => e.target.setAttribute('data-manual', 'true')}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    This appears in the web address. Only lowercase letters, numbers, and hyphens are allowed.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Property Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('description')}
                    rows={10}
                    placeholder="Describe the property in detail. Include:
• Key features and amenities
• Neighborhood information
• What makes this property special
• Nearby attractions or facilities

You can use simple formatting:
**Bold text** for emphasis
*Italic text* for highlights
- Bullet points for features
1. Numbered lists for details"
                    className={`w-full px-3 py-2 border rounded-md text-base leading-relaxed ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md text-xs text-gray-700">
                    <p className="font-semibold mb-2">✍️ Writing Tips:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Start with the most important features</li>
                      <li>Use <strong>**bold**</strong> to highlight key points</li>
                      <li>Create lists with <strong>-</strong> for easy reading</li>
                      <li>Mention nearby schools, shopping, transport</li>
                      <li>Describe the lifestyle this property offers</li>
                    </ul>
                  </div>
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('location')}
                    placeholder="e.g., Victoria Island, Lagos, Nigeria"
                    className={`text-base ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    Include the area, city, and country for best results. Example: "Victoria Island, Lagos, Nigeria"
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Price
                    <span className="text-xs font-normal text-gray-500 ml-2">(Leave blank if price on request)</span>
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
                      className="px-3 py-2 border border-gray-300 rounded-md text-base"
                    >
                      <option value="NGN">NGN (₦)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                    <Input
                      value={priceValue}
                      onChange={handlePriceChange}
                      placeholder="e.g., 85000000 or type 'Contact for Pricing'"
                      className="flex-1 text-base"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                    💰 <strong>Tip:</strong> Enter numbers only (commas added automatically) or type "Contact for Pricing" if price is negotiable.
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
                  {isSubmitting ? 'Creating...' : 'Create Property'}
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
                  <Input
                    type="number"
                    {...register('bedrooms')}
                    placeholder="3"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <Input
                    type="number"
                    {...register('bathrooms')}
                    placeholder="2"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet
                  </label>
                  <Input
                    type="number"
                    {...register('squareFeet')}
                    placeholder="2500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Virtual Tour URL
                  </label>
                  <Input
                    type="url"
                    {...register('virtualTourUrl')}
                    placeholder="https://example.com/tour"
                  />
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
                  // Auto-update slug if not manually edited
                  if (!document.getElementById('slug')?.getAttribute('data-manual')) {
                    setValue('slug', generateSlug(updates.title));
                  }
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

