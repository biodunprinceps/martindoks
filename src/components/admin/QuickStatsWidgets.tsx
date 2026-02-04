'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
// Removed getTodayActivities import - using API instead

interface QuickStats {
  todaysActivity: {
    newPosts: number;
    newProperties: number;
    newInquiries: number;
  };
  pendingTasks: {
    drafts: number;
    scheduled: number;
    unverified: number;
  };
  performanceAlerts: {
    lowPerforming: number;
    errors: number;
  };
  upcoming: {
    scheduledPosts: number;
    reminders: number;
  };
}

export function QuickStatsWidgets() {
  const [stats, setStats] = useState<QuickStats>({
    todaysActivity: { newPosts: 0, newProperties: 0, newInquiries: 0 },
    pendingTasks: { drafts: 0, scheduled: 0, unverified: 0 },
    performanceAlerts: { lowPerforming: 0, errors: 0 },
    upcoming: { scheduledPosts: 0, reminders: 0 },
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load today's activities from API
      let newPosts = 0;
      let newProperties = 0;
      try {
        const activitiesResponse = await fetch('/api/admin/activity?limit=100');
        const activitiesData = await activitiesResponse.json();
        const todayActivities = activitiesData.activities || [];
        
        // Count by entity type and action
        newPosts = todayActivities.filter(
          (a: any) => a.entityType === 'blog_post' && a.action.includes('create')
        ).length;
        
        newProperties = todayActivities.filter(
          (a: any) => a.entityType === 'property' && a.action.includes('create')
        ).length;
      } catch (error) {
        console.error('Error loading activities:', error);
      }

      // Load drafts and scheduled posts
      const blogResponse = await fetch('/api/admin/blog');
      const blogData = await blogResponse.json();
      const drafts = blogData.posts?.filter((p: any) => p.status === 'draft').length || 0;
      const scheduled = blogData.posts?.filter((p: any) => p.status === 'scheduled').length || 0;

      // Load unverified subscribers
      const subscribersResponse = await fetch('/api/admin/stats/subscribers');
      const subscribersData = await subscribersResponse.json();
      const unverified = (subscribersData.total || 0) - (subscribersData.verified || 0);

      setStats({
        todaysActivity: {
          newPosts,
          newProperties,
          newInquiries: 0, // Would need to track inquiries separately
        },
        pendingTasks: {
          drafts,
          scheduled,
          unverified,
        },
        performanceAlerts: {
          lowPerforming: 0, // Would need performance metrics
          errors: 0, // Would need error tracking
        },
        upcoming: {
          scheduledPosts: scheduled,
          reminders: 0,
        },
      });
    } catch (error) {
      console.error('Error loading quick stats:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Today's Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Today's Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">New Posts</span>
              <span className="font-medium">{stats.todaysActivity.newPosts}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">New Properties</span>
              <span className="font-medium">{stats.todaysActivity.newProperties}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Inquiries</span>
              <span className="font-medium">{stats.todaysActivity.newInquiries}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Pending Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Drafts</span>
              <span className="font-medium">{stats.pendingTasks.drafts}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Scheduled</span>
              <span className="font-medium">{stats.pendingTasks.scheduled}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Unverified</span>
              <span className="font-medium">{stats.pendingTasks.unverified}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Low Performance</span>
              <span className="font-medium">{stats.performanceAlerts.lowPerforming}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Errors</span>
              <span className="font-medium text-red-600">{stats.performanceAlerts.errors}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Scheduled Posts</span>
              <span className="font-medium">{stats.upcoming.scheduledPosts}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reminders</span>
              <span className="font-medium">{stats.upcoming.reminders}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

