export * from './property';
export * from './blog';
export * from './team';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  image?: string;
  rating: number;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  year: number;
  description?: string;
  image?: string;
}

export interface BrandAssociate {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
}

