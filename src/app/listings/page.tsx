'use client';

import { useState, useMemo, useEffect } from 'react';
import { PropertyCard } from '@/components/features/PropertyCard';
import { ListingsFilters } from '@/components/features/ListingsFilters';
import { FadeIn } from '@/components/animations/FadeIn';
import { properties as staticProperties } from '@/data/properties';
import { PropertyType, Property } from '@/types/property';
import { PageHero } from '@/components/sections/PageHero';
import { PropertyCardSkeleton } from '@/components/ui/skeleton';

export default function ListingsPage() {
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all');
  const [bedroomsFilter, setBedroomsFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  // Start with static properties immediately filtered to sale/rent/land
  const [allProperties, setAllProperties] = useState<Property[]>(() => {
    return staticProperties.filter((p) => p.type === 'sale' || p.type === 'rent' || p.type === 'land');
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Fetch additional properties from API in the background
    const loadProperties = async () => {
      setIsRefreshing(true);
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

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
          
          // Filter to sale/rent/land only
          const saleRentLandProperties = uniqueProperties.filter(
            (p: Property) => p.type === 'sale' || p.type === 'rent' || p.type === 'land'
          );
          setAllProperties(saleRentLandProperties);
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

  // Filter only sale/rent/land properties (not construction)
  const saleRentLandProperties = useMemo(() => {
    return allProperties.filter((p) => p.type === 'sale' || p.type === 'rent' || p.type === 'land');
  }, [allProperties]);

  // Apply all filters
  const filteredProperties = useMemo(() => {
    return saleRentLandProperties.filter((property) => {
      // Type filter
      const matchesType = typeFilter === 'all' || property.type === typeFilter;
      
      // Search query filter
      const matchesSearch = !searchQuery || 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Location filter
      const matchesLocation = !locationFilter || 
        property.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      // Bedrooms filter
      const matchesBedrooms = bedroomsFilter === 'all' || 
        (property.bedrooms && property.bedrooms >= bedroomsFilter);
      
      return matchesType && matchesSearch && matchesLocation && matchesBedrooms;
    });
  }, [typeFilter, searchQuery, locationFilter, bedroomsFilter, saleRentLandProperties]);

  return (
    <div>
      {/* Hero Section */}
      <PageHero
        title="Property Listings"
        description="Discover premium properties and lands available for sale, rent, or lease. Find your perfect home or investment opportunity."
        backgroundImage="/images/hero/IMG-20240124-WA0010.jpg"
      />

      {/* Listings Section */}
      <section className="py-16 bg-gradient-to-b from-background via-muted/20 to-background min-h-screen">
        <div className="container px-4">
          <FadeIn>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Available Properties</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse through our curated selection of properties and lands ready for immediate purchase or rental.
              </p>
            </div>
          </FadeIn>

          <ListingsFilters
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            bedroomsFilter={bedroomsFilter}
            onBedroomsChange={setBedroomsFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            locationFilter={locationFilter}
            onLocationChange={setLocationFilter}
          />

          {isRefreshing && filteredProperties.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <FadeIn>
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  No properties found matching your filters.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            </FadeIn>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property, index) => (
                  <FadeIn key={property.id} delay={index * 0.1}>
                    <PropertyCard property={property} />
                  </FadeIn>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <FadeIn>
                  <p className="text-muted-foreground">
                    Showing {filteredProperties.length} of {saleRentLandProperties.length} properties
                    {isRefreshing && (
                      <span className="ml-2 text-sm text-muted-foreground/70">(updating...)</span>
                    )}
                  </p>
                </FadeIn>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

