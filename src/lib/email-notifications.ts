/**
 * Email Notifications System
 * Handles sending email notifications for new properties, price drops, and similar property suggestions
 */

import { Property } from '@/types/property';
import { getSimilarProperties } from './recommendations';
import { hasPriceDropped, trackPriceHistory } from './property-alerts';

export interface NotificationPreferences {
  email: string;
  newPropertyAlerts: boolean;
  priceDropAlerts: boolean;
  similarPropertySuggestions: boolean;
}

/**
 * Send new property alert email
 */
export async function sendNewPropertyAlert(
  property: Property,
  subscriberEmail: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/notifications/new-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: subscriberEmail,
        property: {
          id: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
          type: property.type,
          status: property.status,
          featuredImage: property.featuredImage,
          slug: property.slug,
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending new property alert:', error);
    return false;
  }
}

/**
 * Send price drop alert email
 */
export async function sendPriceDropAlert(
  property: Property,
  oldPrice: number,
  newPrice: number,
  subscriberEmail: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/notifications/price-drop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: subscriberEmail,
        property: {
          id: property.id,
          title: property.title,
          location: property.location,
          oldPrice,
          newPrice,
          slug: property.slug,
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending price drop alert:', error);
    return false;
  }
}

/**
 * Send similar property suggestions email
 */
export async function sendSimilarPropertySuggestions(
  property: Property,
  similarProperties: Property[],
  subscriberEmail: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/notifications/similar-properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: subscriberEmail,
        viewedProperty: {
          id: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
          slug: property.slug,
        },
        similarProperties: similarProperties.map((p) => ({
          id: p.id,
          title: p.title,
          location: p.location,
          price: p.price,
          type: p.type,
          featuredImage: p.featuredImage,
          slug: p.slug,
        })),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending similar properties email:', error);
    return false;
  }
}

/**
 * Check and send notifications for a property
 */
export async function checkAndSendNotifications(
  property: Property,
  allProperties: Property[]
): Promise<void> {
  // Track price history
  if (property.price) {
    const price = parseFloat(property.price.replace(/[^0-9.]/g, ''));
    trackPriceHistory(property.id, price);
    
    // Check for price drop
    if (hasPriceDropped(property.id, price)) {
      const history = await import('./property-alerts').then((m) => m.getPriceHistory());
      const oldRecord = history.find((h) => h.propertyId === property.id);
      if (oldRecord) {
        // Send price drop alerts to subscribers
        // This would be handled by the backend/API
      }
    }
  }
}

