'use client';

import React, { useEffect, useState } from 'react';
import { Building2, TrendingUp } from 'lucide-react';

interface KecamatanSummaryData {
  id: number;
  nama: string;
  totalFasility: number;
  baik: number;
  rusaBerat: number;
}

interface KecamatanSummaryTableProps {
  year?: string;
  kecamatanId?: string;
  condition?: string;
  page: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export default function KecamatanSummaryTable({
  year,
  kecamatanId,
  condition,
  page,
  onPageChange,
  itemsPerPage = 10
}: KecamatanSummaryTableProps) {
  const [data, setData] = useState<KecamatanSummaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (kecamatanId) params.append('kecamatanId', kecamatanId);
        if (condition) params.append('condition', condition);

        const response = await fetch(`/api/facility-records/kecamatan-summary?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.error('Error fetching kecamatan summary:', err);
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, kecamatanId, condition]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="text-center py-12">
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">Tidak ada data yang ditemukan</p>
        <p className="text-gray-400 text-sm mt-2">Coba ubah filter Anda untuk melihat hasil yang berbeda</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kecamatan</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Total Fasilitas</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                <span className="inline-flex items-center gap-1 justify-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Baik
                </span>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                <span className="inline-flex items-center gap-1 justify-center">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  Rusak Berat
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr
                key={item.id}
                className={`border-b border-gray-200 hover:bg-green-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 font-semibold text-gray-900">{item.nama}</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-2 justify-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    {item.totalFasility}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {item.baik}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    {item.rusaBerat}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {paginatedData.map((item) => (
          <div key={item.id} className="p-4 hover:bg-green-50 transition-colors">
            <h3 className="font-bold text-lg text-gray-900 mb-4">{item.nama}</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Total</p>
                <p className="text-lg font-bold text-blue-700">{item.totalFasility}</p>
              </div>
              <div className="text-center bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Baik</p>
                <p className="text-lg font-bold text-green-700">{item.baik}</p>
              </div>
              <div className="text-center bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Rusak Berat</p>
                <p className="text-lg font-bold text-red-700">{item.rusaBerat}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, data.length)} dari {data.length} kecamatan
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => Math.abs(p - page) <= 1 || p === 1 || p === totalPages)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-gray-400">...</span>}
                    <button
                      onClick={() => onPageChange(p)}
                      className={`w-8 h-8 rounded text-sm font-semibold transition-colors ${
                        page === p
                          ? 'bg-green-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
            </div>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
