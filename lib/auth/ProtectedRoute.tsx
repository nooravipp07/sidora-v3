/**
 * Protected route component wrapper
 * Ensures user is authenticated and optionally has required role
 */

'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: number;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback = <div className="text-center p-8">Access Denied</div>,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (requiredRole && user?.roleId !== requiredRole) {
    return fallback;
  }

  return <>{children}</>;
}

/**
 * Role-based component visibility
 */
interface RoleBasedProps {
  children: ReactNode;
  allowedRoles: number[];
  fallback?: ReactNode;
}

export function RoleBasedAccess({
  children,
  allowedRoles,
  fallback = null,
}: RoleBasedProps) {
  const { user } = useAuth();

  if (!user || !user.roleId || !allowedRoles.includes(user.roleId)) {
    return fallback;
  }

  return <>{children}</>;
}

/**
 * Loading skeleton for auth components
 */
export function AuthSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-gray-200 rounded w-full" />
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-6 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
