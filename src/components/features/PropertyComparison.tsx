'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Square, X, MessageCircle } from 'lucide-react';
import { removeFromComparison, getComparison } from '@/lib/property-client-storage';
import { FadeIn } from '@/components/animations/FadeIn';

interface PropertyComparisonProps {
  properties: Property[];
}

export function PropertyComparison({ properties }: PropertyComparisonProps) {
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);

  useEffect(() => {
    setComparisonIds(getComparison());
  }, []);

  const handleRemove = (propertyId: string) => {
    removeFromComparison(propertyId);
    setComparisonIds(getComparison());
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground mb-4">
          No properties selected for comparison
        </p>
        <Button href="/listings" variant="default">
          Browse Properties
        </Button>
      </div>
    );
  }

  const typeColors = {
    construction: 'bg-purple-500',
    rent: 'bg-blue-600',
    sale: 'bg-green-600',
    land: 'bg-amber-600',
  };

  const typeLabels = {
    construction: 'Construction',
    rent: 'For Rent',
    sale: 'For Sale',
    land: 'Land',
  };

  // Comparison fields
  const comparisonFields = [
    { label: 'Price', key: 'price' },
    { label: 'Location', key: 'location' },
    { label: 'Bedrooms', key: 'bedrooms' },
    { label: 'Bathrooms', key: 'bathrooms' },
    { label: 'Square Feet', key: 'squareFeet' },
    { label: 'Type', key: 'type' },
  ];

  return (
    <div className="space-y-6">
      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <Card>
          <CardContent className="p-0">
            <div className="grid" style={{ gridTemplateColumns: `repeat(${properties.length + 1}, minmax(250px, 1fr))` }}>
              {/* Header Row */}
              <div className="sticky left-0 z-10 bg-muted/50 p-4 border-r border-b font-semibold">
                Property Details
              </div>
              {properties.map((property) => (
                <div key={property.id} className="border-b border-r last:border-r-0">
                  <div className="relative h-48">
                    <Image
                      src={property.featuredImage}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => handleRemove(property.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2">
                      <Badge className={typeColors[property.type]}>
                        {typeLabels[property.type]}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{property.title}</h3>
                    <Link
                      href={`/properties/${property.slug}`}
                      className="text-sm text-[#efb105] hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Rows */}
            {comparisonFields.map((field) => (
              <div
                key={field.key}
                className="grid border-b last:border-b-0"
                style={{ gridTemplateColumns: `repeat(${properties.length + 1}, minmax(250px, 1fr))` }}
              >
                <div className="sticky left-0 z-10 bg-muted/50 p-4 border-r font-semibold">
                  {field.label}
                </div>
                {properties.map((property) => (
                  <div key={property.id} className="p-4 border-r last:border-r-0">
                    {field.key === 'price' && (
                      <span className="text-lg font-semibold text-primary">
                        {property.price || 'Price on request'}
                      </span>
                    )}
                    {field.key === 'location' && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{property.location}</span>
                      </div>
                    )}
                    {field.key === 'bedrooms' && (
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span>{property.bedrooms || 'N/A'}</span>
                      </div>
                    )}
                    {field.key === 'bathrooms' && (
                      <div className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-muted-foreground" />
                        <span>{property.bathrooms || 'N/A'}</span>
                      </div>
                    )}
                    {field.key === 'squareFeet' && (
                      <div className="flex items-center gap-2">
                        <Square className="h-4 w-4 text-muted-foreground" />
                        <span>{property.squareFeet ? `${property.squareFeet.toLocaleString()} sq ft` : 'N/A'}</span>
                      </div>
                    )}
                    {field.key === 'type' && (
                      <Badge className={typeColors[property.type]}>
                        {typeLabels[property.type]}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Description Row */}
            <div
              className="grid border-b last:border-b-0"
              style={{ gridTemplateColumns: `repeat(${properties.length + 1}, minmax(250px, 1fr))` }}
            >
              <div className="sticky left-0 z-10 bg-muted/50 p-4 border-r font-semibold">
                Description
              </div>
              {properties.map((property) => (
                <div key={property.id} className="p-4 border-r last:border-r-0">
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {property.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions Row */}
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${properties.length + 1}, minmax(250px, 1fr))` }}
            >
              <div className="sticky left-0 z-10 bg-muted/50 p-4 border-r font-semibold">
                Actions
              </div>
              {properties.map((property) => (
                <div key={property.id} className="p-4 border-r last:border-r-0 space-y-2">
                  <Button
                    href={`/properties/${property.slug}`}
                    variant="outline"
                    className="w-full"
                  >
                    View Details
                  </Button>
                  {(property.type === 'sale' || property.type === 'rent' || property.type === 'land') && (
                    <a
                      href={`https://wa.me/2349139694471?text=${encodeURIComponent(`Hello! I'm interested in ${property.type === 'sale' ? 'buying' : property.type === 'rent' ? 'renting' : 'purchasing'} ${property.type === 'land' ? 'the land' : 'the property'}: ${property.title} at ${property.location}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-[#25D366] hover:bg-[#20BA5A] text-white transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

