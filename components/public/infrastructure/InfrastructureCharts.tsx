'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface KecamatanData {
  nama: string;
  count: number;
}

interface ConditionData {
  condition: string;
  label: string;
  count: number;
}

interface EquipmentDistributionData {
  usable: number;
  notUsable: number;
  grant: number;
  nonGrant: number;
  totalRecords: number;
}

export default function InfrastructureCharts({ year, kecamatanId, condition }: { year?: string; kecamatanId?: string; condition?: string }) {
  const [kecamatanData, setKecamatanData] = useState<KecamatanData[]>([]);
  const [conditionData, setConditionData] = useState<ConditionData[]>([]);
  const [equipmentDistData, setEquipmentDistData] = useState<EquipmentDistributionData>({
    usable: 0,
    notUsable: 0,
    grant: 0,
    nonGrant: 0,
    totalRecords: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (kecamatanId) params.append('kecamatanId', kecamatanId);
        if (condition) params.append('condition', condition);

        const queryStr = params.toString() ? `?${params.toString()}` : '';
        const [kecamatanRes, conditionRes, equipmentRes] = await Promise.all([
          fetch(`/api/facility-records/distribution-by-kecamatan${queryStr}`),
          fetch(`/api/facility-records/distribution-by-condition${queryStr}`),
          fetch(`/api/equipment/distribution${queryStr}`)
        ]);

        if (!kecamatanRes.ok || !conditionRes.ok || !equipmentRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const kecamatanJson = await kecamatanRes.json();
        const conditionJson = await conditionRes.json();
        const equipmentJson = await equipmentRes.json();

        if (kecamatanJson.success) {
          setKecamatanData(kecamatanJson.data);
        }
        if (conditionJson.success) {
          setConditionData(conditionJson.data);
        }
        if (equipmentJson.success) {
          setEquipmentDistData(equipmentJson.data);
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Gagal memuat data chart');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, kecamatanId, condition]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 h-96 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-12">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  // Prepare data for kecamatan bar chart
  const kecamatanChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        fontWeight: 600,
      },
    },
    stroke: {
      show: false,
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      y: {
        formatter: function(value) {
          return value + ' fasilitas';
        }
      }
    },
    xaxis: {
      categories: kecamatanData.map((d) => d.nama),
      labels: {
        style: {
          fontSize: '11px',
        },
        hideOverlappingLabels: true,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    fill: {
      opacity: 1,
      colors: ['#3b82f6'],
    },
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: -10,
        left: -10
      }
    }
  };

  const kecamatanChartSeries = [
    {
      name: 'Total Fasilitas',
      data: kecamatanData.map(d => d.count),
    }
  ];

  // Prepare data for condition pie chart
  const conditionChartOptions: ApexOptions = {
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
      fontSize: '13px',
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
  };

  const conditionChartSeries = conditionData.map(d => d.count);

  const totalFacilities = conditionData.reduce((sum, d) => sum + d.count, 0);

  // Equipment Distribution Chart Options
  const equipmentUsabilityOptions: ApexOptions = {
    chart: { type: 'donut' },
    labels: ['Layak Pakai', 'Tidak Layak Pakai'],
    colors: ['#10b981', '#ef4444'],
    legend: { position: 'bottom', fontSize: '12px' },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: { show: true, fontSize: '14px', fontWeight: 600 },
            value: { show: true, fontSize: '18px', fontWeight: 700, formatter: (w: any) => `${w}` },
            total: {
              show: true,
              label: 'Total',
              formatter: (w: any) => w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString(),
            },
          },
        },
      },
    },
    dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(1)}%` },
    tooltip: {
      y: { formatter: (value: number) => `${value} item` },
    },
  };

  const equipmentSourceOptions: ApexOptions = {
    chart: { type: 'donut' },
    labels: ['Hibah Pemerintah', 'Non-Hibah'],
    colors: ['#3b82f6', '#f59e0b'],
    legend: { position: 'bottom', fontSize: '12px' },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: { show: true, fontSize: '14px', fontWeight: 600 },
            value: { show: true, fontSize: '18px', fontWeight: 700, formatter: (w: any) => `${w}` },
            total: {
              show: true,
              label: 'Total',
              formatter: (w: any) => w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString(),
            },
          },
        },
      },
    },
    dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(1)}%` },
    tooltip: {
      y: { formatter: (value: number) => `${value} item` },
    },
  };

  return (
    <div className="space-y-6 mb-12">
      {/* Facilities Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Facilities per Kecamatan */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Distribusi Fasilitas Per Kecamatan</h3>
          <div className="overflow-x-auto">
            <div style={{ minWidth: kecamatanData.length > 10 ? `${kecamatanData.length * 100}px` : '100%' }}>
              <Chart
                options={kecamatanChartOptions}
                series={kecamatanChartSeries}
                type="bar"
                height={350}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Total Fasilitas: <span className="font-semibold">{kecamatanData.reduce((sum, d) => sum + d.count, 0)}</span>
          </p>
        </div>

        {/* Donut Chart - Condition Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Distribusi Kondisi Fasilitas</h3>
          <div className="flex justify-center">
            <Chart
              options={conditionChartOptions}
              series={conditionChartSeries}
              type="donut"
              height={350}
            />
          </div>

          {/* Summary Table */}
          <div className="mt-6 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              {conditionData.map((item, idx) => {
                const percentage = totalFacilities > 0 ? ((item.count / totalFacilities) * 100).toFixed(1) : '0';
                const colors = ['bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-orange-100 text-orange-800', 'bg-red-100 text-red-800'];
                return (
                  <div key={idx} className={`p-3 rounded-lg ${colors[idx] || 'bg-gray-100'}`}>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-2xl font-bold mt-1">{item.count}</p>
                    <p className="text-xs opacity-75 mt-1">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Distribusi Perlengkapan</h3>
            <p className="text-sm text-gray-600">Proporsi kelayakan dan sumber perolehan perlengkapan.</p>
          </div>
          <div className="w-5 h-5 text-sky-500">
            
          </div>
        </div>

        {equipmentDistData.totalRecords > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">Kelayakan Perlengkapan</h4>
                    <p className="text-xs text-gray-500">Usable vs Tidak layak pakai</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">{equipmentDistData.totalRecords} item</span>
                </div>
                <Chart
                  type="donut"
                  width="100%"
                  height={260}
                  series={[equipmentDistData.usable, equipmentDistData.notUsable]}
                  options={equipmentUsabilityOptions}
                />
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">Sumber Perolehan</h4>
                    <p className="text-xs text-gray-500">Hibah pemerintah vs Non-Hibah</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">{equipmentDistData.totalRecords} item</span>
                </div>
                <Chart
                  type="donut"
                  width="100%"
                  height={260}
                  series={[equipmentDistData.grant, equipmentDistData.nonGrant]}
                  options={equipmentSourceOptions}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-80 text-gray-500">
            <p>Tidak ada data distribusi perlengkapan</p>
          </div>
        )}
      </div>
    </div>
  );
}
