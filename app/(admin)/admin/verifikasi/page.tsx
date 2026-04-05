'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { CheckCircle, XCircle, Clock, Eye, Filter, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

interface Registration {
  id: number;
  name: string;
  email: string;
  nip: string;
  namaLengkap: string;
  noTelepon: string;
  kecamatan: { id: number; nama: string };
  status: number; // 1 = PENDING, 2 = APPROVE, 3 = REJECT
  createdAt: string;
  verifiedAt?: string;
  rejectReason?: string;
  docUrl: string;
}

interface SportsData {
  id: number;
  type: 'facility' | 'equipment' | 'athlete' | 'sport_group';
  status: number;
  createdAt: string;
  // Facility Record fields
  prasaranaName?: string;
  year?: number;
  condition?: string;
  ownershipStatus?: string;
  address?: string;
  notes?: string;
  isActive?: boolean;
  photos?: Array<{ id: number; fileUrl: string; fileName?: string }>;
  // Equipment fields
  saranaName?: string;
  quantity?: number;
  unit?: string;
  isUsable?: boolean;
  isGovernmentGrant?: boolean;
  // Athlete fields
  fullName?: string;
  nationalId?: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  fullAddress?: string;
  organization?: string;
  athleteCategory?: string;
  photoUrl?: string;
  achievements?: Array<{
    id: number;
    achievementName: string;
    category?: string;
    medal?: string;
    year?: number;
  }>;
  // SportsGroup fields
  groupName?: string;
  leaderName?: string;
  memberCount?: number;
  isVerified?: boolean;
  decreeNumber?: string;
  secretariatAddress?: string;
  // Common fields
  desaKelurahanName?: string;
  kecamatanName?: string;
  cabangOlahragaName?: string;
}

