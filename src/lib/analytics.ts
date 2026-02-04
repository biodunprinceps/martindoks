/**
 * Visitor behavior tracking utilities
 * Tracks popular properties, user journey, and drop-off points
 */

import { Property } from '@/types/property';

const STORAGE_KEYS = {
  PROPERTY_VIEWS: 'mdh_property_views',
  PAGE_VIEWS: 'mdh_page_views',
  USER_JOURNEY: 'mdh_user_journey',
  DROP_OFFS: 'mdh_drop_offs',
} as const;

// ==================== Property Views Tracking ====================

export function trackPropertyView(propertyId: string, propertyTitle: string): void {
  if (typeof window === 'undefined') return;

  try {
    const views = getPropertyViews();
    const existing = views.find((v) => v.propertyId === propertyId);
    
    if (existing) {
      existing.views += 1;
      existing.lastViewed = new Date().toISOString();
    } else {
      views.push({
        propertyId,
        propertyTitle,
        views: 1,
        firstViewed: new Date().toISOString(),
        lastViewed: new Date().toISOString(),
      });
    }

    // Keep only top 100 most viewed
    views.sort((a, b) => b.views - a.views);
    const topViews = views.slice(0, 100);
    
    localStorage.setItem(STORAGE_KEYS.PROPERTY_VIEWS, JSON.stringify(topViews));
  } catch (error) {
    console.error('Error tracking property view:', error);
  }
}

export function getPropertyViews(): Array<{
  propertyId: string;
  propertyTitle: string;
  views: number;
  firstViewed: string;
  lastViewed: string;
}> {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROPERTY_VIEWS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getMostViewedProperties(limit: number = 10): string[] {
  const views = getPropertyViews();
  return views
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
    .map((v) => v.propertyId);
}

// ==================== Page Views Tracking ====================

export function trackPageView(page: string): void {
  if (typeof window === 'undefined') return;

  try {
    const views = getPageViews();
    const today = new Date().toISOString().split('T')[0];
    
    if (views[today]) {
      views[today][page] = (views[today][page] || 0) + 1;
    } else {
      views[today] = { [page]: 1 };
    }

    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filtered: Record<string, Record<string, number>> = {};
    Object.keys(views).forEach((date) => {
      if (new Date(date) >= thirtyDaysAgo) {
        filtered[date] = views[date];
      }
    });

    localStorage.setItem(STORAGE_KEYS.PAGE_VIEWS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

export function getPageViews(): Record<string, Record<string, number>> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// ==================== User Journey Tracking ====================

export function trackUserJourney(page: string, action?: string): void {
  if (typeof window === 'undefined') return;

  try {
    const journey = getUserJourney();
    journey.push({
      page,
      action: action || 'view',
      timestamp: new Date().toISOString(),
    });

    // Keep only last 50 steps
    const recent = journey.slice(-50);
    
    localStorage.setItem(STORAGE_KEYS.USER_JOURNEY, JSON.stringify(recent));
  } catch (error) {
    console.error('Error tracking user journey:', error);
  }
}

export function getUserJourney(): Array<{
  page: string;
  action: string;
  timestamp: string;
}> {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_JOURNEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// ==================== Drop-off Tracking ====================

export function trackDropOff(page: string, timeSpent: number): void {
  if (typeof window === 'undefined') return;

  try {
    const dropOffs = getDropOffs();
    dropOffs.push({
      page,
      timeSpent,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 100 drop-offs
    const recent = dropOffs.slice(-100);
    
    localStorage.setItem(STORAGE_KEYS.DROP_OFFS, JSON.stringify(recent));
  } catch (error) {
    console.error('Error tracking drop-off:', error);
  }
}

export function getDropOffs(): Array<{
  page: string;
  timeSpent: number;
  timestamp: string;
}> {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DROP_OFFS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// ==================== Analytics Summary ====================

export function getAnalyticsSummary() {
  const propertyViews = getPropertyViews();
  const pageViews = getPageViews();
  const journey = getUserJourney();
  const dropOffs = getDropOffs();

  // Calculate total page views
  let totalPageViews = 0;
  Object.values(pageViews).forEach((dayViews) => {
    Object.values(dayViews).forEach((count) => {
      totalPageViews += count;
    });
  });

  // Most popular pages
  const pageCounts: Record<string, number> = {};
  Object.values(pageViews).forEach((dayViews) => {
    Object.entries(dayViews).forEach(([page, count]) => {
      pageCounts[page] = (pageCounts[page] || 0) + count;
    });
  });

  const mostPopularPages = Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([page]) => page);

  return {
    totalPropertyViews: propertyViews.reduce((sum, p) => sum + p.views, 0),
    uniquePropertiesViewed: propertyViews.length,
    mostViewedProperties: propertyViews
      .sort((a, b) => b.views - a.views)
      .slice(0, 10),
    totalPageViews,
    mostPopularPages,
    journeySteps: journey.length,
    dropOffCount: dropOffs.length,
  };
}

