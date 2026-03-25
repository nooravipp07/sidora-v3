'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SummaryCard from '@/components/admin/dashboard/SummaryCard';
import DashboardMap from '@/components/admin/dashboard/DashboardMap';
import DistrictTable from '@/components/admin/dashboard/DistrictTable';
import { useAuth } from '@/lib/auth/useAuth';

interface DashboardSummary {
  totalDesaKelurahan: number;
  totalInfrastructure: number;
  totalSportsGroups: number;
  totalAthletes: number;
  athletesByCategory: {
    atlet: number;
    pelatih: number;
    wasitJuri: number;
  };
}

interface DashboardData {
  success: boolean;
  kecamatan: any;
  summary: DashboardSummary;
  data: {
    desaKelurahan: any[];
    facilityRecords: any[];
    sportsGroups: any[];
    athletes: any[];
  };
}

export default function DashboardKecamatanPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, error: authError, isAuthenticated } = useAuth();
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and role
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Check if user has roleId == 3 (Kecamatan/District role)
      if (user?.roleId !== 3) {
        setError('Anda tidak memiliki akses ke halaman ini. Hanya role Kecamatan yang dapat mengakses.');

        console.log(user)
        return;
      }

      // Check if user has kecamatanId
      if (!user?.kecamatanId) {
        console.log(user)
        setError('Data kecamatan tidak ditemukan pada profil user. Hubungi administrator.');
        return;
      }

      // Fetch dashboard data
      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/dashboard/kecamatan?kecamatanId=${user.kecamatanId}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
          }
          
          const data = await response.json();
          setDashboardData(data);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
          setDashboardData(null);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Show loading state
  if (authLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Kecamatan</h1>
          <p className="text-gray-600 mt-2">Ringkasan data kecamatan</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Memverifikasi akses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show auth error
  if (authError) {
    return (
      <div className="w-full space-y-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Kecamatan</h1>
          <p className="text-gray-600 mt-2">Ringkasan data kecamatan</p>
        </div>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-semibold">{authError}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Ke Login
          </button>
        </div>
      </div>
    );
  }

  // Show loading state for data
  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Kecamatan</h1>
          <p className="text-gray-600 mt-2">Ringkasan data kecamatan</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full space-y-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Kecamatan</h1>
          <p className="text-gray-600 mt-2">Ringkasan data kecamatan</p>
        </div>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  // Show data
  if (!dashboardData) {
    return (
      <div className="w-full space-y-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Kecamatan</h1>
          <p className="text-gray-600 mt-2">Ringkasan data kecamatan</p>
        </div>
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 font-semibold">Data tidak tersedia</p>
        </div>
      </div>
    );
  }

  const summary = dashboardData.summary;
  const allDistricts = dashboardData.data.desaKelurahan;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Kecamatan
        </h1>
        <p className="text-gray-600 mt-2">
          {dashboardData.kecamatan?.nama || 'Ringkasan data kecamatan'}
        </p>
      </div>

      {/* Filter Section */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Desa / Kelurahan"
          value={summary.totalDesaKelurahan}
          icon="📍"
          color="blue"
        />
        <SummaryCard
          label="Infrastruktur Olahraga"
          value={summary.totalInfrastructure}
          icon="🏟️"
          color="green"
        />
        <SummaryCard
          label="Kelompok Olahraga"
          value={summary.totalSportsGroups}
          icon="🏢"
          color="orange"
        />
        <SummaryCard
          label="Total Atlet"
          value={summary.totalAthletes}
          icon="⚡"
          color="purple"
        />
      </div>

      {/* Athletes Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          label="Atlet"
          value={summary.athletesByCategory.atlet}
          icon="🏃"
          color="blue"
        />
        <SummaryCard
          label="Pelatih"
          value={summary.athletesByCategory.pelatih}
          icon="👨‍🏫"
          color="green"
        />
        <SummaryCard
          label="Wasit / Juri"
          value={summary.athletesByCategory.wasitJuri}
          icon="🏆"
          color="purple"
        />
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Peta Distribusi
        </h2>
        {/* <DashboardMap districts={allDistricts} /> */}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Data Desa / Kelurahan
        </h2>
        <DistrictTable
          districts={allDistricts}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
