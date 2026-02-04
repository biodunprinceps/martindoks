'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { exportActivityLogsAsCSV, type ActivityLog } from '@/lib/activity-log';
import { FileText, Building2, MessageSquare, Users, Mail, Download, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  limit?: number;
  showFilters?: boolean;
  showExport?: boolean;
}

export function ActivityFeed({ limit = 20, showFilters = false, showExport = true }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadActivities();
    loadStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      loadActivities();
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [filter, limit]);

  const loadActivities = async () => {
    try {
      const params = new URLSearchParams();
      params.set('limit', limit.toString());
      if (filter !== 'all') {
        params.set('entityType', filter);
      }
      const response = await fetch(`/api/admin/activity?${params.toString()}`);
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/activity');
      const data = await response.json();
      setStats(data.stats || { today: 0, total: 0, byType: {} });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({ today: 0, total: 0, byType: {} });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/activity');
      const data = await response.json();
      const csv = exportActivityLogsAsCSV(data.activities || []);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting activities:', error);
      alert('Failed to export activities');
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'property':
        return <Building2 className="h-4 w-4" />;
      case 'testimonial':
        return <MessageSquare className="h-4 w-4" />;
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'subscriber':
        return <Mail className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('create') || action.includes('add')) return 'text-green-600';
    if (action.includes('update') || action.includes('edit')) return 'text-blue-600';
    if (action.includes('delete') || action.includes('remove')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Activity Feed</CardTitle>
          <div className="flex items-center gap-2">
            {showFilters && (
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">All Activities</option>
                <option value="blog">Blog Posts</option>
                <option value="property">Properties</option>
                <option value="testimonial">Testimonials</option>
                <option value="user">Users</option>
                <option value="subscriber">Subscribers</option>
              </select>
            )}
            {showExport && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
        {stats && (
          <p className="text-sm text-muted-foreground">
            {stats.today} activities today • {stats.total} total
          </p>
        )}
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No activities to display
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 bg-muted rounded-lg">
                  {getEntityIcon(activity.entityType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{activity.username}</span>
                    <span className={`text-sm ${getActionColor(activity.action)}`}>
                      {activity.action}
                    </span>
                    {activity.entityTitle && (
                      <span className="text-sm text-muted-foreground truncate">
                        {activity.entityTitle}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground capitalize">
                      {activity.entityType}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

