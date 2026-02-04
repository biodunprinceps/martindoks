'use client';

import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/features/PropertyCard';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/FadeIn';
import { properties as staticProperties } from '@/data/properties';
import { Property } from '@/types/property';
import { ArrowRight } from 'lucide-react';
import { PropertyCardSkeleton } from '@/components/ui/skeleton';

export function PropertiesSection() {
  // Start with static properties immediately filtered to sale/rent
  const [allProperties, setAllProperties] = useState<Property[]>(() => {
    return staticProperties.filter((p: Property) => p.type === 'sale' || p.type === 'rent' || p.type === 'land');
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Fetch additional properties from API in the background
    const loadProperties = async () => {
      setIsRefreshing(true);
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Use no-store to always get fresh data, especially after admin uploads
        const response = await fetch('/api/admin/properties', {
          signal: controller.signal,
          cache: 'no-store', // Always fetch fresh data
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const properties = (data.properties || []).map((prop: any) => ({
            ...prop,
            createdAt: new Date(prop.createdAt),
            updatedAt: new Date(prop.updatedAt),
          }));
          
          // Combine with static properties and remove duplicates
          const combined = [...properties, ...staticProperties];
          const uniqueProperties = combined.reduce((acc, current) => {
            if (!acc.find((p: Property) => p.id === current.id || p.slug === current.slug)) {
              acc.push(current);
            }
            return acc;
          }, [] as Property[]);
          
          // Filter to show only sale/rent/land properties (listings)
          const listings = uniqueProperties.filter((p: Property) => p.type === 'sale' || p.type === 'rent' || p.type === 'land');
          setAllProperties(listings);
        }
      } catch (error: any) {
        // Silently fail - we already have static properties displayed
        if (error.name !== 'AbortError') {
          console.error('Error loading properties:', error);
        }
      } finally {
        setIsRefreshing(false);
      }
    };

    // Load properties after initial render
    loadProperties();
  }, []);

  // Filter to show only sale/rent/land properties (listings)
  const listings = allProperties.filter((p: Property) => p.type === 'sale' || p.type === 'rent' || p.type === 'land');
  const featuredListings = listings.slice(0, 3);

  return (
    <section className="py-16 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Listings</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover premium properties and lands available for sale, rent, or lease. Quality listings that meet your highest standards.
            </p>
          </div>
        </FadeIn>

        {isRefreshing && featuredListings.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredListings.length === 0 ? (
          <FadeIn>
            <div className="text-center py-12">
              <p className="text-muted-foreground">No listings available at the moment.</p>
            </div>
          </FadeIn>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredListings.map((property, index) => (
                <FadeIn key={property.id} delay={index * 0.1}>
                  <PropertyCard property={property} />
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.4}>
              <div className="text-center">
                <Button href="/listings" size="lg" className="bg-[#efb105] hover:bg-[#d9a004] text-black font-semibold">
                  View All Listings
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </FadeIn>
          </>
        )}
      </div>
    </section>
  );
}

