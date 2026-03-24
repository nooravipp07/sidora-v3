'use client';

import React, { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Trophy,
  Building2,
  Calendar,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Eye,
  TrendingDown,
  BarChart3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

interface ActivityItem {
  id: number;
  user: string;
  role: string;
  action: string;
  time: string;
  avatar: string;
  color: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
}

interface VerificationItem {
  id: number;
  namaLengkap: string;
  email: string;
  noTelepon: string;
  jenisAkun: string;
  kecamatan: string;
  status: 'Waiting For Approve' | 'Approved' | 'Rejected';
  tanggalPendaftaran: string;
}

interface VisitorStats {
  totalVisitors: number;
  previousPeriodVisitors: number;
  todayVisitors: number;
  averageDailyVisitors: number;
  lastUpdated: string;
  trend: {
    difference: number;
    percentage: number;
    isPositive: boolean;
  };
  period: {
    current: string;
    previous: string;
  };
}

const Dashboard: FC = () => {
  const [visitorData, setVisitorData] = useState<VisitorStats | null>(null);
  const [isLoadingVisitors, setIsLoadingVisitors] = useState(true);
  const [visitorError, setVisitorError] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<VerificationItem[]>([]);
  const [isLoadingVerification, setIsLoadingVerification] = useState(true);

  // Fetch verification data from API
  const fetchVerificationData = async () => {
    try {
      setIsLoadingVerification(true);
      const response = await fetch('/api/registration?page=1&limit=10&status=1');
      
      if (!response.ok) {
        throw new Error('Failed to fetch verification data');
      }
      
      const data = await response.json();
      const registrations = data.data || [];
      
      // Map API response to VerificationItem format
      const mappedData = registrations.map((reg: any) => ({
        id: reg.id,
        namaLengkap: reg.namaLengkap,
        email: reg.email,
        noTelepon: reg.noTelepon,
        jenisAkun: reg.jenisAkun === 1 ? 'KONI' : reg.jenisAkun === 2 ? 'KECAMATAN' : 'USER',
        kecamatan: reg.kecamatan?.nama || '',
        status: 'Waiting For Approve' as const,
        tanggalPendaftaran: new Date(reg.createdAt).toLocaleString('id-ID')
      }));
      
      setVerificationData(mappedData);
    } catch (error) {
      console.error('Error fetching verification data:', error);
    } finally {
      setIsLoadingVerification(false);
    }
  };

  // Fetch visitor statistics from API
  const fetchVisitorStats = async () => {
    try {
      setIsLoadingVisitors(true);
      setVisitorError(null);
      const response = await fetch('/api/analytics/visitors');
      
      if (!response.ok) {
        throw new Error('Failed to fetch visitor statistics');
      }
      
      const data = await response.json();
      setVisitorData(data);
    } catch (error) {
      console.error('Error fetching visitor statistics:', error);
      setVisitorError(error instanceof Error ? error.message : 'Failed to load visitor data');
    } finally {
      setIsLoadingVisitors(false);
    }
  };

  useEffect(() => {
    // Fetch visitor stats immediately on mount
    fetchVisitorStats();
    // Fetch verification data immediately on mount
    fetchVerificationData();

    // Set up interval to refetch every minute
    const interval = setInterval(fetchVisitorStats, 60000);

    return () => clearInterval(interval);
  }, []);

  const stats: StatCard[] = [
    {
      title: 'Total Atlet',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Klub Aktif',
      value: '156',
      change: '+8%',
      icon: Trophy,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Sarana Olahraga',
      value: '89',
      change: '+5%',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Event Aktif',
      value: '23',
      change: '-2%',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const activities: ActivityItem[] = [
    {
      id: 1,
      user: 'Admin Kecamatan A',
      role: 'Admin',
      action: 'Menambahkan data atlet baru',
      time: '2 jam yang lalu',
      avatar: '👤',
      color: 'bg-green-500'
    },
    {
      id: 2,
      user: 'Verifikator',
      role: 'Verifikasi',
      action: 'Memverifikasi data klub',
      time: '4 jam yang lalu',
      avatar: '✓',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      user: 'Admin Kota',
      role: 'Admin',
      action: 'Menghapus data sarana',
      time: '1 hari yang lalu',
      avatar: '✕',
      color: 'bg-red-500'
    },
    {
      id: 4,
      user: 'Operator',
      role: 'Operator',
      action: 'Menambahkan berita baru',
      time: '2 hari yang lalu',
      avatar: '📝',
      color: 'bg-green-500'
    }
  ];

  // Verification data is now fetched from API in fetchVerificationData()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Selamat datang, superadmin</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Statistik Bulanan</h2>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Chart akan ditampilkan di sini</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Aktivitas Terkini</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                <div className={`${activity.color} w-10 h-10 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0`}>
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{activity.user}</p>
                  <p className="text-xs text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visitor Counter Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Verifikasi Data Pendaftaran & Akun</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600">
                Total menunggu persetujuan: <span className="font-bold text-orange-600">{verificationData.filter(v => v.status === 'Waiting For Approve').length}</span>
              </span>
            </div>
            <Link 
              href="/admin/verifikasi"
              className="inline-flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Verification Table */}
          <div className="overflow-x-auto">
            {isLoadingVerification ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : verificationData.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                Tidak ada pendaftaran yang menunggu persetujuan
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama Lengkap</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">No. Telepon</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Jenis Akun</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kecamatan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tanggal Pendaftaran</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {verificationData.slice(0, 6).map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.namaLengkap}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.noTelepon}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {item.jenisAkun}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.kecamatan || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        {item.status === 'Waiting For Approve' ? 'Menunggu' : item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.tanggalPendaftaran}</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>

      {/* Visitor Counter Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Statistik Pengunjung</h2>
        
        {visitorError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">⚠️ {visitorError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Visitors Card */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            {isLoadingVisitors ? (
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : visitorData ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-indigo-100 p-4 rounded-lg">
                    <Eye className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${visitorData.trend.isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                    {visitorData.trend.isPositive ? (
                      <TrendingUp className={`w-4 h-4 text-green-600`} />
                    ) : (
                      <TrendingDown className={`w-4 h-4 text-red-600`} />
                    )}
                    <span className={`text-sm font-semibold ${visitorData.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {visitorData.trend.isPositive ? '+' : ''}{visitorData.trend.percentage}%
                    </span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-2">Total Pengunjung</h3>
                <p className="text-4xl font-bold text-gray-900 mb-4">
                  {visitorData.totalVisitors.toLocaleString('id-ID')}
                </p>
                <div className="space-y-2 text-xs text-gray-500">
                  <p>Periode sebelumnya: {visitorData.previousPeriodVisitors.toLocaleString('id-ID')}</p>
                  <p className={`flex items-center gap-1 ${visitorData.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <BarChart3 className="w-3 h-3" />
                    {visitorData.trend.isPositive ? 'Meningkat' : 'Menurun'} {Math.abs(visitorData.trend.difference).toLocaleString('id-ID')}
                  </p>
                </div>
              </>
            ) : null}
          </div>

          {/* Today Visitors Card */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            {isLoadingVisitors ? (
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : visitorData ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-cyan-100 p-4 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-cyan-600" />
                  </div>
                  <span className="text-cyan-600 text-xs font-semibold bg-cyan-100 px-3 py-1 rounded-full">Hari Ini</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-2">Pengunjung Hari Ini</h3>
                <p className="text-4xl font-bold text-gray-900 mb-4">
                  {visitorData.todayVisitors.toLocaleString('id-ID')}
                </p>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>Update: {visitorData.lastUpdated}</span>
                </div>
              </>
            ) : null}
          </div>

          {/* Visitor Insights Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md p-8 border border-indigo-100 hover:shadow-lg transition-shadow">
            {isLoadingVisitors ? (
              <div className="animate-pulse">
                <div className="h-12 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              </div>
            ) : visitorData ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-indigo-600 p-4 rounded-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-4">Wawasan Pengunjung</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rata-rata Harian</span>
                    <span className="font-semibold text-gray-900">{visitorData.averageDailyVisitors.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((visitorData.averageDailyVisitors / 1000) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Data diperbarui setiap menit dari backend analytics
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
