// Activity Log Utility - Database-backed implementation
import { prisma } from './prisma';
import { isDatabaseEnabled } from './db-config';

export interface ActivityLog {
  id: string;
  userId?: string;
  username?: string;
  action: string;
  entityType: string;
  entityId?: string;
  entityTitle?: string;
  details?: any;
  timestamp: Date;
}

// Log an activity
export async function logActivity(data: {
  userId?: string;
  username?: string;
  action: string;
  entityType: string;
  entityId?: string;
  entityTitle?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  if (isDatabaseEnabled() && prisma) {
    try {
      await prisma.activityLog.create({
        data: {
          userId: data.userId,
          username: data.username,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          entityTitle: data.entityTitle,
          details: data.details ? JSON.parse(JSON.stringify(data.details)) : null,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  } else {
    // Fallback to localStorage for development
    const activities = getActivitiesFromStorage();
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      userId: data.userId,
      username: data.username,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      entityTitle: data.entityTitle,
      details: data.details,
      timestamp: new Date(),
    };
    activities.unshift(newActivity);
    // Keep only last 1000 activities
    if (activities.length > 1000) {
      activities.splice(1000);
    }
    localStorage.setItem('activity_logs', JSON.stringify(activities));
  }
}

// Get recent activities
export async function getRecentActivities(limit: number = 20): Promise<ActivityLog[]> {
  if (isDatabaseEnabled() && prisma) {
    try {
      const activities = await prisma.activityLog.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          username: true,
          action: true,
          entityType: true,
          entityId: true,
          entityTitle: true,
          details: true,
          createdAt: true,
        },
      });
      return activities.map((a: any) => ({
        id: a.id,
        userId: a.userId || undefined,
        username: a.username || undefined,
        action: a.action,
        entityType: a.entityType,
        entityId: a.entityId || undefined,
        entityTitle: a.entityTitle || undefined,
        details: a.details as any,
        timestamp: a.createdAt,
      }));
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  } else {
    const activities = getActivitiesFromStorage();
    return activities.slice(0, limit);
  }
}

// Get activity stats
export async function getActivityStats(): Promise<{
  today: number;
  total: number;
  byType: Record<string, number>;
}> {
  if (isDatabaseEnabled() && prisma) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [todayCount, totalCount, byType] = await Promise.all([
        prisma.activityLog.count({
          where: { createdAt: { gte: today } },
        }),
        prisma.activityLog.count(),
        prisma.activityLog.groupBy({
          by: ['entityType'],
          _count: { entityType: true },
        }),
      ]);

      const byTypeMap: Record<string, number> = {};
      byType.forEach((item: any) => {
        byTypeMap[item.entityType] = item._count.entityType;
      });

      return {
        today: todayCount,
        total: totalCount,
        byType: byTypeMap,
      };
    } catch (error) {
      console.error('Error fetching activity stats:', error);
      return { today: 0, total: 0, byType: {} };
    }
  } else {
    const activities = getActivitiesFromStorage();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayActivities = activities.filter(
      (a) => new Date(a.timestamp) >= today
    );

    const byType: Record<string, number> = {};
    activities.forEach((a: ActivityLog) => {
      byType[a.entityType] = (byType[a.entityType] || 0) + 1;
    });

    return {
      today: todayActivities.length,
      total: activities.length,
      byType,
    };
  }
}

// Export activity logs as CSV
export function exportActivityLogsAsCSV(activities?: ActivityLog[]): string {
  const logs = activities || getActivitiesFromStorage();
  const headers = ['Date', 'User', 'Action', 'Entity Type', 'Entity Title', 'Details'];
  const rows = logs.map((log) => [
    new Date(log.timestamp).toISOString(),
    log.username || 'System',
    log.action,
    log.entityType,
    log.entityTitle || '',
    JSON.stringify(log.details || {}),
  ]);

  return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
}

// Helper function for localStorage fallback
function getActivitiesFromStorage(): ActivityLog[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('activity_logs');
  if (!stored) return [];
  try {
    const activities = JSON.parse(stored);
    return activities.map((a: any) => ({
      ...a,
      timestamp: new Date(a.timestamp),
    }));
  } catch {
    return [];
  }
}
