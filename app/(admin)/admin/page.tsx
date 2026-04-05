'use client';

import React, { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// ApexCharts (dynamic import for SSR)
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import {
  Users,
  Trophy,
  Building2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertTriangle,
  MapPin,
  Award,
  PieChart,
  LineChart,
  Loader,
  Download
} from 'lucide-react';
import Swal from 'sweetalert2';
import DashboardMap from '@/components/admin/dashboard/DashboardMap';
import DistrictTable from '@/components/admin/dashboard/DistrictTable';
import {
  RegionalGroupChart,
  VerificationStatusChart,
  GrowthTrendChart,
  MemberDistributionChart,
  MOCK_SPORTS_GROUPS,
  MOCK_REGION_MAPPING,
  SportsGroup,
} from '@/components/admin/dashboard/SportsGroupAnalytics';

interface KecamatanSummary {
  id: number;
  nama: string;
  latitude?: string | null;
  longitude?: string | null;
  totalEquipment: number;
  totalEquipmentQuantity: number;
  totalPrasarana: number;
  totalSportsGroups: number;
  totalAthletes: number;
  totalAchievement: number;
}

interface DashboardSummary {
  totalKecamatan: number;
  totalEquipment: number;
  totalEquipmentQuantity: number;
  totalPrasarana: number;
  totalSportsGroups: number;
  totalAthletes: number;
  totalAchievement: number;
}

interface KecamatanDetail {
  kecamatan: {
    id: number;
    nama: string;
    latitude?: string | null;
    longitude?: string | null;
  };
  summary: {
    totalDesaKelurahan: number;
    totalInfrastructure: number;
    totalSarana: number;
    totalSportsGroups: number;
    totalAthletes: number;
    totalAchievement: number;
    athletesByCategory: {
      atlet: number;
      pelatih: number;
      wasitJuri: number;
    };
  };
  data: {
    desaKelurahan: any[];
    facilityRecords: any[];
    sportsGroups: any[];
    athletes: any[];
    equipments: any[];
  };
}

interface DesaSummary {
  id: number;
  nama: string;
  tipe: string;
  totalFacility: number;
  totalSportsGroups: number;
  totalAthlete: number;
  totalAchievement: number;
  latitude?: string;
  longitude?: string;
}

interface ConditionData {
  condition: string;
  label: string;
  count: number;
}

interface OwnershipData {
  ownership: string;
  label: string;
  count: number;
}

const Dashboard: FC = () => {
  // State untuk chart data
  const [sports, setSports] = useState<{ id: number; nama: string }[]>([]);
  const [athleteDist, setAthleteDist] = useState<{ labels: string[]; series: number[] }>({ labels: [], series: [] });
  const [groupDist, setGroupDist] = useState<{ labels: string[]; series: number[] }>({ labels: [], series: [] });

  // Fetch cabang olahraga
  useEffect(() => {
    const fetchSports = async () => {
      const res = await fetch('/api/masterdata/cabang-olahraga?page=1&limit=100');
      const data = await res.json();
      setSports(data?.data || []);
    };
    fetchSports();
  }, []);

  // Fetch distribusi atlet per cabang olahraga
  useEffect(() => {
    if (sports.length === 0) return;
    const fetchAthleteDist = async () => {
      const labels: string[] = [];
      const series: number[] = [];
      for (const sport of sports) {
        const res = await fetch(`/api/masterdata/athlete?page=1&limit=1&sportId=${sport.id}`);
        const data = await res.json();
        labels.push(sport.nama);
        series.push(data?.meta?.total || 0);
      }
      setAthleteDist({ labels, series });
    };
    fetchAthleteDist();
  }, [sports]);

  // Fetch distribusi kelompok olahraga per cabang olahraga (jika sudah ada relasi sportId di kelompok)
  useEffect(() => {
    if (sports.length === 0) return;
    const fetchGroupDist = async () => {
      const labels: string[] = [];
      const series: number[] = [];
      for (const sport of sports) {
        // NOTE: pastikan endpoint /api/masterdata/sports-group support filter sportId jika sudah ada di schema
        const res = await fetch(`/api/masterdata/sports-group?page=1&limit=1&sportId=${sport.id}`);
        const data = await res.json();
        labels.push(sport.nama);
        series.push(data?.meta?.total || 0);
      }
      setGroupDist({ labels, series });
    };
    fetchGroupDist();
  }, [sports]);

  // Tahun filter
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Kecamatan filter
  const [kecamatanOptions, setKecamatanOptions] = useState<{ id: number; nama: string }[]>([]);
  const [selectedKecamatanId, setSelectedKecamatanId] = useState<number | null>(null);

  const [kecamatanData, setKecamatanData] = useState<KecamatanSummary[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [achievementTrendData, setAchievementTrendData] = useState<{ years: number[]; counts: number[] }>({ years: [], counts: [] });

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<KecamatanDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Sports Group Analytics States
  const [sportsGroups, setSportsGroups] = useState<SportsGroup[]>([]);
  const [regionMapping, setRegionMapping] = useState<Map<number, string>>(MOCK_REGION_MAPPING);
  const [sportGroupsLoading, setSportGroupsLoading] = useState(false);

  // Facility Condition Distribution State
  const [conditionData, setConditionData] = useState<ConditionData[]>([]);
  const [conditionLoading, setConditionLoading] = useState(false);

  // Facility Ownership Distribution State
  const [ownershipData, setOwnershipData] = useState<OwnershipData[]>([]);
  const [ownershipLoading, setOwnershipLoading] = useState(false);

  // Equipment Trends State
  const [equipmentTrendData, setEquipmentTrendData] = useState<{ years: number[]; series: any[] }>({ years: [], series: [] });
  const [equipmentTrendLoading, setEquipmentTrendLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  // Pagination states for modal tables
  const [kelompokPage, setKelompokPage] = useState<number>(1);
  const [prasaranaPge, setPrasaranaPage] = useState<number>(1);
  const [saranaPage, setSaranaPage] = useState<number>(1);
  const [atletePage, setatletePage] = useState<number>(1);
  const MODAL_ITEMS_PER_PAGE = 5;

  // Reset page to 1 whenever data changes (misalnya filter tahun diganti)
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, kecamatanData]);

  // Handler export dashboard data to Excel
  const handleExport = async () => {
    if (!selectedKecamatanId) {
      Swal.fire({
        icon: 'warning',
        title: 'Filter Tidak Lengkap',
        text: 'Silakan pilih Kecamatan untuk mengekspor data',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    setExporting(true);
    try {
      const params = new URLSearchParams();
      params.append('year', selectedYear.toString());
      params.append('kecamatanId', selectedKecamatanId.toString());

      const response = await fetch(`/api/dashboard/export?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal mengekspor data');
      }

      // Create blob from response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Dashboard_${selectedYear}_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data berhasil diekspor ke Excel',
        confirmButtonColor: '#3B82F6'
      });
    } catch (err) {
      console.error('Export error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengekspor',
        text: err instanceof Error ? err.message : 'Terjadi kesalahan saat mengekspor data',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setExporting(false);
    }
  };

  const handleViewDetail = async (district: DesaSummary) => {
    setIsDetailLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('kecamatanId', district.id.toString());
      params.set('year', selectedYear.toString());

      const response = await fetch(`/api/dashboard/kecamatan?${params.toString()}`);
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload?.error || 'Gagal memuat detail kecamatan');
      }

      setSelectedDetail(payload);
      setDetailModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch kecamatan detail:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat detail');
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Reset pagination states when modal opens/closes
  useEffect(() => {
    if (detailModalOpen) {
      setKelompokPage(1);
      setPrasaranaPage(1);
      setSaranaPage(1);
      setatletePage(1);
    }
  }, [detailModalOpen]);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const params = new URLSearchParams();
      params.set('year', selectedYear.toString());
      if (selectedKecamatanId) {
        params.set('kecamatanId', selectedKecamatanId.toString());
      }

      const response = await fetch(`/api/dashboard/kecamatan-summary?${params.toString()}`);

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Unknown response error' }));
        throw new Error(err?.error || 'Failed to load dashboard data');
      }

      const payload = await response.json();

      if (!payload?.success || !payload?.data) {
        throw new Error('Invalid dashboard response from server');
      }

      setDashboardSummary(payload.data.summary);
      setKecamatanData(payload.data.kecamatan || []);
    } catch (fetchError) {
      const msg = fetchError instanceof Error ? fetchError.message : 'Terjadi kesalahan saat memuat data dashboard';
      setError(msg);
      console.error('Dashboard data fetch failed:', fetchError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchKecamatanOptions = async () => {
      try {
        const res = await fetch('/api/masterdata/kecamatan?page=1&limit=1000');
        const payload = await res.json();
        const allKecamatan = payload?.data || [];
        setKecamatanOptions(allKecamatan);
      } catch (err) {
        console.error('Failed to load kecamatan options:', err);
      }
    };

    fetchKecamatanOptions();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear, selectedKecamatanId]);

  // Fetch achievement trends
  useEffect(() => {
    const fetchAchievementTrends = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedKecamatanId) {
          params.set('kecamatanId', selectedKecamatanId.toString());
        }

        const res = await fetch(`/api/dashboard/achievement-trends?${params.toString()}`);
        const data = await res.json();
        
        if (data?.success && data?.data) {
          setAchievementTrendData(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch achievement trends:', err);
      }
    };

    fetchAchievementTrends();
  }, [selectedKecamatanId]);

  // Fetch Sports Groups for Analytics
  useEffect(() => {
    const fetchSportsGroups = async () => {
      setSportGroupsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedKecamatanId) {
          params.set('kecamatanId', selectedKecamatanId.toString());
        }

        const response = await fetch(`/api/masterdata/sports-group?page=1&limit=1000${params.toString() ? '&' + params.toString() : ''}`);
        const data = await response.json();

        if (data?.data && Array.isArray(data.data)) {
          const transformed = data.data.map((group: any) => ({
            id: group.id,
            desaKelurahanId: group.desaKelurahanId,
            groupName: group.groupName || group.nama,
            leaderName: group.leaderName,
            memberCount: group.memberCount || 0,
            isVerified: group.isVerified || false,
            decreeNumber: group.decreeNumber,
            secretariatAddress: group.secretariatAddress,
            createdAt: group.createdAt ? new Date(group.createdAt) : undefined,
          }));
          setSportsGroups(transformed);
        } else {
          // Use mock data as fallback
          setSportsGroups(MOCK_SPORTS_GROUPS);
        }
      } catch (err) {
        console.error('Failed to fetch sports groups:', err);
        // Use mock data as fallback
        setSportsGroups(MOCK_SPORTS_GROUPS);
      } finally {
        setSportGroupsLoading(false);
      }
    };

    fetchSportsGroups();
  }, [selectedKecamatanId]);

  // Fetch Facility Condition Distribution
  useEffect(() => {
    const fetchConditionData = async () => {
      setConditionLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('year', selectedYear.toString());
        if (selectedKecamatanId) {
          params.set('kecamatanId', selectedKecamatanId.toString());
        }

        const response = await fetch(`/api/facility-records/distribution-by-condition?${params.toString()}`);
        const data = await response.json();

        if (data?.success && Array.isArray(data.data)) {
          setConditionData(data.data);
        } else {
          setConditionData([]);
        }
      } catch (err) {
        console.error('Failed to fetch condition data:', err);
        setConditionData([]);
      } finally {
        setConditionLoading(false);
      }
    };

    fetchConditionData();
  }, [selectedYear, selectedKecamatanId]);

  // Fetch Facility Ownership Distribution
  useEffect(() => {
    const fetchOwnershipData = async () => {
      setOwnershipLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('year', selectedYear.toString());
        if (selectedKecamatanId) {
          params.set('kecamatanId', selectedKecamatanId.toString());
        }

        const response = await fetch(`/api/facility-records/distribution-by-ownership?${params.toString()}`);
        const data = await response.json();

        if (data?.success && Array.isArray(data.data)) {
          setOwnershipData(data.data);
        } else {
          setOwnershipData([]);
        }
      } catch (err) {
        console.error('Failed to fetch ownership data:', err);
        setOwnershipData([]);
      } finally {
        setOwnershipLoading(false);
      }
    };

    fetchOwnershipData();
  }, [selectedYear, selectedKecamatanId]);

  // Fetch Equipment Trends
  useEffect(() => {
    const fetchEquipmentTrends = async () => {
      setEquipmentTrendLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('year', selectedYear.toString());
        if (selectedKecamatanId) {
          params.set('kecamatanId', selectedKecamatanId.toString());
        }

        const response = await fetch(`/api/equipment/trends?${params.toString()}`);
        const data = await response.json();

        if (data?.success && data?.data) {
          setEquipmentTrendData(data.data);
        } else {
          setEquipmentTrendData({ years: [], series: [] });
        }
      } catch (err) {
        console.error('Failed to fetch equipment trends:', err);
        setEquipmentTrendData({ years: [], series: [] });
      } finally {
        setEquipmentTrendLoading(false);
      }
    };

    fetchEquipmentTrends();
  }, [selectedYear, selectedKecamatanId]);

  const supply = dashboardSummary?.totalEquipment ?? 0;
  const demand = dashboardSummary?.totalAthletes ?? 0;
  const maxVal = Math.max(supply, demand, 1);
  const supplyPercent = Math.round((supply / maxVal) * 100);
  const demandPercent = Math.round((demand / maxVal) * 100);

  const topStats = dashboardSummary
    ? [
        {
          label: 'Total Atlet',
          value: dashboardSummary.totalAthletes,
          trend: 8.2,
          status: 'positive' as const,
        },
        {
          label: 'Kelompok Olahraga',
          value: dashboardSummary.totalSportsGroups,
          trend: 2.1,
          status: 'positive' as const,
        },
        {
          label: 'Sarana',
          value: dashboardSummary.totalEquipment,
          trend: -0.5,
          status: 'negative' as const,
        },
        {
          label: 'Prasarana',
          value: dashboardSummary.totalPrasarana,
          trend: 3.7,
          status: 'positive' as const,
        },
        {
          label: 'Prestasi Atlet',
          value: dashboardSummary.totalAchievement,
          trend: 12.3,
          status: 'positive' as const,
        },
      ]
    : [];

  if (isLoading) {
    return (
      <main className="space-y-6 p-6">
        <section>
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-gray-600 mt-1">Memuat data...</p>
        </section>
        <section className="h-64 rounded-xl bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="space-y-6 p-6">
        <section>
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-gray-600 mt-1">Error loading data</p>
        </section>
        <section className="rounded-xl bg-red-50 border border-red-200 p-6">
          <p className="text-red-700 font-semibold">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">
      <section className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <div className="flex flex-row items-center justify-between mt-1">
          <p className="text-gray-600">Ringkasan data per kecamatan</p>
          <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-row items-center gap-2">
              <label htmlFor="filterYear" className="text-sm font-semibold text-slate-700 whitespace-nowrap">Tahun:</label>
              <select
                id="filterYear"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-row items-center gap-2">
              <label htmlFor="filterKecamatan" className="text-sm font-semibold text-slate-700 whitespace-nowrap">Kecamatan:</label>
              <select
                id="filterKecamatan"
                value={selectedKecamatanId ?? ''}
                onChange={(e) => setSelectedKecamatanId(e.target.value ? Number(e.target.value) : null)}
                className="border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua</option>
                {kecamatanOptions.map((kec) => (
                  <option key={kec.id} value={kec.id}>{kec.nama}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleExport}
              disabled={exporting || !selectedKecamatanId}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {exporting ? 'Mengekspor...' : 'Export Excel'}
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {topStats.map((item) => (
          <div key={item.label} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="text-sm text-gray-500">{item.label}</div>
            <div className="text-3xl font-bold mt-1">{item.value.toLocaleString('id-ID')}</div>
            <div className={`inline-flex items-center text-sm font-medium mt-2 ${item.status === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {item.status === 'positive' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {item.trend > 0 ? '+' : ''}{item.trend}% dari bulan lalu
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4">
        <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Distribusi Wilayah (Kecamatan)</h2>
            <MapPin className="w-5 h-5 text-slate-500" />
          </div>
          <div className="h-95">
            <DashboardMap
              districts={kecamatanData.map((kecamatan) => ({
                id: kecamatan.id,
                nama: kecamatan.nama,
                tipe: 'kecamatan',
                totalFacility: kecamatan.totalPrasarana,
                totalSportsGroups: kecamatan.totalSportsGroups,
                totalAthlete: kecamatan.totalAthletes,
                totalAchievement: kecamatan.totalAchievement,
                latitude: kecamatan.latitude ?? undefined,
                longitude: kecamatan.longitude ?? undefined,
              }))}
            />
          </div>
        </article>
        <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-3">Tren Equipment (Hibah vs Non Hibah)</h2>
          {equipmentTrendLoading ? (
            <div className="flex items-center justify-center h-80">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : equipmentTrendData.years && equipmentTrendData.years.length > 0 ? (
            <div className="h-80 w-full">
              <ReactApexChart
                type="line"
                width="100%"
                height={320}
                series={equipmentTrendData.series}
                options={{
                  chart: {
                    type: 'line',
                    toolbar: { show: true },
                    sparkline: { enabled: false },
                  },
                  stroke: {
                    curve: 'smooth',
                    width: 3,
                    colors: ['#10b981', '#f59e0b'],
                  },
                  markers: {
                    size: 5,
                    colors: ['#10b981', '#f59e0b'],
                    strokeColors: '#fff',
                    strokeWidth: 2,
                  },
                  xaxis: {
                    categories: equipmentTrendData.years,
                    title: {
                      text: 'Tahun',
                    },
                    axisBorder: {
                      show: true,
                    },
                    axisTicks: {
                      show: true,
                    },
                  },
                  yaxis: {
                    title: {
                      text: 'Total Quantity',
                    },
                    min: 0,
                  },
                  grid: {
                    show: true,
                    borderColor: '#e5e7eb',
                    strokeDashArray: 3,
                  },
                  tooltip: {
                    enabled: true,
                    theme: 'light',
                    x: {
                      format: 'yyyy',
                    },
                    y: {
                      formatter: (val: number) => `${val} unit`,
                    },
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: (val: number) => `${val}`,
                  },
                  legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    fontSize: '13px',
                  },
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 text-slate-500">
              <p>Tidak ada data tren equipment</p>
            </div>
          )}
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <article className="xl:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4">Distribusi Kepemilikan Fasilitas</h2>
          {ownershipLoading ? (
            <div className="flex items-center justify-center h-80">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : ownershipData.length > 0 ? (
            <>
              <div className="flex justify-center mb-4">
                <ReactApexChart
                  type="donut"
                  width="100%"
                  height={300}
                  series={ownershipData.map(d => d.count)}
                  options={{
                    chart: {
                      type: 'donut',
                    },
                    labels: ownershipData.map(d => d.label),
                    colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'],
                    plotOptions: {
                      pie: {
                        donut: {
                          size: '65%',
                          labels: {
                            show: true,
                            name: {
                              show: true,
                              fontSize: '14px',
                              fontWeight: 600,
                            },
                            value: {
                              show: true,
                              fontSize: '20px',
                              fontWeight: 600,
                              formatter: function (w: string | number) {
                                return w.toString();
                              },
                            },
                            total: {
                              show: true,
                              label: 'Total Fasilitas',
                              fontSize: '14px',
                              formatter: function (w: any) {
                                return (w.globals.seriesTotals.reduce((a: number, b: number) => a + b) || 0).toString();
                              },
                            },
                          },
                        },
                      },
                    },
                    tooltip: {
                      enabled: true,
                      y: {
                        formatter: function(value) {
                          return value + ' fasilitas';
                        }
                      }
                    },
                    legend: {
                      position: 'bottom',
                      fontSize: '12px',
                      labels: {
                        useSeriesColors: true,
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val: string | number) {
                        const numVal = typeof val === 'string' ? parseFloat(val) : (val as number);
                        return (Math.round(numVal * 100) / 100).toFixed(1) + '%';
                      },
                    },
                  }}
                />
              </div>

              {/* Summary Cards */}
              <div className="space-y-2">
                {ownershipData.map((item, idx) => {
                  const totalFacilities = ownershipData.reduce((sum, d) => sum + d.count, 0);
                  const percentage = totalFacilities > 0 ? ((item.count / totalFacilities) * 100).toFixed(1) : '0';
                  const cardColors = [
                    'bg-blue-50 border-blue-200 text-blue-800',
                    'bg-purple-50 border-purple-200 text-purple-800',
                    'bg-pink-50 border-pink-200 text-pink-800',
                    'bg-cyan-50 border-cyan-200 text-cyan-800',
                  ];
                  return (
                    <div key={idx} className={`p-3 rounded-lg border ${cardColors[idx] || 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold">{item.label}</p>
                          <p className="text-lg font-bold mt-1">{item.count}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-75 font-medium">{percentage}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-80 text-slate-500">
              <p>Tidak ada data kepemilikan fasilitas</p>
            </div>
          )}
        </article>

        <article className="xl:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4">Distribusi Kondisi Fasilitas</h2>
          {conditionLoading ? (
            <div className="flex items-center justify-center h-80">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : conditionData.length > 0 ? (
            <>
              <div className="flex justify-center mb-4">
                <ReactApexChart
                  type="donut"
                  width="100%"
                  height={300}
                  series={conditionData.map(d => d.count)}
                  options={{
                    chart: {
                      type: 'donut',
                    },
                    labels: conditionData.map(d => d.label),
                    colors: ['#10b981', '#f59e0b', '#f97316', '#ef4444'],
                    plotOptions: {
                      pie: {
                        donut: {
                          size: '65%',
                          labels: {
                            show: true,
                            name: {
                              show: true,
                              fontSize: '14px',
                              fontWeight: 600,
                            },
                            value: {
                              show: true,
                              fontSize: '20px',
                              fontWeight: 600,
                              formatter: function (w: string | number) {
                                return w.toString();
                              },
                            },
                            total: {
                              show: true,
                              label: 'Total Fasilitas',
                              fontSize: '14px',
                              formatter: function (w: any) {
                                return (w.globals.seriesTotals.reduce((a: number, b: number) => a + b) || 0).toString();
                              },
                            },
                          },
                        },
                      },
                    },
                    tooltip: {
                      enabled: true,
                      y: {
                        formatter: function(value) {
                          return value + ' fasilitas';
                        }
                      }
                    },
                    legend: {
                      position: 'bottom',
                      fontSize: '12px',
                      labels: {
                        useSeriesColors: true,
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val: string | number) {
                        const numVal = typeof val === 'string' ? parseFloat(val) : (val as number);
                        return (Math.round(numVal * 100) / 100).toFixed(1) + '%';
                      },
                    },
                  }}
                />
              </div>

              {/* Summary Cards */}
              <div className="space-y-2">
                {conditionData.map((item, idx) => {
                  const totalFacilities = conditionData.reduce((sum, d) => sum + d.count, 0);
                  const percentage = totalFacilities > 0 ? ((item.count / totalFacilities) * 100).toFixed(1) : '0';
                  const cardColors = [
                    'bg-green-50 border-green-200 text-green-800',
                    'bg-yellow-50 border-yellow-200 text-yellow-800',
                    'bg-orange-50 border-orange-200 text-orange-800',
                    'bg-red-50 border-red-200 text-red-800',
                  ];
                  return (
                    <div key={idx} className={`p-3 rounded-lg border ${cardColors[idx] || 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold">{item.label}</p>
                          <p className="text-lg font-bold mt-1">{item.count}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-75 font-medium">{percentage}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-80 text-slate-500">
              <p>Tidak ada data kondisi fasilitas</p>
            </div>
          )}
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Jumlah Kelompok Olahraga per Cabang Olarhaga</h2>
            <Award className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="h-80 w-full">
              {groupDist.series.length > 0 ? (
                <ReactApexChart
                  type="bar"
                  width="100%"
                  height={280}
                  series={[
                    {
                      name: 'Jumlah Kelompok Olahraga',
                      data: groupDist.series,
                      color: '#10b981',
                    },
                  ]}
                  options={{
                    chart: {
                      type: 'bar',
                      toolbar: { show: true },
                      sparkline: { enabled: false },
                    },
                    colors: ['#10b981'],
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: '60%',
                        dataLabels: {
                          position: 'top',
                        },
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: (val: number) => `${val}`,
                      style: {
                        fontSize: '12px',
                        fontWeight: 600,
                        colors: ['#10b981'],
                      },
                      offsetY: -10,
                    },
                    xaxis: {
                      categories: groupDist.labels,
                      title: {
                        text: 'Cabang Olahraga',
                        style: { 
                          fontSize: '13px',
                          fontWeight: 600,
                        },
                      },
                      labels: {
                        rotate: -40,
                        rotateAlways: true,
                        style: {
                          fontSize: '12px',
                          cssClass: 'apexcharts-xaxis-label',
                        },
                        maxHeight: 100,
                      },
                      axisBorder: {
                        show: true,
                      },
                      axisTicks: {
                        show: true,
                      },
                    },
                    yaxis: {
                      title: {
                        text: 'Quantity',
                        style: { 
                          fontSize: '13px',
                          fontWeight: 600,
                        },
                      },
                      min: 0,
                      labels: {
                        formatter: (val: number) => Math.floor(val).toString(),
                      },
                    },
                    grid: {
                      show: true,
                      borderColor: '#e5e7eb',
                      strokeDashArray: 3,
                      xaxis: {
                        lines: {
                          show: false,
                        },
                      },
                      yaxis: {
                        lines: {
                          show: true,
                        },
                      },
                      padding: {
                        left: 10,
                        right: 10,
                        top: 10,
                      },
                    },
                    tooltip: {
                      enabled: true,
                      theme: 'light',
                      y: {
                        formatter: (val: number) => `${Math.floor(val)} kelompok`,
                      },
                      x: {
                        show: true,
                      },
                    },
                    legend: {
                      position: 'top',
                      horizontalAlign: 'right',
                      fontSize: '13px',
                    },
                  }}
                />
              ) : (
                <span className="text-slate-400">Memuat chart...</span>
              )}
            </div>
          </div>
        </article>

        <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Trend Prestasi Atlet (Tahun ke Tahun)</h2>
            <LineChart className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="h-56 flex items-center justify-center">
            {achievementTrendData.years.length > 0 ? (
              <ReactApexChart
                type="line"
                width={600}
                height={280}
                series={[
                  {
                    name: 'Jumlah Prestasi',
                    data: achievementTrendData.counts,
                  },
                ]}
                options={{
                  chart: {
                    type: 'line',
                    toolbar: { show: true },
                    sparkline: { enabled: false },
                  },
                  stroke: {
                    curve: 'smooth',
                    width: 3,
                    colors: ['#0ea5e9'],
                  },
                  markers: {
                    size: 5,
                    colors: ['#0ea5e9'],
                    strokeColors: '#fff',
                    strokeWidth: 2,
                  },
                  xaxis: {
                    categories: achievementTrendData.years,
                    title: {
                      text: 'Tahun',
                    },
                    axisBorder: {
                      show: true,
                    },
                    axisTicks: {
                      show: true,
                    },
                  },
                  yaxis: {
                    title: {
                      text: 'Jumlah Prestasi',
                    },
                    min: 0,
                  },
                  grid: {
                    show: true,
                    borderColor: '#e5e7eb',
                    strokeDashArray: 3,
                  },
                  tooltip: {
                    enabled: true,
                    theme: 'light',
                    x: {
                      format: 'yyyy',
                    },
                    y: {
                      formatter: (val: number) => `${val} prestasi`,
                    },
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: (val: number) => `${val}`,
                  },
                  legend: {
                    position: 'top',
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">Tidak ada data prestasi atlet</div>
            )}
          </div>
        </article>
      </section>



      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h2 className="text-lg font-bold mb-4">Data Summary per Kecamatan</h2>
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div>
            <label htmlFor="filterYear" className="text-sm font-semibold text-slate-700 mr-2">Tahun:</label>
            <select
              id="filterYear"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filterKecamatan" className="text-sm font-semibold text-slate-700 mr-2">Kecamatan:</label>
            <select
              id="filterKecamatan"
              value={selectedKecamatanId ?? ''}
              onChange={(e) => setSelectedKecamatanId(e.target.value ? Number(e.target.value) : null)}
              className="border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua</option>
              {kecamatanOptions.map((kec) => (
                <option key={kec.id} value={kec.id}>{kec.nama}</option>
              ))}
            </select>
          </div>
        </div>
        <DistrictTable
          districts={kecamatanData.map((item) => ({
            id: item.id,
            nama: item.nama,
            tipe: 'kecamatan',
            totalFacility: item.totalPrasarana,
            totalSportsGroups: item.totalSportsGroups,
            totalAthlete: item.totalAthletes,
            totalAchievement: item.totalAchievement,
            latitude: item.latitude ?? undefined,
            longitude: item.longitude ?? undefined,
          }))}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={(page) => setCurrentPage(page)}
          onViewDetail={handleViewDetail}
          selectedYear={selectedYear}
        />
      </section>

      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border">
            <div className="flex items-start justify-between p-4 border-b">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Detail Kecamatan: {selectedDetail?.kecamatan.nama}</h3>
                <p className="text-sm text-slate-600">Latitude: {selectedDetail?.kecamatan.latitude ?? '-'} | Longitude: {selectedDetail?.kecamatan.longitude ?? '-'}</p>
              </div>
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedDetail(null);
                }}
                className="text-slate-500 hover:text-slate-900 text-sm font-semibold"
              >
                Tutup
              </button>
            </div>
            <div className="p-4 space-y-4">
              {isDetailLoading ? (
                <div className="py-8 text-center text-slate-500">Memuat detail...</div>
              ) : (
                selectedDetail && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <p className="text-xs uppercase text-slate-500">Prasarana</p>
                        <p className="text-2xl font-bold text-orange-600">{selectedDetail.summary.totalInfrastructure}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <p className="text-xs uppercase text-slate-500">Sarana</p>
                        <p className="text-2xl font-bold text-blue-600">{selectedDetail.summary.totalSarana}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <p className="text-xs uppercase text-slate-500">Kelompok Olahraga</p>
                        <p className="text-2xl font-bold text-green-600">{selectedDetail.summary.totalSportsGroups}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <p className="text-xs uppercase text-slate-500">Total Prestasi Atlet</p>
                        <p className="text-2xl font-bold text-cyan-600">{selectedDetail.summary.totalAchievement}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-lg font-semibold mb-2">List Kelompok Olahraga</h4>
                      {selectedDetail.data.sportsGroups.length === 0 ? (
                        <p className="text-sm text-slate-500">Tidak ada data kelompok olahraga.</p>
                      ) : (
                        <>
                          <div className="overflow-x-auto border rounded-lg mb-2">
                            <table className="min-w-full text-left">
                              <thead className="bg-slate-100 text-slate-700 text-xs uppercase">
                                <tr>
                                  <th className="px-3 py-2">No</th>
                                  <th className="px-3 py-2">Nama Kelompok</th>
                                  <th className="px-3 py-2">Desa / Kelurahan</th>
                                  <th className="px-3 py-2">Tahun</th>
                                  <th className="px-3 py-2">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedDetail.data.sportsGroups
                                  .slice((kelompokPage - 1) * MODAL_ITEMS_PER_PAGE, kelompokPage * MODAL_ITEMS_PER_PAGE)
                                  .map((group, index) => (
                                    <tr key={group.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                      <td className="px-3 py-2 text-sm text-slate-700">{(kelompokPage - 1) * MODAL_ITEMS_PER_PAGE + index + 1}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{group.groupName ?? group.nama ?? '-'}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{group.desaKelurahan?.nama ?? '-'}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{group.year ?? '-'}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{group.isVerified ? 'Terverifikasi' : 'Belum'}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                          {Math.ceil(selectedDetail.data.sportsGroups.length / MODAL_ITEMS_PER_PAGE) > 1 && (
                            <div className="flex items-center justify-between mb-4 text-sm text-slate-600">
                              <span>Halaman {kelompokPage} dari {Math.ceil(selectedDetail.data.sportsGroups.length / MODAL_ITEMS_PER_PAGE)}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setKelompokPage(prev => Math.max(1, prev - 1))}
                                  disabled={kelompokPage === 1}
                                  className="px-2 py-1 border rounded disabled:opacity-50"
                                >
                                  ← Sebelumnya
                                </button>
                                <button
                                  onClick={() => setKelompokPage(prev => Math.min(Math.ceil(selectedDetail.data.sportsGroups.length / MODAL_ITEMS_PER_PAGE), prev + 1))}
                                  disabled={kelompokPage === Math.ceil(selectedDetail.data.sportsGroups.length / MODAL_ITEMS_PER_PAGE)}
                                  className="px-2 py-1 border rounded disabled:opacity-50"
                                >
                                  Berikutnya →
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <h4 className="text-lg font-semibold mb-2">List Prasarana</h4>
                      {selectedDetail.data.facilityRecords.length === 0 ? (
                        <p className="text-sm text-slate-500">Tidak ada data prasarana.</p>
                      ) : (
                        <>
                          <div className="overflow-x-auto border rounded-lg mb-2">
                            <table className="min-w-full text-left">
                              <thead className="bg-slate-100 text-slate-700 text-xs uppercase">
                                <tr>
                                  <th className="px-3 py-2">No</th>
                                  <th className="px-3 py-2">Prasarana</th>
                                  <th className="px-3 py-2">Desa / Kelurahan</th>
                                  <th className="px-3 py-2">Foto</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedDetail.data.facilityRecords
                                  .slice((prasaranaPge - 1) * MODAL_ITEMS_PER_PAGE, prasaranaPge * MODAL_ITEMS_PER_PAGE)
                                  .map((facility, index) => (
                                    <tr key={facility.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                      <td className="px-3 py-2 text-sm text-slate-700">{(prasaranaPge - 1) * MODAL_ITEMS_PER_PAGE + index + 1}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{facility.prasarana?.nama ?? '-'}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{facility.desaKelurahan?.nama ?? '-'}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">
                                        {facility.photos?.length > 0 ? (
                                          <div className="flex gap-2 overflow-x-auto">
                                            {facility.photos.slice(0, 3).map((photo: any) => (
                                              <img key={photo.id} src={photo.fileUrl} alt={photo.description ?? 'Foto prasarana'} className="w-20 h-14 object-cover rounded" />
                                            ))}
                                          </div>
                                        ) : (
                                          '-'
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                          {Math.ceil(selectedDetail.data.facilityRecords.length / MODAL_ITEMS_PER_PAGE) > 1 && (
                            <div className="flex items-center justify-between mb-4 text-sm text-slate-600">
                              <span>Halaman {prasaranaPge} dari {Math.ceil(selectedDetail.data.facilityRecords.length / MODAL_ITEMS_PER_PAGE)}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setPrasaranaPage(prev => Math.max(1, prev - 1))}
                                  disabled={prasaranaPge === 1}
                                  className="px-2 py-1 border rounded disabled:opacity-50"
                                >
                                  ← Sebelumnya
                                </button>
                                <button
                                  onClick={() => setPrasaranaPage(prev => Math.min(Math.ceil(selectedDetail.data.facilityRecords.length / MODAL_ITEMS_PER_PAGE), prev + 1))}
                                  disabled={prasaranaPge === Math.ceil(selectedDetail.data.facilityRecords.length / MODAL_ITEMS_PER_PAGE)}
                                  className="px-2 py-1 border rounded disabled:opacity-50"
                                >
                                  Berikutnya →
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <h4 className="text-lg font-semibold mb-2">List Sarana</h4>
                      {selectedDetail.data.equipments.length === 0 ? (
                        <p className="text-sm text-slate-500">Tidak ada data sarana.</p>
                      ) : (
                        <>
                          <div className="overflow-x-auto border rounded-lg mb-2">
                            <table className="min-w-full text-left">
                              <thead className="bg-slate-100 text-slate-700 text-xs uppercase">
                                <tr>
                                  <th className="px-3 py-2">No</th>
                                  <th className="px-3 py-2">Sarana</th>
                                  <th className="px-3 py-2">Desa / Kelurahan</th>
                                  <th className="px-3 py-2">Kuantitas</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedDetail.data.equipments
                                  .slice((saranaPage - 1) * MODAL_ITEMS_PER_PAGE, saranaPage * MODAL_ITEMS_PER_PAGE)
                                  .map((eq, index) => (
                                    <tr key={eq.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                      <td className="px-3 py-2 text-sm text-slate-700">{(saranaPage - 1) * MODAL_ITEMS_PER_PAGE + index + 1}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{eq.sarana?.nama ?? '-'}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{eq.desaKelurahan?.nama ?? '-'}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{eq.quantity ?? '0'}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                          {Math.ceil(selectedDetail.data.equipments.length / MODAL_ITEMS_PER_PAGE) > 1 && (
                            <div className="flex items-center justify-between mb-4 text-sm text-slate-600">
                              <span>Halaman {saranaPage} dari {Math.ceil(selectedDetail.data.equipments.length / MODAL_ITEMS_PER_PAGE)}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSaranaPage(prev => Math.max(1, prev - 1))}
                                  disabled={saranaPage === 1}
                                  className="px-2 py-1 border rounded disabled:opacity-50"
                                >
                                  ← Sebelumnya
                                </button>
                                <button
                                  onClick={() => setSaranaPage(prev => Math.min(Math.ceil(selectedDetail.data.equipments.length / MODAL_ITEMS_PER_PAGE), prev + 1))}
                                  disabled={saranaPage === Math.ceil(selectedDetail.data.equipments.length / MODAL_ITEMS_PER_PAGE)}
                                  className="px-2 py-1 border rounded disabled:opacity-50"
                                >
                                  Berikutnya →
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <h4 className="text-lg font-semibold mb-2">List Atlet</h4>
                      {selectedDetail.data.athletes.length === 0 ? (
                        <p className="text-sm text-slate-500">Tidak ada data atlet.</p>
                      ) : (
                        <>
                          <div className="overflow-x-auto border rounded-lg mb-2">
                            <table className="min-w-full text-left">
                              <thead className="bg-slate-100 text-slate-700 text-xs uppercase">
                                <tr>
                                  <th className="px-3 py-2">No</th>
                                  <th className="px-3 py-2">Foto</th>
                                  <th className="px-3 py-2">Nama</th>
                                  <th className="px-3 py-2">Kategori</th>
                                  <th className="px-3 py-2">Cabang Olahraga</th>
                                  <th className="px-3 py-2">Jumlah Prestasi Tahun {selectedYear}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedDetail.data.athletes
                                  .slice((atletePage - 1) * MODAL_ITEMS_PER_PAGE, atletePage * MODAL_ITEMS_PER_PAGE)
                                  .map((athlete: any, index) => (
                                    <tr key={athlete.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                      <td className="px-3 py-2 text-sm text-slate-700">{(atletePage - 1) * MODAL_ITEMS_PER_PAGE + index + 1}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">
                                        {athlete.photoUrl ? (
                                          <img src={athlete.photoUrl} alt={athlete.fullName} className="w-12 h-12 object-cover rounded-full" />
                                        ) : (
                                          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-500">No Photo</div>
                                        )}
                                      </td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{athlete.fullName ?? '-'}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{athlete.category ?? '-'}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{athlete.sport?.nama ?? '-'}</td>
                                      <td className="px-3 py-2 text-sm text-slate-700">{athlete.achievements?.length ?? 0}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                          {Math.ceil(selectedDetail.data.athletes.length / MODAL_ITEMS_PER_PAGE) > 1 && (
                            <div className="flex items-center justify-between mb-4 text-sm text-slate-600">
                              <span>Halaman {atletePage} dari {Math.ceil(selectedDetail.data.athletes.length / MODAL_ITEMS_PER_PAGE)}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setatletePage(prev => Math.max(1, prev - 1))}
                                  disabled={atletePage === 1}
                                  className="px-2 py-1 border rounded disabled:opacity-50"
                                >
                                  ← Sebelumnya
                                </button>
                                <button
                                  onClick={() => setatletePage(prev => Math.min(Math.ceil(selectedDetail.data.athletes.length / MODAL_ITEMS_PER_PAGE), prev + 1))}
                                  disabled={atletePage === Math.ceil(selectedDetail.data.athletes.length / MODAL_ITEMS_PER_PAGE)}
                                  className="px-2 py-1 border rounded disabled:opacity-50"
                                >
                                  Berikutnya →
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
