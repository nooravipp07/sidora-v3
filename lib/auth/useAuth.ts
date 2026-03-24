'use client';

import { useState, useEffect } from 'react';

export interface AuthUser {
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

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🎯 [useAuth] Hook mounted - starting fetch');
    
    const fetchUser = async () => {
      console.log('🚀 [useAuth] fetchUser function called');
      try {
        setLoading(true);
        console.log('⏳ [useAuth] Sending fetch to /api/auth/me');
        
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Include cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('📞 [useAuth] Response received, status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Sesi Anda telah berakhir, silakan login kembali');
            setUser(null);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('📡 [useAuth] Raw API response:', data);
        console.log('📡 [useAuth] Response user object keys:', Object.keys(data.user || {}));
        console.log('📡 [useAuth] Full user object:', JSON.stringify(data.user, null, 2));
        
        if (data.success && data.user) {
          console.log('✅ [useAuth] User data received from API:');
          console.log('   ID:', data.user.id);
          console.log('   Name:', data.user.name);
          console.log('   RoleId:', data.user.roleId);
          console.log('   KecamatanId:', data.user.kecamatanId);
          console.log('   KecamatanId exists:', 'kecamatanId' in data.user);
          console.log('   All keys:', Object.keys(data.user));
          
          // Explicitly create typed user object
          const userData: AuthUser = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            namaLengkap: data.user.namaLengkap || '',
            noTelepon: data.user.noTelepon,
            roleId: data.user.roleId,
            kecamatanId: data.user.kecamatanId, // EXPLICIT mapping
            status: data.user.status,
            lastLogin: data.user.lastLogin,
            createdAt: data.user.createdAt,
            role: data.user.role,
          };
          
          console.log('🔧 [useAuth] After explicit mapping:');
          console.log('   userData.kecamatanId:', userData.kecamatanId);
          console.log('   userData:', userData);
          
          setUser(userData);
          setError(null);
        } else {
          setError(data.message || 'Gagal mengambil data user');
          setUser(null);
        }
      } catch (err) {
        console.error('useAuth error:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
}
