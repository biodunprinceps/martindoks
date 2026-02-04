'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  Users, 
  Mail, 
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hasPermission, PERMISSIONS, PERMISSION_ROUTES } from '@/lib/permissions';

const allMenuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, permission: null },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText, permission: PERMISSIONS.MANAGE_BLOG },
  { href: '/admin/properties', label: 'Properties', icon: Building2, permission: PERMISSIONS.MANAGE_PROPERTIES },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare, permission: PERMISSIONS.MANAGE_TESTIMONIALS },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Mail, permission: PERMISSIONS.MANAGE_SUBSCRIBERS },
  { href: '/admin/calendar', label: 'Content Calendar', icon: LayoutDashboard, permission: PERMISSIONS.MANAGE_BLOG },
  { href: '/admin/users', label: 'Users', icon: Users, permission: PERMISSIONS.MANAGE_USERS },
  { href: '/admin/settings', label: 'Settings', icon: Settings, permission: PERMISSIONS.MANAGE_SETTINGS },
];

interface AdminUser {
  id: string;
  username: string;
  role?: 'admin' | 'editor';
  permissions?: string[];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = sessionStorage.getItem('admin_authenticated');
    const userData = sessionStorage.getItem('admin_user');
    if (authStatus === 'true' && userData) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setCurrentUser(data.user);
      } else {
        alert(data.error || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to login. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#efb105]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex-shrink-0"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>
            <Link href="/admin" className="text-base sm:text-lg md:text-xl font-bold text-[#efb105] truncate">
              Admin Dashboard
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {currentUser && (
              <span className="hidden sm:inline text-xs sm:text-sm text-gray-600">
                Logged in as: <span className="font-semibold text-[#efb105]">{currentUser.username}</span>
              </span>
            )}
            <Link href="/" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap">
              <span className="hidden sm:inline">View Site</span>
              <span className="sm:hidden">Site</span>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-40
          w-56 sm:w-64 bg-white border-r shadow-lg md:shadow-none
          transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-300 ease-in-out
          pt-14 sm:pt-16 md:pt-0
        `}>
          <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2">
            {allMenuItems
              .filter((item) => {
                // Dashboard is always accessible
                if (!item.permission) return true;
                // Check if user has permission
                return currentUser?.permissions && hasPermission(currentUser.permissions as any[], item.permission);
              })
              .map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-[#efb105]/10 hover:text-[#efb105] transition-colors"
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="font-medium truncate">{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (username: string, password: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onLogin(username, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-card-foreground mb-2">Admin Login</h1>
          <p className="text-muted-foreground">Enter your credentials to access admin dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#efb105] hover:bg-[#d9a004] text-black font-semibold py-3 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

