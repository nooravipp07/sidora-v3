'use client';

import React, { useState } from 'react';
import { Trophy, Users, MapPin, Calendar, TrendingUp, Building, Award, Medal } from 'lucide-react';
import Link from 'next/link';

interface StatCard {
  icon: React.ComponentType<{ className: string }>;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  change: string;
  positive: boolean;
}

interface SaranaItem {
  kecamatan: string;
  lapangan: number;
  gedung: number;
  kolam: number;
  kondisiBaik: number;
  kondisiRusak: number;
}

interface PrestasiItem {
  nama: string;
  cabor: string;
  kategori: string;
  prestasi: string;
  medali: string;
  tahun: string;
}

interface StatisticsSectionProps {
  statsData?: StatCard[];
  saranaData?: SaranaItem[];
  prestasiData?: PrestasiItem[];
  onDataTableClick?: (data: any) => void;
}

const defaultStats: StatCard[] = [
  {
    icon: Trophy,
    title: "Atlet Terdaftar",
    value: "1,247",
    subtitle: "Atlet Aktif",
    color: "bg-gradient-to-r from-yellow-400 to-yellow-600",
    change: "+12%",
    positive: true
  },
  {
    icon: Users,
    title: "Prestasi Atlet",
    value: "156",
    subtitle: "Klub Terverifikasi",
    color: "bg-gradient-to-r from-blue-500 to-blue-700",
    change: "+8%",
    positive: true
  },
  {
    icon: MapPin,
    title: "Sarana Olahraga",
    value: "89",
    subtitle: "Fasilitas Tersedia",
    color: "bg-gradient-to-r from-green-500 to-green-700",
    change: "+5%",
    positive: true
  },
  {
    icon: Calendar,
    title: "Parasarana Olahraga",
    value: "23",
    subtitle: "Kegiatan Mendatang",
    color: "bg-gradient-to-r from-purple-500 to-purple-700",
    change: "-2%",
    positive: false
  }
];

const defaultSaranaData: SaranaItem[] = [
  { kecamatan: 'Kec. Utara', lapangan: 12, gedung: 8, kolam: 3, kondisiBaik: 18, kondisiRusak: 5 },
  { kecamatan: 'Kec. Selatan', lapangan: 15, gedung: 6, kolam: 2, kondisiBaik: 20, kondisiRusak: 3 },
  { kecamatan: 'Kec. Timur', lapangan: 10, gedung: 4, kolam: 1, kondisiBaik: 12, kondisiRusak: 3 },
  { kecamatan: 'Kec. Barat', lapangan: 8, gedung: 5, kolam: 2, kondisiBaik: 13, kondisiRusak: 2 }
];

