'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { PERMISSIONS } from '@/lib/permissions';

export default function PropertiesManagementPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await fetch('/api/admin/properties');
      const data = await response.json();
      // Convert date strings to Date objects
      const props = (data.properties || []).map((prop: any) => ({
        ...prop,
        createdAt: new Date(prop.createdAt),
        updatedAt: new Date(prop.updatedAt),
      }));
      setProperties(props);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadProperties();
      } else {
        alert('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error deleting property');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'ongoing':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-[#efb105]';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_PROPERTIES}>
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties</h1>
          <p className="text-gray-600">Manage your property listings and projects</p>
        </div>
        <Link href="/admin/properties/new">
          <Button className="bg-[#efb105] hover:bg-[#d9a004] text-black">
            <Plus className="mr-2 h-4 w-4" />
            New Property
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">No properties yet</p>
              <Link href="/admin/properties/new">
                <Button variant="outline">Add Your First Property</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.featuredImage}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                    {property.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t">
                    <span className="text-sm text-gray-500">
                      {property.location}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Link href={`/properties/${property.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/properties/${property.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
    </PermissionGuard>
  );
}

