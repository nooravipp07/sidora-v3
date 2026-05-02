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
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
			{[
				{ key: "koni", label: "KONI", badge: "Organisasi Olahraga", badgeClass: "bg-blue-50 text-blue-700" },
				{ key: "npci", label: "NPCI", badge: "Olahraga Difabel", badgeClass: "bg-purple-50 text-purple-700" },
			].map(({ key, label, badge, badgeClass }) => {
				const s = stats[key as keyof typeof stats];
				return (
				<div key={key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
					<div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
					<span className="text-xs font-semibold tracking-widest uppercase text-gray-400">{label}</span>
					<span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeClass}`}>{badge}</span>
					</div>
					<div className="px-5 py-4 border-b border-gray-100 flex items-baseline gap-2">
					<span className="text-3xl font-medium text-gray-900">{s.total}</span>
					<span className="text-xs text-gray-400">total anggota</span>
					</div>
					<div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
					{[
						{ label: "Atlet", value: s.athletes, color: "text-green-700" },
						{ label: "Pelatih", value: s.coaches, color: "text-blue-700" },
						{ label: "Wasit / Juri", value: s.referees, color: "text-purple-700" },
						{ label: "Prestasi", value: s.achievements, color: "text-amber-600" },
					].map(({ label: l, value, color }) => (
						<div key={l} className="px-5 py-3.5 flex flex-col gap-1">
						<span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{l}</span>
						<span className={`text-xl font-medium ${color}`}>{value}</span>
						</div>
					))}
					</div>
				</div>
				);
			})}
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
					{/* ── Mobile: Card List ── */}
					<div className="flex flex-col gap-3 lg:hidden">
					{athletes.map((athlete, index) => (
						<div
						key={athlete.id}
						className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
						>
						{/* Row 1: number + name + org badge */}
						<div className="flex items-start justify-between gap-2 mb-3">
							<div className="flex items-center gap-2.5 min-w-0">
							<span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold flex items-center justify-center">
								{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
							</span>
							<p className="text-sm font-semibold text-gray-900 truncate">
								{athlete.fullName}
							</p>
							</div>
							<span
							className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
								athlete.organization === "KONI"
								? "bg-green-100 text-green-700"
								: "bg-purple-100 text-purple-700"
							}`}
							>
							{athlete.organization}
							</span>
						</div>

						{/* Row 2: NIK */}
						<p className="text-xs text-gray-400 mb-3 pl-[34px]">
							NIK: <span className="text-gray-600 font-medium">{athlete.nationalId}</span>
						</p>

						{/* Row 3: Kategori · Cabang · Prestasi chips */}
						<div className="flex flex-wrap items-center gap-2 pl-[34px] mb-3">
							<span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
							{athlete.category}
							</span>
							<span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
							{athlete.sport?.nama || "—"}
							</span>
							<span className="text-xs px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full font-medium">
							🏅 {athlete.achievements?.length || 0} Prestasi
							</span>
						</div>

						{/* Row 4: Action */}
						<div className="pl-[34px]">
							<button
							onClick={() => handleViewDetails(athlete)}
							className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all text-xs font-semibold"
							>
							<Eye className="w-3.5 h-3.5" />
							Lihat Detail
							</button>
						</div>
						</div>
					))}
					</div>

					{/* ── Desktop: Table ── */}
					<div className="hidden lg:block overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">No</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">NIK</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Organisasi</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Cabang</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Prestasi</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
						</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
						{athletes.map((athlete, index) => (
							<tr key={athlete.id} className="hover:bg-gray-50 transition-colors">
							<td className="px-4 py-3 text-sm text-gray-400">
								{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
							</td>
							<td className="px-4 py-3 text-sm font-medium text-gray-900">
								{athlete.fullName}
							</td>
							<td className="px-4 py-3 text-sm text-gray-500">
								{athlete.nationalId}
							</td>
							<td className="px-4 py-3 text-sm">
								<span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
								{athlete.category}
								</span>
							</td>
							<td className="px-4 py-3 text-sm">
								<span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
								athlete.organization === "KONI"
									? "bg-green-100 text-green-700"
									: "bg-purple-100 text-purple-700"
								}`}>
								{athlete.organization}
								</span>
							</td>
							<td className="px-4 py-3 text-sm text-gray-500">
								{athlete.sport?.nama || "—"}
							</td>
							<td className="px-4 py-3 text-sm text-center">
								<span className="inline-block px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold">
								{athlete.achievements?.length || 0}
								</span>
							</td>
							<td className="px-4 py-3 text-sm">
								<button
								onClick={() => handleViewDetails(athlete)}
								className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold"
								>
								<Eye className="w-3.5 h-3.5" />
								Lihat
								</button>
							</td>
							</tr>
						))}
						</tbody>
					</table>
					</div>

					{/* ── Pagination: Mobile ── */}
					{totalPages > 1 && (
					<div className="mt-4 lg:hidden">
						<div className="flex items-center justify-between gap-3">
						<p className="text-xs text-gray-500">
							{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} dari {totalItems}
						</p>
						<div className="flex items-center gap-1">
							<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
							>
							<ChevronLeft className="w-4 h-4 text-gray-600" />
							</button>
							<span className="px-3 text-xs font-medium text-gray-700">
							{currentPage} / {totalPages}
							</span>
							<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
							>
							<ChevronRightIcon className="w-4 h-4 text-gray-600" />
							</button>
						</div>
						</div>
					</div>
					)}

					{/* ── Pagination: Desktop ── */}
					{totalPages > 1 && (
					<div className="hidden lg:flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
						<p className="text-sm text-gray-500">
						Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} dari {totalItems} data
						</p>
						<div className="flex items-center gap-1">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
						>
							<ChevronLeft className="w-5 h-5 text-gray-600" />
						</button>
						{Array.from({ length: totalPages }, (_, i) => i + 1)
							.filter(p => Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages)
							.map((page, idx, arr) => {
							if (idx > 0 && arr[idx - 1] !== page - 1) {
								return <span key={`dots-${page}`} className="px-1 text-gray-400 text-sm">…</span>;
							}
							return (
								<button
								key={page}
								onClick={() => handlePageChange(page)}
								className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
									currentPage === page
									? "bg-blue-600 text-white"
									: "text-gray-600 hover:bg-gray-100"
								}`}
								>
								{page}
								</button>
							);
							})}
						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
						>
							<ChevronRightIcon className="w-5 h-5 text-gray-600" />
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
