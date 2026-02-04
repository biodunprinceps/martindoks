export type PropertyStatus = 'ongoing' | 'completed' | 'upcoming';
export type PropertyType = 'construction' | 'rent' | 'sale' | 'land';

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  price?: string;
  status: PropertyStatus;
  type: PropertyType;
  images: string[];
  featuredImage: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  virtualTourUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

