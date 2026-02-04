/**
 * Property Alerts System
 * Allows users to subscribe to alerts for new properties, price changes, and status changes
 */

import { Property } from '@/types/property';

const STORAGE_KEYS = {
  ALERTS: 'mdh_property_alerts',
  PRICE_HISTORY: 'mdh_price_history',
} as const;

export interface PropertyAlert {
  id: string;
  email: string;
  phone?: string;
  criteria: {
    type?: string[];
    location?: string[];
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
  };
  alertTypes: ('new' | 'price_drop' | 'status_change')[];
  createdAt: string;
  isActive: boolean;
}

export interface PriceHistory {
  propertyId: string;
  price: number;
  timestamp: string;
}

/**
 * Subscribe to property alerts
 */
export function subscribeToAlerts(alert: Omit<PropertyAlert, 'id' | 'createdAt'>): string {
  if (typeof window === 'undefined') return '';

  try {
    const alerts = getAlerts();
    const newAlert: PropertyAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    alerts.push(newAlert);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    
    return newAlert.id;
  } catch (error) {
    console.error('Error subscribing to alerts:', error);
    return '';
  }
}

/**
 * Get all alerts
 */
export function getAlerts(): PropertyAlert[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Unsubscribe from alerts
 */
export function unsubscribeFromAlerts(alertId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const alerts = getAlerts();
    const filtered = alerts.filter((a) => a.id !== alertId);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if property matches alert criteria
 */
export function propertyMatchesAlert(property: Property, alert: PropertyAlert): boolean {
  const { criteria } = alert;

  // Check type
  if (criteria.type && criteria.type.length > 0) {
    if (!criteria.type.includes(property.type)) return false;
  }

  // Check location
  if (criteria.location && criteria.location.length > 0) {
    const matchesLocation = criteria.location.some((loc) =>
      property.location.toLowerCase().includes(loc.toLowerCase())
    );
    if (!matchesLocation) return false;
  }

  // Check price range
  if (property.price) {
    const price = parseFloat(property.price.replace(/[^0-9.]/g, ''));
    
    if (criteria.minPrice && price < criteria.minPrice) return false;
    if (criteria.maxPrice && price > criteria.maxPrice) return false;
  }

  // Check bedrooms
  if (criteria.bedrooms && property.bedrooms) {
    if (property.bedrooms < criteria.bedrooms) return false;
  }

  // Check bathrooms
  if (criteria.bathrooms && property.bathrooms) {
    if (property.bathrooms < criteria.bathrooms) return false;
  }

  return true;
}

/**
 * Track price history for a property
 */
export function trackPriceHistory(propertyId: string, price: number): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getPriceHistory();
    const existing = history.find((h) => h.propertyId === propertyId);
    
    if (existing) {
      // Only update if price changed
      if (existing.price !== price) {
        existing.price = price;
        existing.timestamp = new Date().toISOString();
      }
    } else {
      history.push({
        propertyId,
        price,
        timestamp: new Date().toISOString(),
      });
    }

    // Keep only last 1000 price records
    const recent = history.slice(-1000);
    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(recent));
  } catch (error) {
    console.error('Error tracking price history:', error);
  }
}

/**
 * Get price history
 */
export function getPriceHistory(): PriceHistory[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Check if price dropped
 */
export function hasPriceDropped(propertyId: string, currentPrice: number): boolean {
  const history = getPriceHistory();
  const record = history.find((h) => h.propertyId === propertyId);
  
  if (!record) return false;
  return currentPrice < record.price;
}
