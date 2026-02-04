'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2, Key } from 'lucide-react';
import Link from 'next/link';
import { Permission, PERMISSIONS, PERMISSION_LABELS, getAllPermissions } from '@/lib/permissions';

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  role: z.enum(['admin', 'editor']).optional(),
  permissions: z.array(z.string()).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/users/${id}`);
      if (!response.ok) {
        throw new Error('Failed to load user');
      }
      const data = await response.json();
      const user = data.user;

      reset({
        username: user.username,
        role: user.role || 'editor',
        permissions: user.permissions || [],
      });
      
      setSelectedPermissions(user.permissions || []);
    } catch (error: any) {
      alert(error.message || 'Failed to load user');
      router.push('/admin/users');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = (permission: Permission) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          permissions: selectedPermissions,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }

      router.push('/admin/users');
    } catch (error: any) {
      alert(error.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 3) {
      alert('Password must be at least 3 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch(`/api/admin/users/${id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change password');
      }

      alert('Password changed successfully');
      setNewPassword('');
      setShowPasswordForm(false);
    } catch (error: any) {
      alert(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
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
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600">Update user details and permissions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <Input
                    {...register('username')}
                    className={errors.username ? 'border-red-500' : ''}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    {...register('role')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#efb105] focus:border-transparent"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permissions *
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Select what this user can access. Users with no permissions can only view the dashboard.
                  </p>
                  <div className="space-y-2 border border-gray-200 rounded-md p-4 max-h-64 overflow-y-auto">
                    {getAllPermissions().map((permission) => (
                      <label
                        key={permission}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                          className="rounded border-gray-300 text-[#efb105] focus:ring-[#efb105]"
                        />
                        <span className="text-sm text-gray-700">
                          {PERMISSION_LABELS[permission]}
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedPermissions.length === 0 && (
                    <p className="text-xs text-amber-600 mt-2">
                      ⚠️ No permissions selected. User will only have dashboard access.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showPasswordForm ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full"
                  >
                    Change User Password
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password *
                      </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        minLength={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        onClick={handlePasswordChange}
                        disabled={isChangingPassword || !newPassword || newPassword.length < 3}
                        className="flex-1 bg-[#efb105] hover:bg-[#d9a004] text-black"
                      >
                        {isChangingPassword ? 'Changing...' : 'Change Password'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setNewPassword('');
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Save Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#efb105] hover:bg-[#d9a004] text-black"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

