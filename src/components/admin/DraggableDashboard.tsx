'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivityFeed } from './ActivityFeed';
import { QuickStatsWidgets } from './QuickStatsWidgets';
import { EnhancedAnalyticsDashboard } from './EnhancedAnalyticsDashboard';

interface DashboardWidget {
  id: string;
  title: string;
  component: React.ReactNode;
  visible: boolean;
}

interface SortableWidgetProps {
  id: string;
  children: React.ReactNode;
  title: string;
}

function SortableWidget({ id, children, title }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className="relative">
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

interface DraggableDashboardProps {
  userId?: string;
  initialWidgets?: DashboardWidget[];
}

export function DraggableDashboard({ userId, initialWidgets }: DraggableDashboardProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    // Load saved layout from localStorage
    if (typeof window !== 'undefined' && userId) {
      const saved = localStorage.getItem(`dashboard_layout_${userId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed;
        } catch {
          // Fall through to default
        }
      }
    }

    // Default widget layout
    return initialWidgets || [
      {
        id: 'quick-stats',
        title: 'Quick Stats',
        component: <QuickStatsWidgets />,
        visible: true,
      },
      {
        id: 'analytics',
        title: 'Analytics',
        component: <EnhancedAnalyticsDashboard />,
        visible: true,
      },
      {
        id: 'activity-feed',
        title: 'Activity Feed',
        component: <ActivityFeed limit={10} showExport={true} />,
        visible: true,
      },
    ];
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newWidgets = arrayMove(items, oldIndex, newIndex);

        // Save to localStorage
        if (userId && typeof window !== 'undefined') {
          localStorage.setItem(
            `dashboard_layout_${userId}`,
            JSON.stringify(newWidgets)
          );
        }

        return newWidgets;
      });
    }
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets((items) => {
      const newWidgets = items.map((item) =>
        item.id === widgetId ? { ...item, visible: !item.visible } : item
      );

      // Save to localStorage
      if (userId && typeof window !== 'undefined') {
        localStorage.setItem(
          `dashboard_layout_${userId}`,
          JSON.stringify(newWidgets)
        );
      }

      return newWidgets;
    });
  };

  const resetLayout = () => {
    const defaultWidgets = initialWidgets || [
      {
        id: 'quick-stats',
        title: 'Quick Stats',
        component: <QuickStatsWidgets />,
        visible: true,
      },
      {
        id: 'analytics',
        title: 'Analytics',
        component: <EnhancedAnalyticsDashboard />,
        visible: true,
      },
      {
        id: 'activity-feed',
        title: 'Activity Feed',
        component: <ActivityFeed limit={10} showExport={true} />,
        visible: true,
      },
    ];

    setWidgets(defaultWidgets);

    if (userId && typeof window !== 'undefined') {
      localStorage.setItem(
        `dashboard_layout_${userId}`,
        JSON.stringify(defaultWidgets)
      );
    }
  };

  const visibleWidgets = widgets.filter((w) => w.visible);
  const widgetIds = visibleWidgets.map((w) => w.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Dashboard Widgets</h2>
          <p className="text-sm text-muted-foreground">
            Drag widgets to reorder them
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetLayout}>
          Reset Layout
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgetIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {visibleWidgets.map((widget) => (
              <SortableWidget key={widget.id} id={widget.id} title={widget.title}>
                {widget.component}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Widget Visibility Toggle (Optional - can be added to settings) */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm">Widget Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {widgets.map((widget) => (
              <label
                key={widget.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={widget.visible}
                  onChange={() => toggleWidgetVisibility(widget.id)}
                  className="rounded"
                />
                <span className="text-sm text-foreground">{widget.title}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

