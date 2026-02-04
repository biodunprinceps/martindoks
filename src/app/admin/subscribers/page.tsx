'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { PERMISSIONS } from '@/lib/permissions';

interface Subscriber {
  id: string;
  email: string;
  verified: boolean;
  verifiedAt: string | null;
  subscribedAt: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  useEffect(() => {
    loadSubscribers();
  }, [filter]);

  const loadSubscribers = async () => {
    try {
      const response = await fetch(`/api/admin/subscribers?filter=${filter}`);
      const data = await response.json();
      setSubscribers(data.subscribers || []);
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const verified = subscribers.filter(s => s.verified);
    const csv = [
      'Email,Subscribed At,Verified At',
      ...verified.map(s => 
        `${s.email},${new Date(s.subscribedAt).toLocaleDateString()},${s.verifiedAt ? new Date(s.verifiedAt).toLocaleDateString() : ''}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const verifiedCount = subscribers.filter(s => s.verified).length;
  const unverifiedCount = subscribers.length - verifiedCount;

  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_SUBSCRIBERS}>
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter Subscribers</h1>
          <p className="text-gray-600">Manage your newsletter subscribers</p>
        </div>
        <Button
          onClick={exportToCSV}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">{subscribers.length}</p>
              </div>
              <Mail className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Verified</p>
                <p className="text-3xl font-bold text-green-600">{verifiedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Unverified</p>
                <p className="text-3xl font-bold text-orange-600">{unverifiedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-[#efb105] hover:bg-[#d9a004] text-black' : ''}
        >
          All
        </Button>
        <Button
          variant={filter === 'verified' ? 'default' : 'outline'}
          onClick={() => setFilter('verified')}
          className={filter === 'verified' ? 'bg-[#efb105] hover:bg-[#d9a004] text-black' : ''}
        >
          Verified
        </Button>
        <Button
          variant={filter === 'unverified' ? 'default' : 'outline'}
          onClick={() => setFilter('unverified')}
          className={filter === 'unverified' ? 'bg-[#efb105] hover:bg-[#d9a004] text-black' : ''}
        >
          Unverified
        </Button>
      </div>

      {/* Subscribers List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber, index) => (
                    <motion.tr
                      key={subscriber.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {subscriber.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subscriber.verified ? (
                          <Badge className="bg-green-500">Verified</Badge>
                        ) : (
                          <Badge className="bg-orange-500">Pending</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscriber.verifiedAt
                          ? new Date(subscriber.verifiedAt).toLocaleDateString()
                          : '-'}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
    </PermissionGuard>
  );
}

