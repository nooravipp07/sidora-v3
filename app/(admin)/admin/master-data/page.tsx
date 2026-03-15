'use client';

import React, { FC, useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Home, Hammer, Wrench, Trophy, ChevronLeft, ChevronRight, Search, Loader } from 'lucide-react';
import DataModal from '../../../../lib/admin/DataModal';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

interface ApiResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

const MasterData: FC = () => {
  const [activeTab, setActiveTab] = useState<'kecamatan' | 'desa-kelurahan' | 'sarana' | 'prasarana' | 'cabang-olahraga'>('kecamatan');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [kecamatanOptions, setKecamatanOptions] = useState<any[]>([]);

  const tabConfig = {
    'kecamatan': {
      label: 'Kecamatan',
      icon: MapPin,
      apiEndpoint: '/api/masterdata/kecamatan',
      searchFields: ['nama'],
      fields: [
        { name: 'nama', label: 'Nama Kecamatan', type: 'text' as const, required: true },
        { name: 'latitude', label: 'Latitude', type: 'text' as const, required: false },
        { name: 'longitude', label: 'Longitude', type: 'text' as const, required: false },
      ],
      tableColumns: ['nama', 'latitude', 'longitude'],
    },
    'desa-kelurahan': {
      label: 'Desa/Kelurahan',
      icon: Home,
      apiEndpoint: '/api/masterdata/desa-kelurahan',
      searchFields: ['nama', 'tipe'],
      fields: [
        { name: 'kecamatanId', label: 'Kecamatan', type: 'select' as const, required: true, options: [] },
        { name: 'nama', label: 'Nama Desa/Kelurahan', type: 'text' as const, required: true },
        { name: 'tipe', label: 'Tipe', type: 'select' as const, required: true, options: ['desa', 'kelurahan'] },
      ],
      tableColumns: ['kecamatan.nama', 'nama', 'tipe'],
    },
    'sarana': {
      label: 'Sarana',
      icon: Hammer,
      apiEndpoint: '/api/masterdata/sarana',
      searchFields: ['nama', 'jenis'],
      fields: [
        { name: 'nama', label: 'Nama Sarana', type: 'text' as const, required: true },
        { name: 'jenis', label: 'Jenis', type: 'text' as const, required: false },
      ],
      tableColumns: ['nama', 'jenis'],
    },
    'prasarana': {
      label: 'Prasarana',
      icon: Wrench,
      apiEndpoint: '/api/masterdata/prasarana',
      searchFields: ['nama', 'jenis'],
      fields: [
        { name: 'nama', label: 'Nama Prasarana', type: 'text' as const, required: true },
        { name: 'jenis', label: 'Jenis', type: 'text' as const, required: false },
      ],
      tableColumns: ['nama', 'jenis'],
    },
    'cabang-olahraga': {
      label: 'Cabang Olahraga',
      icon: Trophy,
      apiEndpoint: '/api/masterdata/cabang-olahraga',
      searchFields: ['nama'],
      fields: [
        { name: 'nama', label: 'Nama Cabang Olahraga', type: 'text' as const, required: true },
      ],
      tableColumns: ['nama'],
    },
  };

  // Fetch data
  const fetchData = async (page: number = 1, filterParams: Record<string, any> = {}) => {
    try {
      setLoading(true);
      const config = tabConfig[activeTab];
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...filterParams,
      });

      const response = await fetch(`${config.apiEndpoint}?${queryParams}`);
      
      if (!response.ok) {
        console.error('Failed to fetch data');
        return;
      }

      const result: ApiResponse<any> = await response.json();
      setData(result.data);
      setPagination(result.meta);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when tab changes
  useEffect(() => {
    setFilters({});
    setPagination(p => ({ ...p, page: 1 }));
    fetchData(1, {});

    // Fetch kecamatan options for desa-kelurahan
    if (activeTab === 'desa-kelurahan') {
      fetchKecamatanOptions();
    }
  }, [activeTab]);

  // Fetch kecamatan for LOV
  const fetchKecamatanOptions = async () => {
    try {
      const response = await fetch('/api/masterdata/kecamatan?limit=999');
      if (response.ok) {
        const result = await response.json();
        setKecamatanOptions(result.data);
      }
    } catch (error) {
      console.error('Error fetching kecamatan options:', error);
    }
  };

  // Handle search/filter
  const handleSearch = (searchValue: string) => {
    const config = tabConfig[activeTab];
    const filterParams: Record<string, any> = {};
    
    if (searchValue) {
      config.searchFields.forEach(field => {
        filterParams[field] = searchValue;
      });
    }

    setFilters(filterParams);
    fetchData(1, filterParams);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (pagination.hasMore) {
      const nextPage = pagination.page + 1;
      setPagination(p => ({ ...p, page: nextPage }));
      fetchData(nextPage, filters);
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      const prevPage = pagination.page - 1;
      setPagination(p => ({ ...p, page: prevPage }));
      fetchData(prevPage, filters);
    }
  };

  // Handle CRUD
  const handleCreate = () => {
    setSelectedData(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedData(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    try {
      const config = tabConfig[activeTab];
      const response = await fetch(`${config.apiEndpoint}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData(pagination.page, filters);
      } else {
        alert('Gagal menghapus data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Terjadi kesalahan saat menghapus data');
    }
  };

  const handleSaveData = async (formData: any) => {
    try {
      const config = tabConfig[activeTab];
      
      // Convert string values to number for specific fields
      const processedData = { ...formData };
      if (processedData.kecamatanId) {
        processedData.kecamatanId = parseInt(processedData.kecamatanId, 10);
      }

      const url = modalMode === 'create' 
        ? config.apiEndpoint 
        : `${config.apiEndpoint}/${selectedData.id}`;
      
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });

      if (response.ok) {
        fetchData(pagination.page, filters);
        setIsModalOpen(false);
      } else {
        alert('Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const currentConfig = tabConfig[activeTab];
  const getTruncatedValue = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).join(' - ');
    }
    return value?.toString().substring(0, 50) || '-';
  };

  // Get fields with dynamic options
  const getFieldsForCurrentTab = () => {
    const fields = [...currentConfig.fields];
    
    // Update kecamatanId options if in desa-kelurahan tab
    if (activeTab === 'desa-kelurahan') {
      const kecamatanField = fields.find(f => f.name === 'kecamatanId');
      if (kecamatanField) {
        kecamatanField.options = kecamatanOptions.map(k => ({
          label: k.nama,
          value: k.id
        }));
      }
    }
    
    return fields;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Master Data</h1>
        <p className="text-gray-600">Kelola data master sistem</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
          {Object.entries(tabConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeTab === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Cari ${currentConfig.label.toLowerCase()}...`}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah {currentConfig.label}
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          ) : data.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              Tidak ada data untuk ditampilkan
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  {currentConfig.tableColumns.map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col.split('.')[0].charAt(0).toUpperCase() + col.split('.')[0].slice(1)}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    {currentConfig.tableColumns.map((col) => (
                      <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getTruncatedValue(col.includes('.') ? item[col.split('.')[0]]?.[col.split('.')[1]] : item[col])}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-green-600 hover:text-green-800"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {data.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Halaman {pagination.page} dari {pagination.totalPages} | Total: {pagination.total} data
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={pagination.page === 1}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={!pagination.hasMore}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Data Modal */}
      {isModalOpen && (
        <DataModal
          title={`${modalMode === 'create' ? 'Tambah' : 'Edit'} ${currentConfig.label}`}
          fields={getFieldsForCurrentTab()}
          data={selectedData}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveData}
        />
      )}
    </div>
  );
};

export default MasterData;
