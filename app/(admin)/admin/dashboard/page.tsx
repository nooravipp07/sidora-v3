'use client';

import { useAuth, useLogout } from '@/lib/auth/useAuth';
import { UserProfile } from '@/lib/auth/UserProfile';
import Link from 'next/link';

/**
 * Example protected dashboard page
 * Shows various authentication features
 */
export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const logout = useLogout();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-200 rounded-full animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Not authenticated</p>
          <Link href="/login" className="text-blue-600 hover:underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const getRoleLabel = (roleId: number | null) => {
    const roles: Record<number, string> = {
      1: 'Administrator',
      2: 'Operator',
      3: 'User',
    };
    return roles[roleId || 0] || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-sm text-gray-600">SIDORA System</p>
          </div>
          <UserProfile />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h2>
          <p className="text-blue-100">
            You are logged in as {getRoleLabel(user.roleId)}
          </p>
        </div>

        {/* User Information Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-900 font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900 font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role ID:</span>
                <span className="text-gray-900 font-medium">{user.roleId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.status === 1
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 1 ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="text-gray-900 font-medium text-sm">{String(user.id)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/profile"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-center"
              >
                Edit Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="block w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition text-center"
              >
                Settings
              </Link>
              <button
                onClick={() => logout()}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Pages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/data-atlet"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition"
            >
              <h4 className="font-semibold text-gray-900">Data Atlet</h4>
              <p className="text-sm text-gray-600 mt-1">Manage athlete data</p>
            </Link>
            <Link
              href="/admin/data-klub"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition"
            >
              <h4 className="font-semibold text-gray-900">Data Klub</h4>
              <p className="text-sm text-gray-600 mt-1">Manage club data</p>
            </Link>
            <Link
              href="/admin/olahraga-masyarakat"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition"
            >
              <h4 className="font-semibold text-gray-900">Olahraga Masyarakat</h4>
              <p className="text-sm text-gray-600 mt-1">Community sports data</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
