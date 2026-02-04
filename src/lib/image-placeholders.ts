/**
 * Image placeholder utilities
 * These use Unsplash for high-quality placeholder images
 * Replace with actual images in public/images/ when available
 */

// Unsplash image IDs for construction/real estate themed images
const unsplashImages = {
  // Properties - Construction/Real Estate
  property1: '1600596542815-ffad4c1539a9', // Modern building
  property2: '1600585154340-be6161a56a0c', // Luxury home
  property3: '1600566753190-17f53d6c95f4', // Modern architecture
  property4: '1600585154523-97047a2e48d7', // Apartment building
  property5: '1600607687939-ce8a6c25118c', // Office building
  
  // Hero
  hero: '1600596542815-ffad4c1539a9', // Construction/real estate
  
  // Blog
  blog1: '1600585154340-be6161a56a0c', // Construction
  blog2: '1600566753190-17f53d6c95f4', // Architecture
  blog3: '1600585154523-97047a2e48d7', // Real estate
  blog4: '1600607687939-ce8a6c25118c', // Building
  blog5: '1600596542815-ffad4c1539a9', // Development
  
  // Team
  team: '1507003211169-0a1dd7228f2d', // Professional headshot
  
  // Awards
  award: '1600585154340-be6161a56a0c', // Trophy/award
  
  // Brands
  brand: '1600585154523-97047a2e48d7', // Logo placeholder
  
  // Testimonials
  testimonial: '1507003211169-0a1dd7228f2d', // Professional person
};

/**
 * Get Unsplash placeholder image URL
 */
export function getPlaceholderImage(
  category: keyof typeof unsplashImages,
  width: number = 1200,
  height: number = 800
): string {
  const imageId = unsplashImages[category] || unsplashImages.property1;
  return `https://images.unsplash.com/photo-${imageId}?w=${width}&h=${height}&fit=crop&q=80`;
}

/**
 * Get placeholder for property images
 */
export function getPropertyPlaceholder(index: number = 1): string {
  const images = [
    unsplashImages.property1,
    unsplashImages.property2,
    unsplashImages.property3,
    unsplashImages.property4,
    unsplashImages.property5,
  ];
  const imageId = images[(index - 1) % images.length];
  return `https://images.unsplash.com/photo-${imageId}?w=1200&h=800&fit=crop&q=80`;
}

/**
 * Get placeholder for blog images
 */
export function getBlogPlaceholder(index: number = 1): string {
  const images = [
    unsplashImages.blog1,
    unsplashImages.blog2,
    unsplashImages.blog3,
    unsplashImages.blog4,
    unsplashImages.blog5,
  ];
  const imageId = images[(index - 1) % images.length];
  return `https://images.unsplash.com/photo-${imageId}?w=1200&h=630&fit=crop&q=80`;
}

/**
 * Get placeholder for team member
 */
export function getTeamPlaceholder(): string {
  return `https://images.unsplash.com/photo-${unsplashImages.team}?w=800&h=800&fit=crop&q=80`;
}

/**
 * Get placeholder for hero image
 */
export function getHeroPlaceholder(): string {
  return `https://images.unsplash.com/photo-${unsplashImages.hero}?w=1920&h=1080&fit=crop&q=80`;
}

/**
 * Get placeholder for award image
 */
export function getAwardPlaceholder(): string {
  return `https://images.unsplash.com/photo-${unsplashImages.award}?w=800&h=600&fit=crop&q=80`;
}

/**
 * Get placeholder for brand logo
 */
export function getBrandPlaceholder(): string {
  return `https://images.unsplash.com/photo-${unsplashImages.brand}?w=400&h=200&fit=crop&q=80`;
}

/**
 * Get placeholder for testimonial photo
 */
export function getTestimonialPlaceholder(): string {
  return `https://images.unsplash.com/photo-${unsplashImages.testimonial}?w=400&h=400&fit=crop&q=80`;
}

/**
 * Check if image path is a placeholder (external URL)
 */
export function isPlaceholderImage(path: string): boolean {
  return path.startsWith('http://') || path.startsWith('https://');
}

