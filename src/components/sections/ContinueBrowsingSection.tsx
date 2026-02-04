'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { PropertyCard } from '@/components/features/PropertyCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { getRecentlyViewed } from '@/lib/property-client-storage';
import { properties as staticProperties } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';

export function ContinueBrowsingSection() {
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecentProperties = async () => {
      try {
        const recentIds = getRecentlyViewed();
        
        if (recentIds.length === 0) {
          setRecentProperties([]);
          setIsLoading(false);
          return;
        }

        // Fetch all properties
        let allProperties: Property[] = [];
        
        try {
          const response = await fetch('/api/admin/properties', { cache: 'no-store' });
          if (response.ok) {
            const data = await response.json();
            allProperties = (data.properties || []).map((prop: any) => ({
              ...prop,
              createdAt: new Date(prop.createdAt),
              updatedAt: new Date(prop.updatedAt),
            }));
          }
        } catch (error) {
          console.error('Error fetching properties:', error);
        }

        // Combine with static properties
        const combined = [...allProperties, ...staticProperties];
        const uniqueProperties = combined.reduce((acc, current) => {
          if (!acc.find((p: Property) => p.id === current.id || p.slug === current.slug)) {
            acc.push(current);
          }
          return acc;
        }, [] as Property[]);

        // Filter to recent IDs and maintain order
        const properties = recentIds
          .map((id) => uniqueProperties.find((p: Property) => p.id === id))
          .filter((p): p is Property => p !== undefined)
          .slice(0, 6); // Show max 6

        setRecentProperties(properties);
      } catch (error) {
        console.error('Error loading recent properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentProperties();
  }, []);

  if (isLoading || recentProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container px-4">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-[#efb105]" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">Continue Browsing</h2>
                <p className="text-muted-foreground mt-1">
                  Properties you recently viewed
                </p>
              </div>
            </div>
            <Button
              href="/listings"
              variant="outline"
              className="hidden sm:flex"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProperties.map((property, index) => (
            <FadeIn key={property.id} delay={index * 0.1}>
              <PropertyCard property={property} />
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="text-center mt-8">
            <Button
              href="/listings"
              variant="outline"
              className="sm:hidden"
            >
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

