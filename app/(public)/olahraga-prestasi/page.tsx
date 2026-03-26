'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Download, Eye, Search, Filter, ChevronLeft, ChevronRightIcon } from 'lucide-react';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';
import AthleteDetailModal from '@/components/public/athletes/AthleteDetailModal';

const ITEMS_PER_PAGE = 10;

interface Athlete {
  id: number;
  nationalId: string;
  fullName: string;
  birthDate: string;
  gender: string;
  desaKelurahan: any;
  organization: string;
  category: string;
  sport: any;
  photoUrl: string;
  achievements: any[];
}

interface StatsCard {
  total: number;
  athletes: number;
  coaches: number;
  referees: number;
  achievements: number;
}

export default function OlahragaPrestasi() {
  useTrackPageView('/olahraga-prestasi');
  
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  const [stats, setStats] = useState({
    koni: { total: 0, athletes: 0, coaches: 0, referees: 0, achievements: 0 },
    npci: { total: 0, athletes: 0, coaches: 0, referees: 0, achievements: 0 },
    combined: { total: 0, athletes: 0, coaches: 0, referees: 0, achievements: 0 }
  });

  const [filters, setFilters] = useState({
    search: '',
    organization: '',
    category: '',
    sport: ''
  });

  const [sports, setSports] = useState<any[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/athlete/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Fetch sports
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch('/api/masterdata/cabang-olahraga?page=1&limit=100');
        if (response.ok) {
          const data = await response.json();
          setSports(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching sports:', error);
      }
    };

    fetchSports();
  }, []);

  // Fetch athletes
  useEffect(() => {
    const fetchAthletes = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', ITEMS_PER_PAGE.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.organization) params.append('organization', filters.organization);
        if (filters.category) params.append('category', filters.category);
        if (filters.sport) params.append('sport', filters.sport);

        const response = await fetch(`/api/athlete/public?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setAthletes(data.data || []);
          setTotalPages(data.meta.totalPages);
          setTotalItems(data.meta.total);
        }
      } catch (error) {
        console.error('Error fetching athletes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, [currentPage, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      organization: '',
      category: '',
      sport: ''
    });
    setCurrentPage(1);
  };

  const handleViewDetails = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setIsDetailModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold">Olahraga Prestasi</span>
          </div>

          {/* Title */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Olahraga Prestasi
              </h1>
              <p className="text-lg text-gray-600">
                Data atlet, pelatih, dan wasit dari organisasi KONI dan NPCI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* KONI Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">KONI</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.koni.total}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Atlet</p>
                <p className="text-xl font-semibold text-green-600">{stats.koni.athletes}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pelatih</p>
                <p className="text-xl font-semibold text-blue-600">{stats.koni.coaches}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Wasit/Juri</p>
                <p className="text-xl font-semibold text-purple-600">{stats.koni.referees}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prestasi</p>
                <p className="text-xl font-semibold text-yellow-600">{stats.koni.achievements}</p>
              </div>
            </div>
          </div>

          {/* NPCI Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">NPCI</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.npci.total}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Atlet</p>
                <p className="text-xl font-semibold text-green-600">{stats.npci.athletes}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pelatih</p>
                <p className="text-xl font-semibold text-blue-600">{stats.npci.coaches}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Wasit/Juri</p>
                <p className="text-xl font-semibold text-purple-600">{stats.npci.referees}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prestasi</p>
                <p className="text-xl font-semibold text-yellow-600">{stats.npci.achievements}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold mb-4 ${
              showFilters
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
          </button>

          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Filter Data</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cari Nama/NIK</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Cari nama atau NIK..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organisasi</label>
                  <select
                    value={filters.organization}
                    onChange={(e) => handleFilterChange('organization', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Semua Organisasi --</option>
                    <option value="KONI">KONI</option>
                    <option value="NPCI">NPCI</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Semua Kategori --</option>
                    <option value="ATLET">ATLET</option>
                    <option value="PELATIH">PELATIH</option>
                    <option value="WASIT - JURI">WASIT - JURI</option>
                  </select>
                </div>

                {/* Sport */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cabang Olahraga</label>
                  <select
                    value={filters.sport}
                    onChange={(e) => handleFilterChange('sport', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Semua Cabang --</option>
                    {sports.map(sport => (
                      <option key={sport.id} value={sport.id}>
                        {sport.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reset Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Data Personel Olahraga Prestasi</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {totalItems} personel (Diperbarui: {new Date().toLocaleDateString('id-ID')})
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : athletes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada data yang ditemukan</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nama</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">NIK</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kategori</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Organisasi</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cabang</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Prestasi</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {athletes.map((athlete, index) => (
                        <tr key={athlete.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {athlete.fullName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {athlete.nationalId}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                              {athlete.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              athlete.organization === 'KONI'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {athlete.organization}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {athlete.sport?.nama || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-semibold">
                              {athlete.achievements?.length || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleViewDetails(athlete)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-semibold"
                            >
                              <Eye className="w-4 h-4" />
                              Lihat
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-600">
                      Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} dari {totalItems} data
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tentang KONI</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Komite Olahraga Nasional Indonesia (KONI) adalah organisasi induk yang mengelola olahraga prestasi di Indonesia dengan fokus pada pengembangan atlet berkualitas tinggi.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tentang NPCI</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              National Paralympic Committee Indonesia (NPCI) adalah organisasi yang mengelola atlet paralimpik dan olahraga adaptif dengan standar internasional.
            </p>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AthleteDetailModal
        athlete={selectedAthlete}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </main>
  );
}
