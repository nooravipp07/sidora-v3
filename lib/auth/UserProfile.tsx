'use client';

import { useAuth, useLogout } from '@/lib/auth/useAuth';
import { User, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * User profile avatar/dropdown component
 * Shows current user and logout option
 */
export function UserProfile() {
  const { user, isLoading } = useAuth();
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || !user) {
    return <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse" />;
  }

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
        <span className="text-sm font-medium">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-100"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Authentication status indicator
 */
export function AuthStatus() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <span className="text-xs text-gray-500">Loading...</span>;

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-xs text-gray-600">
        {isAuthenticated ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}
