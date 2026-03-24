'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Eye, Search, Filter } from 'lucide-react';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';
import AthleteDetailModal from '@/components/public/athletes/AthleteDetailModal';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 10;

interface Athlete {
  id: string;
  fullName: string;
  nationalId: string;
  category: string;
  organization: string;
  sport: { nama: string } | null;
  photoUrl: string | null;
  desaKelurahan?: { nama: string; kecamatan: { nama: string } } | null;
  achievements: { id: string; achievementName: string; category: string; medal: string; year: number }[];
}

interface Stats {
  kormi?: {
    total: number;
    athletes: number;
    coaches: number;
    achievements: number;
  };
}

export default function OlahragaMasyarakat() {
  useTrackPageView('/olahraga-masyarakat');

  // State management
  const [stats, setStats] = useState<Stats>({});
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sports, setSports] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sport: '',
  });

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/athlete/kormi/stats');
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
        const response = await fetch('/api/athlete/public?limit=1000&organization=KORMI');
        if (response.ok) {
          const data = await response.json();
          const uniqueSports = Array.from(
            new Map(
              data.data
                .filter((a: any) => a.sport)
                .map((a: any) => [a.sport.id, a.sport])
            ).values()
          );
          setSports(uniqueSports);
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
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(ITEMS_PER_PAGE),
          ...(filters.search && { search: filters.search }),
          ...(filters.category && { category: filters.category }),
          ...(filters.sport && { sport: filters.sport }),
        });

        const response = await fetch(`/api/athlete/kormi?${params}`);
        if (response.ok) {
          const data = await response.json();
          setAthletes(data.data);
          setTotalPages(data.meta.totalPages);
          setTotalItems(data.meta.total);
        }
      } catch (error) {
        console.error('Error fetching athletes:', error);
        Swal.fire('Error', 'Gagal memuat data atlet', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAthletes();
  }, [currentPage, filters]);

  // Handlers
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ search: '', category: '', sport: '' });
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
            <span className="text-gray-900 font-semibold">Olahraga Masyarakat</span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              Olahraga Masyarakat
            </h1>
            <p className="text-lg text-gray-600">
              Program pengembangan olahraga untuk masyarakat luas dengan atlet dan pelatih komunitas KORMI
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="text-sm font-medium text-purple-600 mb-2">Total Peserta</div>
            <div className="text-3xl font-bold text-purple-900">
              {stats.kormi?.total || 0}
            </div>
            <div className="text-xs text-purple-600 mt-2">KORMI</div>
          </div>

          {/* Athletes Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-medium text-blue-600 mb-2">Atlet</div>
            <div className="text-3xl font-bold text-blue-900">
              {stats.kormi?.athletes || 0}
            </div>
            <div className="text-xs text-blue-600 mt-2">Kategori</div>
          </div>

          {/* Coaches Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="text-sm font-medium text-green-600 mb-2">Pelatih</div>
            <div className="text-3xl font-bold text-green-900">
              {stats.kormi?.coaches || 0}
            </div>
            <div className="text-xs text-green-600 mt-2">Kategori</div>
          </div>

          {/* Achievements Card */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
            <div className="text-sm font-medium text-amber-600 mb-2">Prestasi</div>
            <div className="text-3xl font-bold text-amber-900">
              {stats.kormi?.achievements || 0}
            </div>
            <div className="text-xs text-amber-600 mt-2">Total</div>
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Data Peserta</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Sembunyikan' : 'Tampilkan'} Filter
          </button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Nama / NIK
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Semua Kategori</option>
                  <option value="ATLET">Atlet</option>
                  <option value="PELATIH">Pelatih</option>
                </select>
              </div>

              {/* Sport Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cabang Olahraga
                </label>
                <select
                  value={filters.sport}
                  onChange={(e) => handleFilterChange('sport', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Semua Cabang</option>
                  {sports.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold text-sm"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Table Section */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Data Peserta KORMI</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {totalItems} peserta (Diperbarui: {new Date().toLocaleDateString('id-ID')})
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-3 text-gray-600">Memuat data...</p>
            </div>
          ) : athletes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Tidak ada data peserta</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">No</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Nama</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">NIK</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Kategori</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Cabang</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Prestasi</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.map((athlete, index) => (
                    <tr
                      key={athlete.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-700">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{athlete.fullName}</td>
                      <td className="px-4 py-3 text-gray-600">{athlete.nationalId}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            athlete.category === 'ATLET'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {athlete.category === 'ATLET' ? 'Atlet' : 'Pelatih'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {athlete.sport?.nama || '-'}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {athlete.achievements?.length || 0}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleViewDetails(athlete)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-semibold"
                        >
                          <Eye className="w-3 h-3" />
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Sebelumnya
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">KORMI (Komite Olahraga Nasional Indonesia)</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Organisasi olahraga nasional yang membina pengembangan olahraga dari level grassroots hingga 
              kompetisi internasional, dengan fokus pada community sports dan pengembangan atlet muda berbakat.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Visi Program</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Memberdayakan komunitas olahraga KORMI melalui pelatihan sistematis, pengembangan atlet berbakat, 
              dan peningkatan partisipasi masyarakat dalam aktivitas olahraga untuk meraih prestasi nasional dan internasional.
            </p>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAthlete && (
        <AthleteDetailModal
          athlete={selectedAthlete}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </main>
  );
}
