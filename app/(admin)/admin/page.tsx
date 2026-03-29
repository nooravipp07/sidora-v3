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

  const [kecamatanData, setKecamatanData] = useState<KecamatanSummary[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('/api/dashboard/kecamatan-summary');

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
    fetchDashboardData();
  }, []);

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
            {/* Filter Tahun */}
            <select
              className="border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {/* Tombol Export */}
            <button
              className="ml-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1"
              onClick={handleExport}
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
              Export
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
          currentPage={1}
          onPageChange={() => {}}
        />
      </section>
    </main>
  );
};

export default Dashboard;
