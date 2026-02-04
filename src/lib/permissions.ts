import { Permission } from './user-storage';

// Re-export Permission type for convenience
export type { Permission };

export const PERMISSIONS = {
  MANAGE_BLOG: 'manage_blog' as Permission,
  MANAGE_PROPERTIES: 'manage_properties' as Permission,
  MANAGE_TESTIMONIALS: 'manage_testimonials' as Permission,
  MANAGE_SUBSCRIBERS: 'manage_subscribers' as Permission,
  MANAGE_USERS: 'manage_users' as Permission,
  MANAGE_SETTINGS: 'manage_settings' as Permission,
} as const;

export const PERMISSION_LABELS: Record<Permission, string> = {
  manage_blog: 'Manage Blog Posts',
  manage_properties: 'Manage Properties',
  manage_testimonials: 'Manage Testimonials',
  manage_subscribers: 'Manage Subscribers',
  manage_users: 'Manage Users',
  manage_settings: 'Manage Settings',
};

export const PERMISSION_ROUTES: Record<Permission, string> = {
  manage_blog: '/admin/blog',
  manage_properties: '/admin/properties',
  manage_testimonials: '/admin/testimonials',
  manage_subscribers: '/admin/subscribers',
  manage_users: '/admin/users',
  manage_settings: '/admin/settings',
};

export function hasPermission(userPermissions: Permission[] | undefined, permission: Permission): boolean {
  // If user has no permissions array or it's empty, they have no access
  if (!userPermissions || userPermissions.length === 0) {
    return false;
  }
  return userPermissions.includes(permission);
}

export function hasAnyPermission(userPermissions: Permission[] | undefined, permissions: Permission[]): boolean {
  if (!userPermissions || userPermissions.length === 0) {
    return false;
  }
  return permissions.some(permission => userPermissions.includes(permission));
}

export function getAllPermissions(): Permission[] {
  return Object.values(PERMISSIONS);
}

