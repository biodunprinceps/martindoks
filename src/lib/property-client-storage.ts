/**
 * Client-side property storage utilities
 * Handles favorites, comparison, and recently viewed properties using localStorage
 * 
 * Note: This is separate from the server-side property-storage.ts which handles
 * file-based storage for the actual property data.
 */

import { Property } from '@/types/property';

const STORAGE_KEYS = {
  FAVORITES: 'mdh_favorites',
  COMPARISON: 'mdh_comparison',
  RECENTLY_VIEWED: 'mdh_recently_viewed',
} as const;

const MAX_COMPARISON = 3;
const MAX_RECENTLY_VIEWED = 10;

// ==================== Favorites ====================

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToFavorites(propertyId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const favorites = getFavorites();
    if (!favorites.includes(propertyId)) {
      favorites.push(propertyId);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      // Trigger custom event for UI updates
      window.dispatchEvent(new CustomEvent('favorites-changed'));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
}

export function removeFromFavorites(propertyId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const favorites = getFavorites();
    const updated = favorites.filter((id) => id !== propertyId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    // Trigger custom event for UI updates
    window.dispatchEvent(new CustomEvent('favorites-changed'));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
}

export function isFavorite(propertyId: string): boolean {
  return getFavorites().includes(propertyId);
}

export function toggleFavorite(propertyId: string): void {
  if (isFavorite(propertyId)) {
    removeFromFavorites(propertyId);
  } else {
    addToFavorites(propertyId);
  }
}

// ==================== Comparison ====================

export function getComparison(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPARISON);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToComparison(propertyId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const comparison = getComparison();
    
    if (comparison.includes(propertyId)) {
      return false; // Already in comparison
    }
    
    if (comparison.length >= MAX_COMPARISON) {
      return false; // Max limit reached
    }
    
    comparison.push(propertyId);
    localStorage.setItem(STORAGE_KEYS.COMPARISON, JSON.stringify(comparison));
    // Trigger custom event for UI updates
    window.dispatchEvent(new CustomEvent('comparison-changed'));
    return true;
  } catch (error) {
    console.error('Error adding to comparison:', error);
    return false;
  }
}

export function removeFromComparison(propertyId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const comparison = getComparison();
    const updated = comparison.filter((id) => id !== propertyId);
    localStorage.setItem(STORAGE_KEYS.COMPARISON, JSON.stringify(updated));
    // Trigger custom event for UI updates
    window.dispatchEvent(new CustomEvent('comparison-changed'));
  } catch (error) {
    console.error('Error removing from comparison:', error);
  }
}

export function isInComparison(propertyId: string): boolean {
  return getComparison().includes(propertyId);
}

export function toggleComparison(propertyId: string): boolean {
  if (isInComparison(propertyId)) {
    removeFromComparison(propertyId);
    return true;
  } else {
    return addToComparison(propertyId);
  }
}

export function clearComparison(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.COMPARISON);
    window.dispatchEvent(new CustomEvent('comparison-changed'));
  } catch (error) {
    console.error('Error clearing comparison:', error);
  }
}

// ==================== Recently Viewed ====================

export function getRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToRecentlyViewed(propertyId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    let recentlyViewed = getRecentlyViewed();
    
    // Remove if already exists (to move to front)
    recentlyViewed = recentlyViewed.filter((id) => id !== propertyId);
    
    // Add to front
    recentlyViewed.unshift(propertyId);
    
    // Limit to MAX_RECENTLY_VIEWED
    if (recentlyViewed.length > MAX_RECENTLY_VIEWED) {
      recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
    }
    
    localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewed));
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
}

export function clearRecentlyViewed(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENTLY_VIEWED);
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
  }
}
