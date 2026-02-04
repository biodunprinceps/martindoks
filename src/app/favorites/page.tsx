'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { PropertyCard } from '@/components/features/PropertyCard';
import { PageHero } from '@/components/sections/PageHero';
import { FadeIn } from '@/components/animations/FadeIn';
import { PropertyCardSkeleton } from '@/components/ui/skeleton';
import { getFavorites } from '@/lib/property-client-storage';
import { properties as staticProperties } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavoriteProperties = async () => {
      try {
        const favoriteIds = getFavorites();
        
        if (favoriteIds.length === 0) {
          setFavoriteProperties([]);
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

        // Filter to favorite IDs
        const properties = uniqueProperties.filter((p: Property) =>
          favoriteIds.includes(p.id)
        );

        setFavoriteProperties(properties);
      } catch (error) {
        console.error('Error loading favorite properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoriteProperties();

    // Listen for favorites changes
    const handleFavoritesChange = () => {
      loadFavoriteProperties();
    };

    window.addEventListener('favorites-changed', handleFavoritesChange);

    return () => {
      window.removeEventListener('favorites-changed', handleFavoritesChange);
    };
  }, []);

  return (
    <div>
      <PageHero
        title="My Saved Properties"
        description="Your favorite properties saved for easy access. Compare, share, or contact us about any of these properties."
        backgroundImage="/images/hero/IMG-20240124-WA0010.jpg"
      />

      <section className="py-16 bg-gradient-to-b from-background via-muted/20 to-background min-h-screen">
        <div className="container px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : favoriteProperties.length === 0 ? (
            <FadeIn>
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No saved properties yet</h2>
                <p className="text-muted-foreground mb-6">
                  Start exploring our properties and save your favorites to view them here.
                </p>
                <Button href="/listings" variant="default">
                  Browse Properties
                </Button>
              </div>
            </FadeIn>
          ) : (
            <>
              <FadeIn>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {favoriteProperties.length} Saved {favoriteProperties.length === 1 ? 'Property' : 'Properties'}
                  </h2>
                </div>
              </FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProperties.map((property, index) => (
                  <FadeIn key={property.id} delay={index * 0.1}>
                    <PropertyCard property={property} />
                  </FadeIn>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

