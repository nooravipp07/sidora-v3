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
  Loader
} from 'lucide-react';
import DashboardMap from '@/components/admin/dashboard/DashboardMap';
import DistrictTable from '@/components/admin/dashboard/DistrictTable';

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

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<KecamatanDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

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

  // Handler export
  const handleExport = () => {
    // Export data summary per kecamatan ke CSV
    const headers = [
      'ID', 'Nama', 'Total Prasarana', 'Total Sarana', 'Total Kelompok Olahraga', 'Total Atlet', 'Total Prestasi', 'Latitude', 'Longitude'
    ];
    const rows = kecamatanData.map(item => [
      item.id,
      item.nama,
      item.totalPrasarana,
      item.totalEquipment,
      item.totalSportsGroups,
      item.totalAthletes,
      item.totalAchievement,
      item.latitude ?? '',
      item.longitude ?? ''
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kecamatan-summary-${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          <p className="text-gray-600">Ringkasan data real per kecamatan</p>
          <div className="flex flex-row gap-2 items-center">
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

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <article className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-3">Supply vs Demand</h2>
          <div className="grid grid-cols-2 gap-6 items-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-2 relative">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray={`${(200.53 * supplyPercent) / 100} 200.53`}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold fill-slate-700">
                    {supplyPercent}%
                  </text>
                </svg>
              </div>
              <p className="text-sm font-semibold">Sarana ({supply})</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-2 relative">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="12"
                    strokeDasharray={`${(200.53 * demandPercent) / 100} 200.53`}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold fill-slate-700">
                    {demandPercent}%
                  </text>
                </svg>
              </div>
              <p className="text-sm font-semibold">Atlet ({demand})</p>
            </div>
          </div>
        </article>

        <article className="lg:col-span-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
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
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <article className="xl:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4">Sarana Summary</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Total Records</span>
                <span className="font-bold text-blue-600">{dashboardSummary?.totalEquipment ?? 0}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Total Quantity</span>
                <span className="font-bold text-cyan-600">{dashboardSummary?.totalEquipmentQuantity ?? 0}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </article>

        <article className="xl:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4">Prasarana - Distribusi</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Total Prasarana</span>
                <span className="font-bold">{dashboardSummary?.totalPrasarana ?? 0}</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-3 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">ATLET & KELOMPOK OLAHRAGA</h2>
            <Award className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold mb-3 text-slate-700">Atlet (Total: {dashboardSummary?.totalAthletes ?? 0})</div>
              <div className="h-48 flex items-center justify-center">
                {athleteDist.series.length > 0 ? (
                  <ReactApexChart
                    type="pie"
                    width={220}
                    height={200}
                    series={athleteDist.series}
                    options={{
                      labels: athleteDist.labels,
                      legend: { position: 'bottom' },
                      title: { text: 'Distribusi Atlet per Cabang Olahraga', align: 'center', style: { fontSize: '14px' } },
                      dataLabels: { enabled: true },
                      tooltip: { y: { formatter: (val: number) => `${val} atlet` } },
                    }}
                  />
                ) : (
                  <span className="text-slate-400">Memuat chart...</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-3 text-slate-700">Kelompok (Total: {dashboardSummary?.totalSportsGroups ?? 0})</div>
              <div className="h-48 flex items-center justify-center">
                {groupDist.series.length > 0 ? (
                  <ReactApexChart
                    type="pie"
                    width={220}
                    height={200}
                    series={groupDist.series}
                    options={{
                      labels: groupDist.labels,
                      legend: { position: 'bottom' },
                      title: { text: 'Distribusi Kelompok per Cabang Olahraga', align: 'center', style: { fontSize: '14px' } },
                      dataLabels: { enabled: true },
                      tooltip: { y: { formatter: (val: number) => `${val} kelompok` } },
                    }}
                  />
                ) : (
                  <span className="text-slate-400">Memuat chart...</span>
                )}
              </div>
            </div>
          </div>
        </article>

        <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">PRESTASI ATLET (Tren)</h2>
            <LineChart className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="h-56 relative">
            {kecamatanData.length > 0 ? (
              <svg viewBox="0 0 330 170" className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="3"
                  points={kecamatanData
                    .map((item, index) => {
                      const x = 20 + (index / Math.max(kecamatanData.length - 1, 1)) * 290;
                      const value = item.totalAchievement;
                      const maxAchievement = Math.max(...kecamatanData.map((i) => i.totalAchievement), 1);
                      const y = 150 - (value / maxAchievement) * 130;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
                {kecamatanData.map((item, index) => {
                  const x = 20 + (index / Math.max(kecamatanData.length - 1, 1)) * 290;
                  const maxAchievement = Math.max(...kecamatanData.map((i) => i.totalAchievement), 1);
                  const y = 150 - (item.totalAchievement / maxAchievement) * 130;
                  return <circle key={item.id} cx={x} cy={y} r="4" fill="#0ea5e9" />;
                })}
              </svg>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">Tidak ada data</div>
            )}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-1 text-xs text-slate-500 flex justify-between">
              {kecamatanData.map((item) => (
                <span key={item.id}>{item.nama.substring(0, 8)}</span>
              ))}
            </div>
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
