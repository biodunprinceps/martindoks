'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your admin settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <Button className="w-full bg-[#efb105] hover:bg-[#d9a004] text-black">
              Update Password
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <Input type="email" placeholder="admin@martindokshomes.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Newsletter From Email
              </label>
              <Input type="email" placeholder="newsletter@martindokshomes.com" />
            </div>
            <Button variant="outline" className="w-full">
              Save Email Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Database</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Currently using file-based storage. Migrate to a database when ready for production.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline">Export Data</Button>
              <Button variant="outline">Backup Database</Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

