'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const getNavigationItems = (role: string) => {
  const baseItems = [
    { name: 'Products', href: '/admin/products', icon: Package, roles: ['admin', 'employee'] },
    { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
    { name: 'My Orders', href: '/admin/my-orders', icon: ShoppingCart, roles: ['customer'] },
    { name: 'Profile', href: '/admin/profile', icon: User, roles: ['customer', 'employee', 'admin'] },
  ];

  return baseItems.filter(item => item.roles.includes(role));
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { authState, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!authState.isAuthenticated || !authState.user) {
    router.push('/admin/login');
    return null;
  }

  const navigationItems = getNavigationItems(authState.user.role);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">
            JB HI-FI Admin
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {authState.user.firstName[0]}{authState.user.lastName[0]}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {authState.user.firstName} {authState.user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {authState.user.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <div className="px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 mb-1"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome back, {authState.user.firstName}!
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
