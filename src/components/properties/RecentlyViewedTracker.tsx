'use client';

import { useEffect } from 'react';
import { addToRecentlyViewed } from '@/lib/property-client-storage';

interface RecentlyViewedTrackerProps {
  propertyId: string;
}

export function RecentlyViewedTracker({ propertyId }: RecentlyViewedTrackerProps) {
  useEffect(() => {
    if (propertyId) {
      addToRecentlyViewed(propertyId);
    }
  }, [propertyId]);

  return null;
}

