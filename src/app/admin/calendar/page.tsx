'use client';

import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';

const localizer = momentLocalizer(moment);

interface ScheduledItem {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'blog_post' | 'property' | 'testimonial';
  status: string;
}

export default function ContentCalendarPage() {
  const [events, setEvents] = useState<ScheduledItem[]>([]);
  const [currentView, setCurrentView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadScheduledContent();
  }, []);

  const loadScheduledContent = async () => {
    try {
      // Load scheduled blog posts
      const blogResponse = await fetch('/api/admin/blog');
      const blogData = await blogResponse.json();
      const blogPosts = blogData.posts || [];

      // Load scheduled properties
      const propertiesResponse = await fetch('/api/admin/properties');
      const propertiesData = await propertiesResponse.json();
      const properties = propertiesData.properties || [];

      const scheduledItems: ScheduledItem[] = [];

      // Add scheduled blog posts
      blogPosts
        .filter((post: any) => post.status === 'scheduled' && post.scheduledPublishAt)
        .forEach((post: any) => {
          scheduledItems.push({
            id: post.id,
            title: post.title,
            start: new Date(post.scheduledPublishAt),
            end: new Date(post.scheduledPublishAt),
            type: 'blog_post',
            status: post.status,
          });
        });

      // Add scheduled properties (if they have scheduled dates)
      properties
        .filter((prop: any) => prop.scheduledPublishAt)
        .forEach((prop: any) => {
          scheduledItems.push({
            id: prop.id,
            title: prop.title,
            start: new Date(prop.scheduledPublishAt),
            end: new Date(prop.scheduledPublishAt),
            type: 'property',
            status: prop.status,
          });
        });

      setEvents(scheduledItems);
    } catch (error) {
      console.error('Error loading scheduled content:', error);
    }
  };

  const eventStyleGetter = (event: ScheduledItem) => {
    let backgroundColor = '#3174ad';
    if (event.type === 'blog_post') backgroundColor = '#2563eb';
    if (event.type === 'property') backgroundColor = '#16a34a';
    if (event.type === 'testimonial') backgroundColor = '#ea580c';

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Calendar</h1>
        <p className="text-muted-foreground">View and manage scheduled content</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Scheduled Content
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('month')}
              >
                Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('week')}
              >
                Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('day')}
              >
                Day
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={currentView}
              onView={setCurrentView}
              date={currentDate}
              onNavigate={setCurrentDate}
              eventPropGetter={eventStyleGetter}
              tooltipAccessor={(event) => `${event.title} (${event.type})`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

