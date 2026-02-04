'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { PERMISSIONS } from '@/lib/permissions';

interface AdminUser {
  id: string;
  username: string;
  role?: 'admin' | 'editor';
  permissions?: string[];
  createdAt: string;
  lastLogin?: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to load users');
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      // Reload users
      loadUsers();
    } catch (error: any) {
      alert(error.message || 'Failed to delete user');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#efb105]" />
      </div>
    );
  }

  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_USERS}>
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-600">Manage admin users and access</p>
        </div>
        <Link href="/admin/users/new">
          <Button className="bg-[#efb105] hover:bg-[#d9a004] text-black">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">No users found.</p>
            <Link href="/admin/users/new">
              <Button className="bg-[#efb105] hover:bg-[#d9a004] text-black">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Your First User
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{user.username}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {user.role || 'admin'}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-[#efb105]/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-[#efb105]">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  {user.lastLogin && (
                    <p className="text-xs text-gray-500">
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">Permissions:</p>
                    {user.permissions && user.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.slice(0, 3).map((perm) => (
                          <span
                            key={perm}
                            className="text-xs px-2 py-0.5 bg-[#efb105]/10 text-[#efb105] rounded"
                          >
                            {perm.replace('manage_', '')}
                          </span>
                        ))}
                        {user.permissions.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{user.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No permissions</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/admin/users/${user.id}/edit`}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
                    onClick={() => handleDelete(user.id, user.username)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </PermissionGuard>
  );
}

