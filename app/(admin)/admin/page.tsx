'use client';

import React, { FC } from 'react';
import {
  Users,
  Trophy,
  Building2,
  Calendar,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight
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

const Dashboard: FC = () => {
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

  const quickActions: QuickAction[] = [
    {
      title: 'Kelola Atlet',
      description: 'Tambah dan edit data atlet',
      icon: Users,
      bgColor: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Kelola Klub',
      description: 'Manajemen klub olahraga',
      icon: Trophy,
      bgColor: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: 'Kelola Kegiatan',
      description: 'Berita, galeri, dan agenda',
      icon: Calendar,
      bgColor: 'bg-purple-50 border-purple-200'
    }
  ];

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

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`${action.bgColor} border-2 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group`}
            >
              <div className="flex items-start justify-between mb-4">
                <action.icon className="w-8 h-8 text-gray-600 group-hover:text-gray-900 transition-colors" />
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{action.description}</p>
              <button className="flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                Buka
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
