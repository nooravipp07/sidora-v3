'use client';

import { useEffect, useState, useCallback, useContext, createContext, ReactNode } from 'react';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  namaLengkap: string;
  noTelepon?: string;
  roleId: number | null;
  kecamatanId: number | null;
  status: number | null;
  lastLogin?: string;
  createdAt?: string;
  role?: {
    id: number;
    name: string;
    description: string;
  };
}

interface AuthContext {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Create context
const AuthContextObj = createContext<AuthContext | undefined>(undefined);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              namaLengkap: data.user.namaLengkap || '',
              noTelepon: data.user.noTelepon,
              roleId: data.user.roleId,
              kecamatanId: data.user.kecamatanId,
              status: data.user.status,
              lastLogin: data.user.lastLogin,
              createdAt: data.user.createdAt,
              role: data.user.role,
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Failed to fetch user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContextObj.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
      }}
    >
      {children}
    </AuthContextObj.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContextObj);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Hook to check if user has specific role
export const useRole = (allowedRoles: number[]) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  const hasRole = useCallback(() => {
    if (!isAuthenticated || !user) return false;
    return user.roleId ? allowedRoles.includes(user.roleId) : false;
  }, [user, isAuthenticated, allowedRoles]);

  return { hasRole: hasRole(), isLoading, user };
};

// Hook to manually logout
export const useLogout = () => {
  const logout = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Redirect to login
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return logout;
};