const defaultPrestasiData: PrestasiItem[] = [
  { nama: 'Ahmad Suharto', cabor: 'Sepak Bola', kategori: 'Atlet', prestasi: 'Juara 1 POPDA 2023', medali: 'Emas', tahun: '2023' },
  { nama: 'Siti Nurhaliza', cabor: 'Renang', kategori: 'Pelatih', prestasi: 'Lisensi Pelatih A', medali: '-', tahun: '2023' },
  { nama: 'Budi Prasetyo', cabor: 'Badminton', kategori: 'Atlet', prestasi: 'Juara 2 PORDA 2023', medali: 'Perak', tahun: '2023' },
  { nama: 'Dewi Sartika', cabor: 'Voli', kategori: 'Wasit', prestasi: 'Lisensi Wasit Nasional', medali: '-', tahun: '2023' },
  { nama: 'Andi Wijaya', cabor: 'Basket', kategori: 'Atlet', prestasi: 'Juara 3 O2SN 2023', medali: 'Perunggu', tahun: '2023' }
];

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  statsData = defaultStats,
  saranaData = defaultSaranaData,
  prestasiData = defaultPrestasiData,
  onDataTableClick = () => {}
}) => {
  const [searchFacilityDistrict, setSearchFacilityDistrict] = useState('');

  return (
    <section id="data" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Data Keolahragaan
          </h2>
          <p className="text-xl text-gray-600">
            Informasi lengkap tentang perkembangan olahraga di daerah
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Data diperbarui per 29 Januari 2026
          </p>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <Link href={`/data/${stat.title.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer group">
                {/* Icon and Change */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.positive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </div>
                </div>

                {/* Main Value */}
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-700 font-semibold mb-1">{stat.title}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>

                {/* Context Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 group-hover:text-green-600 transition-colors">
                    Lihat Detail →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Data Tables and Analytics */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sarana Prasarana Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Building className="w-6 h-6 mr-2 text-blue-600" />
                  Sarana & Prasarana
                </h3>
                <button
                  onClick={() => onDataTableClick({ type: 'sarana', data: saranaData })}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                >
                  Analisis Data
                </button>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Fasilitas</p>
                    <p className="text-lg font-bold text-gray-900">89</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Kondisi Baik</p>
                    <p className="text-lg font-bold text-green-600">83</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Perlu Perbaikan</p>
                    <p className="text-lg font-bold text-orange-600">6</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Kecamatan</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Lapangan</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Gedung</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Kondisi</th>
                  </tr>
                </thead>
                <tbody>
                  {saranaData
                    .filter(item => item.kecamatan.toLowerCase().includes(searchFacilityDistrict.toLowerCase()))
                    .map((item, index) => {
                      const totalFacilities = item.lapangan + item.gedung;
                      const conditionPercentage = Math.round((item.kondisiBaik / totalFacilities) * 100);
                      return (
                        <tr key={index} className="border-b hover:bg-blue-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-900">{item.kecamatan}</td>
                          <td className="text-center py-3 px-4">
                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                              {item.lapangan}
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                              {item.gedung}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    conditionPercentage >= 80
                                      ? 'bg-green-500'
                                      : conditionPercentage >= 60
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                  }`}
                                  style={{ width: `${conditionPercentage}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-gray-700 min-w-fit">
                                {conditionPercentage}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Prestasi Atlet Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-yellow-600" />
                  Prestasi Terkini
                </h3>
                <button
                  onClick={() => onDataTableClick({ type: 'prestasi', data: prestasiData })}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                >
                  Lihat Semua
                </button>
              </div>
            </div>

            {/* Medal Type Breakdown */}
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">28</div>
                  <p className="text-xs font-semibold text-gray-700">
                    <Medal className="w-4 h-4 inline-block mr-1 text-yellow-600" />
                    Emas
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-500 mb-1">35</div>
                  <p className="text-xs font-semibold text-gray-700">
                    <Medal className="w-4 h-4 inline-block mr-1 text-gray-500" />
                    Perak
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">42</div>
                  <p className="text-xs font-semibold text-gray-700">
                    <Medal className="w-4 h-4 inline-block mr-1 text-orange-600" />
                    Perunggu
                  </p>
                </div>
              </div>
            </div>

            {/* Achievement Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Atlet</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cabor</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Medali</th>
                  </tr>
                </thead>
                <tbody>
                  {prestasiData
                    .sort((a, b) => {
                      const medalOrder = { 'Emas': 0, 'Perak': 1, 'Perunggu': 2 };
                      return (medalOrder[a.medali] || 999) - (medalOrder[b.medali] || 999);
                    })
                    .slice(0, 4)
                    .map((item, index) => (
                      <tr key={index} className="border-b hover:bg-yellow-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{item.nama}</td>
                        <td className="py-3 px-4 text-gray-600">
                          <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                            {item.cabor}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          {item.medali !== '-' ? (
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              item.medali === 'Emas'
                                ? 'bg-yellow-100 text-yellow-700'
                                : item.medali === 'Perak'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {item.medali === 'Emas' ? '🥇' : item.medali === 'Perak' ? '🥈' : '🥉'} {item.medali}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Footer CTA */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => onDataTableClick({ type: 'prestasi', data: prestasiData })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-semibold text-sm"
              >
                Lihat Semua Prestasi ({prestasiData.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
