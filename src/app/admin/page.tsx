'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Building2, 
  Mail, 
  Users,
  TrendingUp,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DraggableDashboard } from '@/components/admin/DraggableDashboard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogPosts: 0,
    properties: 0,
    testimonials: 0,
    subscribers: 0,
    verifiedSubscribers: 0,
  });
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  useEffect(() => {
    // Get current user ID from session
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem('admin_user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUserId(user.id);
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, []);

  useEffect(() => {
    // Load stats
    const loadStats = async () => {
      try {
        // Blog posts
        const blogResponse = await fetch('/api/admin/stats/blog');
        const blogData = await blogResponse.json();
        
        // Properties
        const propertiesResponse = await fetch('/api/admin/stats/properties');
        const propertiesData = await propertiesResponse.json();
        
        // Testimonials
        const testimonialsResponse = await fetch('/api/admin/testimonials');
        const testimonialsData = await testimonialsResponse.json();
        
        // Subscribers
        const subscribersResponse = await fetch('/api/admin/stats/subscribers');
        const subscribersData = await subscribersResponse.json();

        setStats({
          blogPosts: blogData.count || 0,
          properties: propertiesData.count || 0,
          testimonials: testimonialsData.testimonials?.length || 0,
          subscribers: subscribersData.total || 0,
          verifiedSubscribers: subscribersData.verified || 0,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      href: '/admin/blog',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Properties',
      value: stats.properties,
      icon: Building2,
      href: '/admin/properties',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      icon: MessageSquare,
      href: '/admin/testimonials',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Subscribers',
      value: stats.subscribers,
      icon: Mail,
      href: '/admin/subscribers',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Verified Subscribers',
      value: stats.verifiedSubscribers,
      icon: CheckCircle,
      href: '/admin/subscribers',
      color: 'text-[#efb105]',
      bgColor: 'bg-[#efb105]/10',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your website content and subscribers</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.bgColor} dark:bg-opacity-20 p-3 rounded-lg`}>
                        <Icon className={`h-6 w-6 ${stat.color} dark:opacity-90`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Draggable Dashboard Widgets */}
      <DraggableDashboard userId={currentUserId} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/blog/new">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Create New Blog Post
              </Button>
            </Link>
            <Link href="/admin/properties/new">
              <Button className="w-full justify-start" variant="outline">
                <Building2 className="mr-2 h-4 w-4" />
                Add New Property
              </Button>
            </Link>
            <Link href="/admin/testimonials/new">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add New Testimonial
              </Button>
            </Link>
            <Link href="/admin/subscribers">
              <Button className="w-full justify-start" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                View All Subscribers
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