const Verifikasi: React.FC = () => {
  // Tabs
  const [activeTab, setActiveTab] = useState<'registration' | 'sports'>('registration');

  // Registration state
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });

  // Sports data state
  const [sportsDataTab, setSportsDataTab] = useState<'facility' | 'equipment' | 'athlete' | 'sport_group'>('facility');
  const [sportsData, setSportsData] = useState<SportsData[]>([]);
  const [selectedSportsData, setSelectedSportsData] = useState<SportsData | null>(null);
  const [isSportsViewModalOpen, setIsSportsViewModalOpen] = useState(false);
  const [showSportsFilters, setShowSportsFilters] = useState(false);
  const [isSportsRejectModalOpen, setIsSportsRejectModalOpen] = useState(false);
  const [sportsRejectReason, setSportsRejectReason] = useState('');
  const [sportsRejectingId, setSportsRejectingId] = useState<number | null>(null);
  const [sportsIsProcessing, setSportsIsProcessing] = useState(false);
  const [sportsPagination, setSportsPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });

  // Fetch registrations and dummy sports data
  useEffect(() => {
    fetchRegistrations(1);
  }, [filters]);

  useEffect(() => {
    // Fetch sports data based on selected tab
    if (sportsDataTab === 'facility' || sportsDataTab === 'athlete') {
      fetchSportsData(1, sportsDataTab);
    } else {
      // Load dummy data for other types (not implemented yet)
      loadDummySportsData(sportsDataTab);
    }
  }, [sportsDataTab]);

  const fetchRegistrations = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/registration?${params.toString()}`);
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setRegistrations(data.data || []);
      setPagination(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data registrasi');
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sports data (for facility records from staging)
  const fetchSportsData = async (page: number = 1, type: 'facility' | 'equipment' | 'athlete' | 'sport_group') => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');

      let url = '';
      if (type === 'facility') {
        url = `/api/verifikasi/facility-record?${params.toString()}`;
      } else if (type === 'athlete') {
        url = `/api/verifikasi/athlete?${params.toString()}`;
      } else {
        // Other types not implemented yet
        loadDummySportsData(type);
        return;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setSportsData(data.data || []);
      setSportsPagination(data.meta);
    } catch (err) {
      console.error('Error fetching sports data:', err);
      // Fallback to dummy data on error
      loadDummySportsData(type);
    }
  };

  // Load dummy sports data
  const loadDummySportsData = (type: 'facility' | 'equipment' | 'athlete' | 'sport_group') => {
    const dummyDataMap = {
      facility: [
        {
          id: 1,
          type: 'facility' as const,
          status: 1,
          createdAt: '2025-01-15',
          prasaranaName: 'Lapangan Sepak Bola',
          year: 2024,
          condition: 'Baik',
          ownershipStatus: 'Milik Pemerintah Daerah',
          address: 'Jl. Olahraga No. 1, Kecamatan A, Desa A',
          notes: 'Lapangan utama untuk pertandingan resmi dengan cukup baik',
          isActive: true,
          desaKelurahanName: 'Desa A',
          kecamatanName: 'Kecamatan A',
        },
        {
          id: 2,
          type: 'facility' as const,
          status: 1,
          createdAt: '2025-01-20',
          prasaranaName: 'Lapangan Badminton',
          year: 2024,
          condition: 'Sangat Baik',
          ownershipStatus: 'Milik Organisasi Olahraga',
          address: 'Gedung Olahraga Pusat, Kecamatan B',
          notes: 'Lapangan tertutup dengan 4 jalur untuk kompetisi',
          isActive: true,
          desaKelurahanName: 'Kelurahan B',
          kecamatanName: 'Kecamatan B',
        },
        {
          id: 3,
          type: 'facility' as const,
          status: 1,
          createdAt: '2025-02-01',
          prasaranaName: 'Kolam Renang',
          year: 2024,
          condition: 'Baik',
          ownershipStatus: 'Milik Pemerintah Pusat',
          address: 'Kompleks Aquatic Center, Pusat Kabupaten',
          notes: 'Kolam renang standar olimpik dengan panjang 50m',
          isActive: true,
          desaKelurahanName: 'Pusat',
          kecamatanName: 'Pusat Kabupaten',
        },
      ],
      equipment: [
        {
          id: 1,
          type: 'equipment' as const,
          status: 1,
          createdAt: '2025-01-10',
          saranaName: 'Bola Sepak',
          quantity: 25,
          unit: 'Buah',
          isUsable: true,
          isGovernmentGrant: true,
          year: 2024,
          desaKelurahanName: 'Desa A',
          kecamatanName: 'Kecamatan A',
        },
        {
          id: 2,
          type: 'equipment' as const,
          status: 1,
          createdAt: '2025-01-25',
          saranaName: 'Raket Badminton',
          quantity: 20,
          unit: 'Set',
          isUsable: true,
          isGovernmentGrant: false,
          year: 2024,
          desaKelurahanName: 'Kelurahan B',
          kecamatanName: 'Kecamatan B',
        },
        {
          id: 3,
          type: 'equipment' as const,
          status: 2,
          createdAt: '2025-02-05',
          saranaName: 'Matras Judo',
          quantity: 8,
          unit: 'Lembar',
          isUsable: true,
          isGovernmentGrant: true,
          year: 2023,
          desaKelurahanName: 'Pusat',
          kecamatanName: 'Pusat Kabupaten',
        },
      ],
      athlete: [
        {
          id: 1,
          type: 'athlete' as const,
          status: 1,
          createdAt: '2025-01-05',
          fullName: 'Budi Santoso',
          nationalId: '3201011990123456',
          birthPlace: 'Jakarta',
          birthDate: '1990-01-15',
          gender: 'Laki-laki',
          fullAddress: 'Jl. Merdeka No. 10, Desa A, Kecamatan A',
          organization: 'Klub Sepak Bola Kecamatan A',
          athleteCategory: 'Senior',
          photoUrl: 'https://via.placeholder.com/150?text=Budi',
          desaKelurahanName: 'Desa A',
          kecamatanName: 'Kecamatan A',
          cabangOlahragaName: 'Sepak Bola',
        },
        {
          id: 2,
          type: 'athlete' as const,
          status: 1,
          createdAt: '2025-01-12',
          fullName: 'Siti Nurhaliza',
          nationalId: '3202051995654321',
          birthPlace: 'Bandung',
          birthDate: '1995-05-20',
          gender: 'Perempuan',
          fullAddress: 'Jl. Ahmad Yani No. 25, Kelurahan B, Kecamatan B',
          organization: 'Organisasi Pencak Silat Kabupaten',
          athleteCategory: 'Junior',
          photoUrl: 'https://via.placeholder.com/150?text=Siti',
          desaKelurahanName: 'Kelurahan B',
          kecamatanName: 'Kecamatan B',
          cabangOlahragaName: 'Pencak Silat',
        },
        {
          id: 3,
          type: 'athlete' as const,
          status: 1,
          createdAt: '2025-02-03',
          fullName: 'Ahmad Wijaya',
          nationalId: '3203031992789012',
          birthPlace: 'Surabaya',
          birthDate: '1992-03-10',
          gender: 'Laki-laki',
          fullAddress: 'Jl. Diponegoro No. 35, Pusat Kabupaten',
          organization: 'Klub Badminton Pusat',
          athleteCategory: 'Senior',
          photoUrl: 'https://via.placeholder.com/150?text=Ahmad',
          desaKelurahanName: 'Pusat',
          kecamatanName: 'Pusat Kabupaten',
          cabangOlahragaName: 'Badminton',
        },
      ],
      sport_group: [
        {
          id: 1,
          type: 'sport_group' as const,
          status: 1,
          createdAt: '2025-01-08',
          groupName: 'Tim Sepak Bola Desa A',
          leaderName: 'Rudi Hermawan',
          memberCount: 18,
          isVerified: true,
          decreeNumber: 'SK/001/Kec-A/2024',
          secretariatAddress: 'Kantor Desa A, Kecamatan A',
          year: 2024,
          desaKelurahanName: 'Desa A',
          kecamatanName: 'Kecamatan A',
          cabangOlahragaName: 'Sepak Bola',
        },
        {
          id: 2,
          type: 'sport_group' as const,
          status: 1,
          createdAt: '2025-01-15',
          groupName: 'Organisasi Pencak Silat Kabupaten',
          leaderName: 'H. Bambang Sutrisno',
          memberCount: 45,
          isVerified: true,
          decreeNumber: 'SK/PKL/PERS/2024',
          secretariatAddress: 'Gedung Pendidikan Olahraga, Pusat Kabupaten',
          year: 2024,
          desaKelurahanName: 'Pusat',
          kecamatanName: 'Pusat Kabupaten',
          cabangOlahragaName: 'Pencak Silat',
        },
        {
          id: 3,
          type: 'sport_group' as const,
          status: 2,
          createdAt: '2025-02-02',
          groupName: 'Klub Badminton Kecamatan B',
          leaderName: 'Rina Dewi',
          memberCount: 25,
          isVerified: false,
          decreeNumber: 'SK/002/Kec-B/2024',
          secretariatAddress: 'Gedung Olahraga, Kelurahan B, Kecamatan B',
          year: 2024,
          desaKelurahanName: 'Kelurahan B',
          kecamatanName: 'Kecamatan B',
          cabangOlahragaName: 'Badminton',
        },
      ],
    };

    setSportsData(dummyDataMap[type] || []);
    setSportsPagination({
      total: dummyDataMap[type]?.length || 0,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasMore: false,
    });
  };

  const handleApprove = async (id: number) => {
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: 'Apakah Anda yakin ingin menyetujui pendaftaran ini dan membuat akun baru?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Setujui',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/registration/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          verifiedBy: 1, // should be current user ID
        }),
      });

      if (!response.ok) throw new Error('Gagal menyetujui');
      const result = await response.json();

      // Update local state
      setRegistrations(registrations.map(r => r.id === id ? result.data : r));
      setIsViewModalOpen(false);
      setSelectedRegistration(null);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Pendaftaran disetujui dan akun baru telah dibuat',
        confirmButtonColor: '#3b82f6'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err instanceof Error ? err.message : 'Gagal menyetujui pendaftaran',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (id: number) => {
    setRejectingId(id);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validasi',
        text: 'Alasan penolakan tidak boleh kosong',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    if (!rejectingId) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/registration/${rejectingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          rejectReason,
          verifiedBy: 1, // should be current user ID
        }),
      });

      if (!response.ok) throw new Error('Gagal menolak');
      const result = await response.json();

      // Update local state
      setRegistrations(registrations.map(r => r.id === rejectingId ? result.data : r));
      setIsViewModalOpen(false);
      setSelectedRegistration(null);
      setIsRejectModalOpen(false);
      setRejectReason('');
      setRejectingId(null);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Pendaftaran telah ditolak',
        confirmButtonColor: '#3b82f6'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err instanceof Error ? err.message : 'Gagal menolak pendaftaran',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' };
      case 2:
        return { label: 'Disetujui', color: 'bg-green-100 text-green-800' };
      case 3:
        return { label: 'Ditolak', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      const prevPage = pagination.page - 1;
      setPagination(prev => ({ ...prev, page: prevPage }));
      fetchRegistrations(prevPage);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasMore) {
      const nextPage = pagination.page + 1;
      setPagination(prev => ({ ...prev, page: nextPage }));
      fetchRegistrations(nextPage);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      search: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Sports Data Handlers
  const handleSportsApprove = async (id: number) => {
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: 'Apakah Anda yakin ingin menyetujui data keolahragaan ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Setujui',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    setSportsIsProcessing(true);
    try {
      // For facility records, make real API call
      if (sportsDataTab === 'facility') {
        const response = await fetch(`/api/verifikasi/facility-record/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'approve',
          }),
        });

        if (!response.ok) throw new Error('Gagal menyetujui data');
      } else if (sportsDataTab === 'athlete') {
        const response = await fetch(`/api/verifikasi/athlete/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'APPROVED',
          }),
        });

        if (!response.ok) throw new Error('Gagal menyetujui data atlet');
      } else {
        // Simulate for other types
        setSportsData(sportsData.map(d => d.id === id ? { ...d, status: 2 } : d));
      }

      // Refresh data after approval
      fetchSportsData(sportsPagination.page, sportsDataTab);
      
      setIsSportsViewModalOpen(false);
      setSelectedSportsData(null);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data keolahragaan telah disetujui',
        confirmButtonColor: '#3b82f6'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err instanceof Error ? err.message : 'Gagal menyetujui data',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSportsIsProcessing(false);
    }
  };

  const handleSportsRejectClick = (id: number) => {
    setSportsRejectingId(id);
    setSportsRejectReason('');
    setIsSportsRejectModalOpen(true);
  };

  const handleSportsRejectSubmit = async () => {
    if (!sportsRejectReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validasi',
        text: 'Alasan penolakan tidak boleh kosong',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    if (!sportsRejectingId) return;

    setSportsIsProcessing(true);
    try {
      // For facility records, make real API call
      if (sportsDataTab === 'facility') {
        const response = await fetch(`/api/verifikasi/facility-record/${sportsRejectingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'reject',
            rejectionReason: sportsRejectReason,
          }),
        });

        if (!response.ok) throw new Error('Gagal menolak data');
        
        // Refresh data after rejection
        fetchSportsData(sportsPagination.page, sportsDataTab);
      } else {
        // Simulate for other types
        setSportsData(sportsData.map(d => d.id === sportsRejectingId ? { ...d, status: 3 } : d));
      }
      
      setIsSportsViewModalOpen(false);
      setSelectedSportsData(null);
      setIsSportsRejectModalOpen(false);
      setSportsRejectReason('');
      setSportsRejectingId(null);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data keolahragaan telah ditolak',
        confirmButtonColor: '#3b82f6'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err instanceof Error ? err.message : 'Gagal menolak data',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSportsIsProcessing(false);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Verifikasi Data</h1>
        <p className="text-gray-600">Kelola proses verifikasi pendaftaran dan data keolahragaan</p>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-0">
          <button
            onClick={() => setActiveTab('registration')}
            className={`px-6 py-3 font-semibold text-sm transition-colors ${
              activeTab === 'registration'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Verifikasi Pendaftaran
          </button>
          <button
            onClick={() => setActiveTab('sports')}
            className={`px-6 py-3 font-semibold text-sm transition-colors ${
              activeTab === 'sports'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Verifikasi Data Keolahragaan
          </button>
        </div>
      </div>

      {/* Tab 1: Verifikasi Pendaftaran */}
      {activeTab === 'registration' && (
        <>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-600">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Menunggu Verifikasi</p>
                  <p className="text-2xl font-bold text-gray-900">{registrations.filter(r => r.status === 1).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Disetujui</p>
                  <p className="text-2xl font-bold text-gray-900">{registrations.filter(r => r.status === 2).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-600">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Ditolak</p>
                  <p className="text-2xl font-bold text-gray-900">{registrations.filter(r => r.status === 3).length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Tutup Filter' : 'Buka Filter'}
            </button>
          </div>

          {/* Filter Section */}
          {showFilters && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Semua Status --</option>
                    <option value="1">Menunggu Verifikasi</option>
                    <option value="2">Disetujui</option>
                    <option value="3">Ditolak</option>
                  </select>
                </div>

                {/* Search Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari (Nama/Email/NIP)
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Masukkan nama, email atau NIP"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Reset Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : registrations.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                Belum ada data pendaftaran
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Lengkap</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">NIP</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kecamatan</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tanggal Daftar</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {registrations.map((reg, index) => {
                      const statusBadge = getStatusBadge(reg.status);
                      return (
                        <tr key={reg.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-600">{(pagination.page - 1) * 10 + index + 1}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{reg.namaLengkap}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{reg.nip}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{reg.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{reg.kecamatan?.nama}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(reg.createdAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 text-xs rounded-full font-semibold ${statusBadge.color}`}>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedRegistration(reg);
                                  setIsViewModalOpen(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {reg.status === 1 && (
                                <>
                                  <button
                                    onClick={() => handleApprove(reg.id)}
                                    disabled={isProcessing}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Setujui"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleRejectClick(reg.id)}
                                    disabled={isProcessing}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Tolak"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                {registrations.length > 0 && (
                  <div className="flex flex-col items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 gap-4 sm:flex-row">
                    <div className="text-sm text-gray-600">
                      Menampilkan {(pagination.page - 1) * 10 + 1} - {Math.min(pagination.page * 10, pagination.total)} dari {pagination.total} data
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={pagination.page === 1 || loading}
                        className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-gray-600">
                        Halaman {pagination.page} dari {pagination.totalPages}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={!pagination.hasMore || loading}
                        className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Tab 2: Verifikasi Data Keolahragaan */}
      {activeTab === 'sports' && (
        <>
          {/* Sub-tabs untuk tipe data keolahragaan */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-0 flex-wrap">
              <button
                onClick={() => setSportsDataTab('facility')}
                className={`px-5 py-3 font-semibold text-sm transition-colors ${
                  sportsDataTab === 'facility'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Fasilitas
              </button>
              <button
                onClick={() => setSportsDataTab('equipment')}
                className={`px-5 py-3 font-semibold text-sm transition-colors ${
                  sportsDataTab === 'equipment'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Peralatan
              </button>
              <button
                onClick={() => setSportsDataTab('athlete')}
                className={`px-5 py-3 font-semibold text-sm transition-colors ${
                  sportsDataTab === 'athlete'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Atlet
              </button>
              <button
                onClick={() => setSportsDataTab('sport_group')}
                className={`px-5 py-3 font-semibold text-sm transition-colors ${
                  sportsDataTab === 'sport_group'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grup Olahraga
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-600">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Menunggu Verifikasi</p>
                  <p className="text-2xl font-bold text-gray-900">{sportsData.filter(d => d.status === 1).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Disetujui</p>
                  <p className="text-2xl font-bold text-gray-900">{sportsData.filter(d => d.status === 2).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-600">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Ditolak</p>
                  <p className="text-2xl font-bold text-gray-900">{sportsData.filter(d => d.status === 3).length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setShowSportsFilters(!showSportsFilters)}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {showSportsFilters ? 'Tutup Filter' : 'Buka Filter'}
            </button>
          </div>

          {/* Data Table for Sports Data */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
            {sportsData.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                Belum ada data untuk tipe ini
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {sportsDataTab === 'facility' && 'Nama Prasarana'}
                        {sportsDataTab === 'equipment' && 'Nama Peralatan'}
                        {sportsDataTab === 'athlete' && 'Nama Lengkap'}
                        {sportsDataTab === 'sport_group' && 'Nama Grup'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Desa/Kelurahan</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kecamatan</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {sportsDataTab === 'facility' && 'Kondisi'}
                        {sportsDataTab === 'equipment' && 'Jumlah'}
                        {sportsDataTab === 'athlete' && 'NIK'}
                        {sportsDataTab === 'sport_group' && 'Pemimpin'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tanggal Input</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sportsData.map((data, index) => {
                      const statusBadge = getStatusBadge(data.status);
                      let mainName = '';
                      let subInfo = '';
                      
                      if (sportsDataTab === 'facility') {
                        mainName = data.prasaranaName || '-';
                        subInfo = data.condition || '-';
                      } else if (sportsDataTab === 'equipment') {
                        mainName = data.saranaName || '-';
                        subInfo = `${data.quantity || 0} ${data.unit || ''}`;
                      } else if (sportsDataTab === 'athlete') {
                        mainName = data.fullName || '-';
                        subInfo = data.nationalId || '-';
                      } else if (sportsDataTab === 'sport_group') {
                        mainName = data.groupName || '-';
                        subInfo = data.leaderName || '-';
                      }
                      
                      return (
                        <tr key={data.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{mainName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{data.desaKelurahanName || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{data.kecamatanName || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{subInfo}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(data.createdAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 text-xs rounded-full font-semibold ${statusBadge.color}`}>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedSportsData(data);
                                  setIsSportsViewModalOpen(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {data.status === 1 && (
                                <>
                                  <button
                                    onClick={() => handleSportsApprove(data.id)}
                                    disabled={sportsIsProcessing}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Setujui"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleSportsRejectClick(data.id)}
                                    disabled={sportsIsProcessing}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Tolak"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination for Sports Data */}
                {sportsData.length > 0 && (
                  <div className="flex flex-col items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 gap-4 sm:flex-row">
                    <div className="text-sm text-gray-600">
                      Menampilkan {(sportsPagination.page - 1) * 10 + 1} - {Math.min(sportsPagination.page * 10, sportsPagination.total)} dari {sportsPagination.total} data
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => sportsDataTab === 'facility' && fetchSportsData(sportsPagination.page - 1, sportsDataTab)}
                        disabled={sportsPagination.page === 1}
                        className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-gray-600">
                        Halaman {sportsPagination.page} dari {sportsPagination.totalPages}
                      </span>
                      <button
                        onClick={() => sportsDataTab === 'facility' && fetchSportsData(sportsPagination.page + 1, sportsDataTab)}
                        disabled={!sportsPagination.hasMore}
                        className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* View Modal for Sports Data */}
      {isSportsViewModalOpen && selectedSportsData && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {selectedSportsData.type === 'facility' && 'Detail Prasarana'}
              {selectedSportsData.type === 'equipment' && 'Detail Peralatan'}
              {selectedSportsData.type === 'athlete' && 'Detail Atlet'}
              {selectedSportsData.type === 'sport_group' && 'Detail Grup Olahraga'}
            </h2>

            {selectedSportsData.type === 'facility' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Prasarana</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.prasaranaName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tahun</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kondisi</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status Kepemilikan</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.ownershipStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Desa/Kelurahan</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.desaKelurahanName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kecamatan</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.kecamatanName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alamat</p>
                  <p className="font-semibold text-gray-900">{selectedSportsData.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Catatan</p>
                  <p className="font-semibold text-gray-900">{selectedSportsData.notes || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-semibold ${selectedSportsData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedSportsData.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </p>
                </div>

                {selectedSportsData.photos && selectedSportsData.photos.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Lampiran Foto</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {selectedSportsData.photos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={photo.fileUrl}
                              alt={photo.fileName || 'Photo'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <a
                            href={photo.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <Eye className="w-6 h-6 text-white" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedSportsData.type === 'equipment' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Peralatan</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.saranaName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tahun</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jumlah</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.quantity} {selectedSportsData.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status Kegunaan</p>
                    <p className={`font-semibold ${selectedSportsData.isUsable ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedSportsData.isUsable ? 'Dapat Digunakan' : 'Tidak Dapat Digunakan'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status Bantuan</p>
                    <p className="font-semibold text-gray-900">
                      {selectedSportsData.isGovernmentGrant ? 'Bantuan Pemerintah' : 'Milik Sendiri'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Desa/Kelurahan</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.desaKelurahanName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kecamatan</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.kecamatanName}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedSportsData.type === 'athlete' && (
              <div className="space-y-4">
                {selectedSportsData.photoUrl && (
                  <div className="flex justify-center">
                    <img
                      src={selectedSportsData.photoUrl}
                      alt={selectedSportsData.fullName}
                      className="w-40 h-52 object-cover rounded-lg border border-gray-300 shadow-sm"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">NIK</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.nationalId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tempat Lahir</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.birthPlace || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Lahir</p>
                    <p className="font-semibold text-gray-900">
                      {selectedSportsData.birthDate ? new Date(selectedSportsData.birthDate).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jenis Kelamin</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.gender || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kategori</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.athleteCategory || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Desa/Kelurahan</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.desaKelurahanName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kecamatan</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.kecamatanName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Organisasi</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.organization || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cabang Olahraga</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.cabangOlahragaName || '-'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alamat Lengkap</p>
                  <p className="font-semibold text-gray-900">{selectedSportsData.fullAddress || '-'}</p>
                </div>

                {selectedSportsData.achievements && selectedSportsData.achievements.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Prestasi Atlet</p>
                    <div className="space-y-3">
                      {selectedSportsData.achievements.map((achievement, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500">Nama Prestasi</p>
                              <p className="font-medium text-gray-900">{achievement.achievementName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Kategori</p>
                              <p className="font-medium text-gray-900">{achievement.category || '-'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Medali</p>
                              <p className="font-medium text-gray-900">{achievement.medal || '-'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Tahun</p>
                              <p className="font-medium text-gray-900">{achievement.year || '-'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedSportsData.type === 'sport_group' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Grup</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.groupName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tahun</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nama Pemimpin</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.leaderName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jumlah Anggota</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.memberCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cabang Olahraga</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.cabangOlahragaName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nomor SK</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.decreeNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status Verifikasi</p>
                    <p className={`font-semibold ${selectedSportsData.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedSportsData.isVerified ? 'Terverifikasi' : 'Belum Terverifikasi'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Desa/Kelurahan</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.desaKelurahanName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kecamatan</p>
                    <p className="font-semibold text-gray-900">{selectedSportsData.kecamatanName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alamat Sekretariat</p>
                  <p className="font-semibold text-gray-900">{selectedSportsData.secretariatAddress || '-'}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end mt-6">
              {selectedSportsData.status === 1 && (
                <>
                  <button
                    onClick={() => handleSportsApprove(selectedSportsData.id)}
                    disabled={sportsIsProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleSportsRejectClick(selectedSportsData.id)}
                    disabled={sportsIsProcessing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    Tolak
                  </button>
                </>
              )}
              <button
                onClick={() => setIsSportsViewModalOpen(false)}
                disabled={sportsIsProcessing}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal for Sports Data */}
      {isSportsRejectModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Form Penolakan Data Keolahragaan</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Penolakan *
              </label>
              <textarea
                value={sportsRejectReason}
                onChange={(e) => setSportsRejectReason(e.target.value)}
                placeholder="Masukkan alasan penolakan data ini..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                {sportsRejectReason.length}/500 karakter
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsSportsRejectModalOpen(false);
                  setSportsRejectReason('');
                  setSportsRejectingId(null);
                }}
                disabled={sportsIsProcessing}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSportsRejectSubmit}
                disabled={sportsIsProcessing || !sportsRejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {sportsIsProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  'Tolak Data'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal for Registration */}
      {isViewModalOpen && selectedRegistration && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Detail Pendaftaran</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">Nama Lengkap</p>
                <p className="font-semibold text-gray-900">{selectedRegistration.namaLengkap}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NIP</p>
                <p className="font-semibold text-gray-900">{selectedRegistration.nip}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{selectedRegistration.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nomor Telepon</p>
                <p className="font-semibold text-gray-900">{selectedRegistration.noTelepon}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kecamatan</p>
                <p className="font-semibold text-gray-900">{selectedRegistration.kecamatan?.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal Pendaftaran</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedRegistration.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
              {selectedRegistration.verifiedAt && (
                <div>
                  <p className="text-sm text-gray-600">Tanggal Verifikasi</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedRegistration.verifiedAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-semibold ${getStatusBadge(selectedRegistration.status).color}`}>
                  {getStatusBadge(selectedRegistration.status).label}
                </p>
              </div>

              {selectedRegistration.rejectReason && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Alasan Penolakan</p>
                  <p className="font-semibold text-red-600">{selectedRegistration.rejectReason}</p>
                </div>
              )}
            </div>

            {/* Document Section */}
            {selectedRegistration.docUrl && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Dokumen SK</p>
                <a
                  href={selectedRegistration.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                >
                  <Download className="w-4 h-4" />
                  Download Dokumen
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              {selectedRegistration.status === 1 && (
                <>
                  <button
                    onClick={() => handleApprove(selectedRegistration.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleRejectClick(selectedRegistration.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    Tolak
                  </button>
                </>
              )}
              <button
                onClick={() => setIsViewModalOpen(false)}
                disabled={isProcessing}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal for Registration */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Form Penolakan Pendaftaran</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Penolakan *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Masukkan alasan penolakan data ini..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                {rejectReason.length}/500 karakter
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectReason('');
                  setRejectingId(null);
                }}
                disabled={isProcessing}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={isProcessing || !rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  'Tolak Pendaftaran'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verifikasi;
