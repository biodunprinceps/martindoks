'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Square, ArrowRight } from 'lucide-react';

interface PortfolioCardProps {
  property: Property;
}

export function PortfolioCard({ property }: PortfolioCardProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <Image
            src={property.featuredImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4">
            <Badge className={statusColors[property.status]}>
              {statusLabels[property.status]}
            </Badge>
          </div>
        </div>
        
        <CardContent className="flex-1 p-6">
          <h3 className="text-xl sm:text-2xl font-bold mb-2 line-clamp-2">{property.title}</h3>
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
          
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 mb-4">
            {property.description}
          </p>

          {(property.bedrooms || property.bathrooms || property.squareFeet) && (
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-4 border-t">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-2" />
                  <span>{property.bedrooms} Beds</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-2" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}
              {property.squareFeet && (
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-2" />
                  <span>{property.squareFeet.toLocaleString()} sq ft</span>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 pb-6 px-6">
          <Button 
            href={`/properties/${property.slug}`} 
            variant="default"
            className="w-full bg-[#efb105] hover:bg-[#d9a004] text-black font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            View Project Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

