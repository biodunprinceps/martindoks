'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Square, ArrowRight, MessageCircle, Heart, GitCompare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isFavorite, toggleFavorite, isInComparison, toggleComparison, getComparison } from '@/lib/property-client-storage';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [favorite, setFavorite] = useState(false);
  const [inComparison, setInComparison] = useState(false);
  const [comparisonCount, setComparisonCount] = useState(0);

  useEffect(() => {
    setFavorite(isFavorite(property.id));
    setInComparison(isInComparison(property.id));
    setComparisonCount(getComparison().length);

    const handleFavoritesChange = () => {
      setFavorite(isFavorite(property.id));
    };

    const handleComparisonChange = () => {
      setInComparison(isInComparison(property.id));
      setComparisonCount(getComparison().length);
    };

    window.addEventListener('favorites-changed', handleFavoritesChange);
    window.addEventListener('comparison-changed', handleComparisonChange);

    return () => {
      window.removeEventListener('favorites-changed', handleFavoritesChange);
      window.removeEventListener('comparison-changed', handleComparisonChange);
    };
  }, [property.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleComparison(property.id);
    if (!added && comparisonCount >= 3) {
      alert('You can compare up to 3 properties at a time. Please remove one from comparison first.');
    }
  };

  const statusColors = {
    ongoing: 'bg-blue-500',
    completed: 'bg-green-500',
    upcoming: 'bg-[#efb105]',
  };

  const statusLabels = {
    ongoing: 'Ongoing',
    completed: 'Completed',
    upcoming: 'Upcoming',
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <Image
            src={property.featuredImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-2 items-end">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  favorite
                    ? 'bg-red-500 text-white'
                    : 'bg-background/80 text-foreground hover:bg-background border border-border/50'
                }`}
                aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCompareClick}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  inComparison
                    ? 'bg-[#efb105] text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
                aria-label={inComparison ? 'Remove from comparison' : 'Add to comparison'}
              >
                <GitCompare className="h-4 w-4" />
              </motion.button>
            </div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Badge className={typeColors[property.type]}>
                {typeLabels[property.type]}
              </Badge>
            </motion.div>
            {property.type === 'construction' && (
              <motion.div whileHover={{ scale: 1.1 }}>
                <Badge className={statusColors[property.status]}>
                  {statusLabels[property.status]}
                </Badge>
              </motion.div>
            )}
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <h3 className="text-lg sm:text-xl font-bold line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-muted-foreground text-xs sm:text-sm mt-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 mb-3 sm:mb-4">
            {property.description}
          </p>

          {(property.bedrooms || property.bathrooms || property.squareFeet) && (
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span>{property.bedrooms} Beds</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}
              {property.squareFeet && (
                <div className="flex items-center">
                  <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span>{property.squareFeet} sq ft</span>
                </div>
              )}
            </div>
          )}

          {property.price && (
            <div className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-primary">
              {property.price}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button 
            href={`/properties/${property.slug}`} 
            variant="outline" 
            className="w-full sm:flex-1 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            View Details
          </Button>
          {(property.type === 'sale' || property.type === 'rent' || property.type === 'land') ? (
            <a
              href={`https://wa.me/2349139694471?text=${encodeURIComponent(`Hello! I'm interested in ${property.type === 'sale' ? 'buying' : property.type === 'rent' ? 'renting' : 'purchasing'} ${property.type === 'land' ? 'the land' : 'the property'}: ${property.title} at ${property.location}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 w-full sm:flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {property.type === 'sale' ? 'Buy Now' : property.type === 'rent' ? 'Rent Now' : 'Inquire Now'}
            </a>
          ) : property.virtualTourUrl ? (
            <Button 
              href={`/virtual-tour?property=${property.id}`} 
              variant="default" 
              className="w-full sm:flex-1 bg-[#efb105] hover:bg-[#d9a004] text-black transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Virtual Tour
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

