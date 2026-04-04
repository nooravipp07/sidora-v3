'use client';

import React, { useState, useEffect } from 'react';
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
  totalFacilitas: number;
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
  { kecamatan: 'Kec. Utara', totalFacilitas: 26, lapangan: 12, gedung: 8, kolam: 3, kondisiBaik: 18, kondisiRusak: 5 },
  { kecamatan: 'Kec. Selatan', totalFacilitas: 23, lapangan: 15, gedung: 6, kolam: 2, kondisiBaik: 20, kondisiRusak: 3 },
  { kecamatan: 'Kec. Timur', totalFacilitas: 15, lapangan: 10, gedung: 4, kolam: 1, kondisiBaik: 12, kondisiRusak: 3 },
  { kecamatan: 'Kec. Barat', totalFacilitas: 15, lapangan: 8, gedung: 5, kolam: 2, kondisiBaik: 13, kondisiRusak: 2 }
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
  const [stats, setStats] = useState<StatCard[]>(defaultStats);
  const [sarana, setSarana] = useState<SaranaItem[]>(defaultSaranaData);
  const [prestasi, setPrestasi] = useState<PrestasiItem[]>(defaultPrestasiData);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPageSarana, setCurrentPageSarana] = useState(1);
  const [currentPagePrestasi, setCurrentPagePrestasi] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch statistics
        const statsRes = await fetch('/api/public/statistics');
        const statsData = await statsRes.json();
        
        // Fetch sarana data
        const saranaRes = await fetch('/api/public/sarana');
        const saranaData = await saranaRes.json();
        
        // Fetch prestasi data
        const prestasiRes = await fetch('/api/public/prestasi');
        const prestasiData = await prestasiRes.json();

        // Transform stats data to StatCard format
        if (statsData.success) {
          const transformedStats: StatCard[] = [
            {
              icon: Trophy,
              title: "Atlet Terdaftar",
              value: statsData.data.totalAthletes.toLocaleString(),
              subtitle: "Atlet Aktif",
              color: "bg-gradient-to-r from-yellow-400 to-yellow-600",
              change: "+12%",
              positive: true
            },
            {
              icon: Users,
              title: "Prestasi Atlet",
              value: statsData.data.totalAchievements.toLocaleString(),
              subtitle: "Pencapaian Tercatat",
              color: "bg-gradient-to-r from-blue-500 to-blue-700",
              change: "+8%",
              positive: true
            },
            {
              icon: MapPin,
              title: "Sarana Olahraga",
              value: statsData.data.totalEquipment.toLocaleString(),
              subtitle: "Peralatan Tersedia",
              color: "bg-gradient-to-r from-green-500 to-green-700",
              change: "+5%",
              positive: true
            },
            {
              icon: Calendar,
              title: "Prasarana Olahraga",
              value: statsData.data.totalPrasarana.toLocaleString(),
              subtitle: "Fasilitas Tercatat",
              color: "bg-gradient-to-r from-purple-500 to-purple-700",
              change: "-2%",
              positive: false
            }
          ];
          setStats(transformedStats);
        }

        // Transform sarana data
        if (saranaData.success) {
          setSarana(saranaData.data);
        }

        // Transform prestasi data
        if (prestasiData.success) {
          setPrestasi(prestasiData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Keep default data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
        </div>

        {/* KPI Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
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
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                  <Building className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-600" />
                  Sarana & Prasarana
                </h3>
                <button
                  onClick={() => onDataTableClick({ type: 'sarana', data: sarana })}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                >
                  Analisis Data
                </button>
              </div>

              <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 -mx-4 md:mx-0">
                <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                  {(() => {
                    const currentData = sarana;
                    const totalFacilities = currentData.reduce((sum, item) => sum + item.totalFacilitas, 0);
                    const totalBaik = currentData.reduce((sum, item) => sum + item.kondisiBaik, 0);
                    const totalRusak = currentData.reduce((sum, item) => sum + item.kondisiRusak, 0);
                    return (
                      <>
                        <div>
                          <p className="text-xs md:text-sm text-gray-600 mb-1">Total Fasilitas</p>
                          <p className="text-lg md:text-2xl font-bold text-gray-900">{totalFacilities}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-600 mb-1">Kondisi Baik</p>
                          <p className="text-lg md:text-2xl font-bold text-green-600">{totalBaik}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-600 mb-1">Rusak Berat</p>
                          <p className="text-lg md:text-2xl font-bold text-orange-600">{totalRusak}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Table - Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Kecamatan</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Total Fasilitas</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Kondisi Baik</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Rusak Berat</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filteredSarana = sarana.filter(item => item.kecamatan.toLowerCase().includes(searchFacilityDistrict.toLowerCase()));
                    const totalPagesSarana = Math.ceil(filteredSarana.length / itemsPerPage);
                    const startIndexSarana = (currentPageSarana - 1) * itemsPerPage;
                    const endIndexSarana = startIndexSarana + itemsPerPage;
                    const paginatedSarana = filteredSarana.slice(startIndexSarana, endIndexSarana);
                    return paginatedSarana.map((item, index) => {
                      return (
                        <tr key={index} className="border-b hover:bg-blue-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-900">{item.kecamatan}</td>
                          <td className="text-center py-3 px-4">
                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                              {item.totalFacilitas}
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                              {item.kondisiBaik}
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                              {item.kondisiRusak}
                            </span>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Card Layout - Mobile View */}
            <div className="md:hidden px-4 py-3 space-y-3">
              {(() => {
                const filteredSarana = sarana.filter(item => item.kecamatan.toLowerCase().includes(searchFacilityDistrict.toLowerCase()));
                const totalPagesSarana = Math.ceil(filteredSarana.length / itemsPerPage);
                const startIndexSarana = (currentPageSarana - 1) * itemsPerPage;
                const endIndexSarana = startIndexSarana + itemsPerPage;
                const paginatedSarana = filteredSarana.slice(startIndexSarana, endIndexSarana);
                return paginatedSarana.map((item, index) => {
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 text-sm">{item.kecamatan}</h4>
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          Total: {item.totalFacilitas}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded p-2 text-center">
                          <p className="text-xs text-gray-600 mb-1">Kondisi Baik</p>
                          <p className="text-lg font-bold text-green-600">{item.kondisiBaik}</p>
                        </div>
                        <div className="bg-white rounded p-2 text-center">
                          <p className="text-xs text-gray-600 mb-1">Rusak Berat</p>
                          <p className="text-lg font-bold text-red-600">{item.kondisiRusak}</p>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Pagination Sarana */}
            <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-t border-gray-100">
              {/* Desktop Pagination */}
              <div className="hidden md:flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Menampilkan {Math.min((currentPageSarana - 1) * itemsPerPage + 1, sarana.length)} - {Math.min(currentPageSarana * itemsPerPage, sarana.length)} dari {sarana.length}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPageSarana(prev => Math.max(prev - 1, 1))}
                    disabled={currentPageSarana === 1}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Sebelumnya
                  </button>
                  <div className="flex items-center gap-1">
                    {(() => {
                      const filteredSarana = sarana.filter(item => item.kecamatan.toLowerCase().includes(searchFacilityDistrict.toLowerCase()));
                      const totalPagesSarana = Math.ceil(filteredSarana.length / itemsPerPage);
                      const pages = [];
                      for (let i = 1; i <= totalPagesSarana; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPageSarana(i)}
                            className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                              currentPageSarana === i
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }
                      return pages;
                    })()}
                  </div>
                  <button
                    onClick={() => {
                      const filteredSarana = sarana.filter(item => item.kecamatan.toLowerCase().includes(searchFacilityDistrict.toLowerCase()));
                      const totalPagesSarana = Math.ceil(filteredSarana.length / itemsPerPage);
                      setCurrentPageSarana(prev => Math.min(prev + 1, totalPagesSarana));
                    }}
                    disabled={(() => {
                      const filteredSarana = sarana.filter(item => item.kecamatan.toLowerCase().includes(searchFacilityDistrict.toLowerCase()));
                      return currentPageSarana === Math.ceil(filteredSarana.length / itemsPerPage);
                    })()}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Selanjutnya →
                  </button>
                </div>
              </div>

              {/* Mobile Pagination */}
              <div className="md:hidden">
                <div className="text-xs text-gray-600 text-center mb-3">
                  {Math.min((currentPageSarana - 1) * itemsPerPage + 1, sarana.length)} - {Math.min(currentPageSarana * itemsPerPage, sarana.length)} dari {sarana.length}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPageSarana(prev => Math.max(prev - 1, 1))}
                    disabled={currentPageSarana === 1}
                    className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ←
                  </button>
                  <div className="text-xs font-semibold text-gray-700 px-3 py-1 bg-white rounded border border-gray-300">
                    {currentPageSarana}
                  </div>
                  <button
                    onClick={() => {
                      const filteredSarana = sarana.filter(item => item.kecamatan.toLowerCase().includes(searchFacilityDistrict.toLowerCase()));
                      const totalPagesSarana = Math.ceil(filteredSarana.length / itemsPerPage);
                      setCurrentPageSarana(prev => Math.min(prev + 1, totalPagesSarana));
                    }}
                    disabled={(() => {
                      const filteredSarana = sarana.filter(item => item.kecamatan.toLowerCase().includes(searchFacilityDistrict.toLowerCase()));
                      return currentPageSarana === Math.ceil(filteredSarana.length / itemsPerPage);
                    })()}
                    className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Prestasi Atlet Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                  <Award className="w-5 h-5 md:w-6 md:h-6 mr-2 text-yellow-600" />
                  Prestasi Terkini
                </h3>
                <button
                  onClick={() => onDataTableClick({ type: 'prestasi', data: prestasi })}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                >
                  Lihat Semua
                </button>
              </div>
            </div>

            {/* Medal Type Breakdown */}
            <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50">
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {(() => {
                  const currentData = prestasi;
                  const emas = currentData.filter(item => item.medali === 'Emas').length;
                  const perak = currentData.filter(item => item.medali === 'Perak').length;
                  const perunggu = currentData.filter(item => item.medali === 'Perunggu').length;
                  return (
                    <>
                      <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1">{emas}</div>
                        <p className="text-xs md:text-sm font-semibold text-gray-700">
                          <Medal className="w-3 h-3 md:w-4 md:h-4 inline-block mr-1 text-yellow-600" />
                          Emas
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-gray-500 mb-1">{perak}</div>
                        <p className="text-xs md:text-sm font-semibold text-gray-700">
                          <Medal className="w-3 h-3 md:w-4 md:h-4 inline-block mr-1 text-gray-500" />
                          Perak
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-orange-600 mb-1">{perunggu}</div>
                        <p className="text-xs md:text-sm font-semibold text-gray-700">
                          <Medal className="w-3 h-3 md:w-4 md:h-4 inline-block mr-1 text-orange-600" />
                          Perunggu
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Achievement Table - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Atlet</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cabang Olahraga</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Medali</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Tahun</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const sortedPrestasi = prestasi.sort((a, b) => {
                      const medalOrder = { 'Emas': 0, 'Perak': 1, 'Perunggu': 2 };
                      return (medalOrder[a.medali] || 999) - (medalOrder[b.medali] || 999);
                    });
                    const totalPagesPrestasi = Math.ceil(sortedPrestasi.length / itemsPerPage);
                    const startIndexPrestasi = (currentPagePrestasi - 1) * itemsPerPage;
                    const endIndexPrestasi = startIndexPrestasi + itemsPerPage;
                    const paginatedPrestasi = sortedPrestasi.slice(startIndexPrestasi, endIndexPrestasi);
                    return paginatedPrestasi.map((item, index) => (
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
                        <td className="text-center py-3 px-4">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-semibold">
                            {item.tahun}
                          </span>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>

            {/* Achievement Card Layout - Mobile */}
            <div className="md:hidden px-4 py-3 space-y-3">
              {(() => {
                const sortedPrestasi = prestasi.sort((a, b) => {
                  const medalOrder = { 'Emas': 0, 'Perak': 1, 'Perunggu': 2 };
                  return (medalOrder[a.medali] || 999) - (medalOrder[b.medali] || 999);
                });
                const totalPagesPrestasi = Math.ceil(sortedPrestasi.length / itemsPerPage);
                const startIndexPrestasi = (currentPagePrestasi - 1) * itemsPerPage;
                const endIndexPrestasi = startIndexPrestasi + itemsPerPage;
                const paginatedPrestasi = sortedPrestasi.slice(startIndexPrestasi, endIndexPrestasi);
                return paginatedPrestasi.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">{item.nama}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                            {item.cabor}
                          </span>
                        </p>
                      </div>
                      {item.medali !== '-' ? (
                        <div className={`flex-shrink-0 px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                          item.medali === 'Emas'
                            ? 'bg-yellow-100 text-yellow-700'
                            : item.medali === 'Perak'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {item.medali === 'Emas' ? '🥇' : item.medali === 'Perak' ? '🥈' : '🥉'} {item.medali}
                        </div>
                      ) : (
                        <div className="flex-shrink-0 px-2 py-1 rounded text-xs text-gray-400">—</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-300">
                      <span className="text-xs text-gray-600">Tahun:</span>
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold">
                        {item.tahun}
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Pagination Prestasi */}
            <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-t border-gray-100">
              {/* Desktop Pagination */}
              <div className="hidden md:flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Menampilkan {Math.min((currentPagePrestasi - 1) * itemsPerPage + 1, prestasi.length)} - {Math.min(currentPagePrestasi * itemsPerPage, prestasi.length)} dari {prestasi.length}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPagePrestasi(prev => Math.max(prev - 1, 1))}
                    disabled={currentPagePrestasi === 1}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Sebelumnya
                  </button>
                  <div className="flex items-center gap-1">
                    {(() => {
                      const totalPagesPrestasi = Math.ceil(prestasi.length / itemsPerPage);
                      const pages = [];
                      for (let i = 1; i <= totalPagesPrestasi; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPagePrestasi(i)}
                            className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                              currentPagePrestasi === i
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }
                      return pages;
                    })()}
                  </div>
                  <button
                    onClick={() => {
                      const totalPagesPrestasi = Math.ceil(prestasi.length / itemsPerPage);
                      setCurrentPagePrestasi(prev => Math.min(prev + 1, totalPagesPrestasi));
                    }}
                    disabled={currentPagePrestasi === Math.ceil(prestasi.length / itemsPerPage)}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Selanjutnya →
                  </button>
                </div>
              </div>

              {/* Mobile Pagination */}
              <div className="md:hidden">
                <div className="text-xs text-gray-600 text-center mb-3">
                  {Math.min((currentPagePrestasi - 1) * itemsPerPage + 1, prestasi.length)} - {Math.min(currentPagePrestasi * itemsPerPage, prestasi.length)} dari {prestasi.length}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPagePrestasi(prev => Math.max(prev - 1, 1))}
                    disabled={currentPagePrestasi === 1}
                    className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ←
                  </button>
                  <div className="text-xs font-semibold text-gray-700 px-3 py-1 bg-white rounded border border-gray-300">
                    {currentPagePrestasi}
                  </div>
                  <button
                    onClick={() => {
                      const totalPagesPrestasi = Math.ceil(prestasi.length / itemsPerPage);
                      setCurrentPagePrestasi(prev => Math.min(prev + 1, totalPagesPrestasi));
                    }}
                    disabled={currentPagePrestasi === Math.ceil(prestasi.length / itemsPerPage)}
                    className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 md:hidden">
              <button
                onClick={() => onDataTableClick({ type: 'prestasi', data: prestasi })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-semibold text-sm"
              >
                Lihat Semua ({prestasi.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
