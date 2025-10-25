'use client';

import { Search, User, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import useAuth from '@/app/hooks/useAuth';
import { useCart } from '@/app/contexts/CartContext';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const router = useRouter();
  const { isAuthenticated, handleLogout, user } = useAuth();
  const { getTotalItems } = useCart();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Top Info Bar */}
      <div className="bg-green-600 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <p className="hidden md:block">
            Seen it cheaper? Ask for a JB Deal! Live chat or call 13 52 44.
          </p>

        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="md:text-3xl font-bold text-black">
                <span className="text-yellow-500">INFT3050</span>
              </div>
            </Link>
            <div className="text-xs text-gray-600 ml-2 hidden sm:block">
              ALWAYS CHEAP PRICES
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search products"
                className="w-full px-4 py-1 md:py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <Search onClick={handleSearch} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="flex items-center space-x-1 hover:text-yellow-500 transition-colors"
                >
                  <span>sign in</span>
                </Link>
              ):(
                <>
                <Link
                  href="/account/profile"
                  className="flex items-center space-x-1 hover:text-yellow-500 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.username}</span>
                </Link>
                <button
                  onClick={() => handleLogout()}
                  className="flex items-center space-x-1 hover:text-yellow-500 transition-colors cursor-pointer"
                >
                  <span>Logout</span>
                </button>
                </>
              )}
              {
                isAuthenticated && (
                  <Link
                    href="/signup"
                    className="flex items-center space-x-1 hover:text-yellow-500 transition-colors"
                  >
                    <span className="hidden sm:inline">Sign Up</span>
                  </Link>
                )
              }

            </div>
            <Link href="/cart" className="flex items-center space-x-1 hover:text-yellow-500 transition-colors relative">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
