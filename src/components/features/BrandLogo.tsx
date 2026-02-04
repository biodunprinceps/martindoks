'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { BrandAssociate } from '@/types';
import Link from 'next/link';

interface BrandLogoProps {
  brand: BrandAssociate;
}

export function BrandLogo({ brand }: BrandLogoProps) {
  const content = (
    <Card className="h-full hover:shadow-lg transition-all duration-300 group flex items-center justify-center p-6">
      <CardContent className="p-0 w-full">
        <div className="relative h-24 w-full">
          <Image
            src={brand.logo}
            alt={brand.name}
            fill
            className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
            onError={(e) => {
              // Fallback: hide image if it doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        {brand.name && (
          <div className="mt-4 text-center">
            <div className="font-semibold text-sm">{brand.name}</div>
            {brand.description && (
              <div className="text-xs text-muted-foreground mt-1">
                {brand.description}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (brand.website) {
    return (
      <Link
        href={brand.website}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </Link>
    );
  }

  return content;
}

