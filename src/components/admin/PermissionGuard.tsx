'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Permission, hasPermission } from '@/lib/permissions';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const userData = sessionStorage.getItem('admin_user');
    if (!userData) {
      router.push('/admin');
      return;
    }

    try {
      const user = JSON.parse(userData);
      const userPermissions = (user.permissions || []) as Permission[];
      const access = hasPermission(userPermissions, permission);
      setHasAccess(access);

      if (!access) {
        // User doesn't have permission, redirect after a moment
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setHasAccess(false);
    }
  }, [permission, router]);

  if (hasAccess === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#efb105]"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return fallback || (
      <div className="container px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <AlertCircle className="h-6 w-6" />
              <h2 className="text-xl font-bold">Access Denied</h2>
            </div>
            <p className="text-gray-700 mb-4">
              You don't have permission to access this page. Please contact an administrator to grant you the necessary permissions.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

