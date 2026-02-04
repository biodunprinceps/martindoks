'use client';

import { useState, useEffect, useMemo } from 'react';
import { PortfolioCard } from '@/components/features/PortfolioCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { properties as staticProperties } from '@/data/properties';
import { Property } from '@/types/property';
import { PageHero } from '@/components/sections/PageHero';
import { PropertyCardSkeleton } from '@/components/ui/skeleton';

export default function PortfolioPage() {
  // Start with static properties immediately for instant rendering
  const [allProperties, setAllProperties] = useState<Property[]>(() => {
    // Filter static properties to construction type immediately
    return staticProperties.filter((p) => p.type === 'construction');
  });
  const [isLoading, setIsLoading] = useState(false);
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
          
          // Filter to construction projects only
          const constructionProjects = uniqueProperties.filter((p: Property) => p.type === 'construction');
          setAllProperties(constructionProjects);
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

  // Memoize filtered construction projects
  const constructionProjects = useMemo(() => {
    return allProperties.filter((p) => p.type === 'construction');
  }, [allProperties]);

  return (
    <div>
      {/* Hero Section */}
      <PageHero
        title="Our Portfolio"
        description="Showcasing our exceptional construction projects. From concept to completion, witness the quality and craftsmanship that defines our work."
        backgroundImage="/images/hero/IMG-20240124-WA0010.jpg"
      />

      {/* Portfolio Section */}
      <section className="py-16 bg-gradient-to-b from-background via-muted/20 to-background min-h-screen">
        <div className="container px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Our Work</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore our portfolio of completed and ongoing construction projects. Each project represents our commitment to excellence, innovation, and client satisfaction.
              </p>
            </div>
          </FadeIn>

          {isRefreshing && constructionProjects.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : constructionProjects.length === 0 ? (
            <FadeIn>
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  No projects to display at the moment.
                </p>
              </div>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {constructionProjects.map((property, index) => (
                <FadeIn key={property.id} delay={index * 0.1}>
                  <PortfolioCard property={property} />
                </FadeIn>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <FadeIn>
              <p className="text-muted-foreground text-lg">
                {constructionProjects.length} {constructionProjects.length === 1 ? 'Project' : 'Projects'} in Our Portfolio
                {isRefreshing && (
                  <span className="ml-2 text-sm text-muted-foreground/70">(updating...)</span>
                )}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}

