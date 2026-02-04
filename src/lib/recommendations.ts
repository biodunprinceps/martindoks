/**
 * Personalized property recommendations
 * Based on viewing history, favorites, and similar properties
 */

import { Property } from '@/types/property';
import { getRecentlyViewed, getFavorites } from './property-client-storage';
import { getPropertyViews } from './analytics';

/**
 * Get similar properties based on property features
 */
export function getSimilarProperties(
  property: Property,
  allProperties: Property[],
  limit: number = 4
): Property[] {
  // Exclude the current property
  const otherProperties = allProperties.filter((p) => p.id !== property.id);

  // Score properties based on similarity
  const scored = otherProperties.map((p) => {
    let score = 0;

    // Same type
    if (p.type === property.type) score += 10;

    // Same status
    if (p.status === property.status) score += 8;

    // Similar location (same area)
    if (p.location.toLowerCase().includes(property.location.toLowerCase()) ||
        property.location.toLowerCase().includes(p.location.toLowerCase())) {
      score += 15;
    }

    // Similar price range (±30%)
    if (property.price && p.price) {
      const propertyPrice = parseFloat(property.price.replace(/[^0-9.]/g, ''));
      const pPrice = parseFloat(p.price.replace(/[^0-9.]/g, ''));
      if (!isNaN(propertyPrice) && !isNaN(pPrice) && propertyPrice > 0) {
        const priceDiff = Math.abs(pPrice - propertyPrice) / propertyPrice;
        if (priceDiff <= 0.3) score += 10;
      }
    }

    // Similar bedrooms
    if (property.bedrooms && p.bedrooms) {
      if (Math.abs(p.bedrooms - property.bedrooms) <= 1) score += 5;
    }

    // Similar bathrooms
    if (property.bathrooms && p.bathrooms) {
      if (Math.abs(p.bathrooms - property.bathrooms) <= 1) score += 5;
    }

    // Similar square feet (±20%)
    if (property.squareFeet && p.squareFeet) {
      const sizeDiff = Math.abs(p.squareFeet - property.squareFeet) / property.squareFeet;
      if (sizeDiff <= 0.2) score += 7;
    }

    return { property: p, score };
  });

  // Sort by score and return top matches
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.property);
}

/**
 * Get personalized recommendations based on viewing history
 */
export function getPersonalizedRecommendations(
  allProperties: Property[],
  limit: number = 6
): Property[] {
  if (typeof window === 'undefined') return [];

  const recentlyViewed = getRecentlyViewed();
  const favorites = getFavorites();
  const propertyViews = getPropertyViews();

  // If no history, return most viewed properties
  if (recentlyViewed.length === 0 && favorites.length === 0) {
    const mostViewed = propertyViews
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
      .map((v) => v.propertyId);

    return allProperties.filter((p) => mostViewed.includes(p.id));
  }

  // Get properties user has viewed
  const viewedProperties = allProperties.filter((p) =>
    recentlyViewed.includes(p.id) || favorites.includes(p.id)
  );

  if (viewedProperties.length === 0) return [];

  // Find similar properties to viewed ones
  const recommendations = new Map<string, { property: Property; score: number }>();

  viewedProperties.forEach((viewed) => {
    const similar = getSimilarProperties(viewed, allProperties, limit * 2);
    
    similar.forEach((prop) => {
      const existing = recommendations.get(prop.id);
      if (existing) {
        existing.score += 1;
      } else {
        recommendations.set(prop.id, { property: prop, score: 1 });
      }
    });
  });

  // Exclude already viewed/favorited
  const filtered = Array.from(recommendations.values())
    .filter((item) => !recentlyViewed.includes(item.property.id) && !favorites.includes(item.property.id))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.property);

  return filtered;
}

/**
 * Get "Properties you might like" based on viewing patterns
 */
export function getPropertiesYouMightLike(
  allProperties: Property[],
  limit: number = 4
): Property[] {
  const recommendations = getPersonalizedRecommendations(allProperties, limit);
  
  // If not enough recommendations, add popular properties
  if (recommendations.length < limit) {
    const propertyViews = getPropertyViews();
    const mostViewed = propertyViews
      .sort((a, b) => b.views - a.views)
      .slice(0, limit - recommendations.length)
      .map((v) => v.propertyId);

    const popular = allProperties.filter(
      (p) => mostViewed.includes(p.id) && !recommendations.find((r) => r.id === p.id)
    );

    recommendations.push(...popular);
  }

  return recommendations.slice(0, limit);
}

