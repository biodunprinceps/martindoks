'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { PropertyComparison } from '@/components/features/PropertyComparison';
import { PageHero } from '@/components/sections/PageHero';
import { FadeIn } from '@/components/animations/FadeIn';
import { getComparison } from '@/lib/property-client-storage';
import { properties as staticProperties } from '@/data/properties';

export default function ComparePage() {
  const [comparisonProperties, setComparisonProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComparisonProperties = async () => {
      try {
        const comparisonIds = getComparison();
        
        if (comparisonIds.length === 0) {
          setComparisonProperties([]);
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

        // Filter to comparison IDs
        const properties = uniqueProperties.filter((p: Property) =>
          comparisonIds.includes(p.id)
        );

        setComparisonProperties(properties);
      } catch (error) {
        console.error('Error loading comparison properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComparisonProperties();

    // Listen for comparison changes
    const handleComparisonChange = () => {
      loadComparisonProperties();
    };

    window.addEventListener('comparison-changed', handleComparisonChange);

    return () => {
      window.removeEventListener('comparison-changed', handleComparisonChange);
    };
  }, []);

  return (
    <div>
      <PageHero
        title="Compare Properties"
        description="Side-by-side comparison of your selected properties to help you make the best decision."
        backgroundImage="/images/hero/IMG-20240124-WA0010.jpg"
      />

      <section className="py-16">
        <div className="container px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading comparison...</p>
            </div>
          ) : (
            <FadeIn>
              <PropertyComparison properties={comparisonProperties} />
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}

