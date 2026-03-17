'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, FileText, Image, Calendar } from 'lucide-react';
import { News } from '@/types/news';
import { Gallery } from '@/types/gallery';
import { Agenda } from '@/types/agenda';

const Kegiatan: React.FC = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'berita' | 'galeri' | 'agenda'>('berita');
  const [beritaData, setBeritaData] = useState<News[]>([]);
  const [galleryData, setGalleryData] = useState<Gallery[]>([]);
  const [agendaData, setAgendaData] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount and tab change
  useEffect(() => {
    if (activeTab === 'berita') {
      fetchBerita();
    } else if (activeTab === 'galeri') {
      fetchGallery();
    } else if (activeTab === 'agenda') {
      fetchAgenda();
    }
  }, [activeTab]);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/berita?page=1&limit=100');
      if (!response.ok) throw new Error('Failed to fetch berita');
      const data = await response.json();
      setBeritaData(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch berita');
      console.error('Error fetching berita:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/gallery?page=1&limit=100');
      if (!response.ok) throw new Error('Failed to fetch gallery');
      const data = await response.json();
      setGalleryData(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gallery');
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgenda = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/agenda?page=1&limit=100');
      if (!response.ok) throw new Error('Failed to fetch agenda');
      const data = await response.json();
      setAgendaData(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agenda');
      console.error('Error fetching agenda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBerita = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        setDeleting(true);
        const response = await fetch(`/api/berita/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete berita');
        setBeritaData(beritaData.filter(item => item.id !== id));
        alert('Berita berhasil dihapus');
      } catch (err) {
        console.error('Error deleting berita:', err);
        alert('Gagal menghapus berita');
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus galeri ini beserta semua gambarnya?')) {
      try {
        setDeleting(true);
        const response = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete gallery');
        setGalleryData(galleryData.filter(item => item.id !== id));
        alert('Galeri berhasil dihapus');
      } catch (err) {
        console.error('Error deleting gallery:', err);
        alert('Gagal menghapus galeri');
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleDeleteAgenda = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
      try {
        setDeleting(true);
        const response = await fetch(`/api/agenda/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete agenda');
        setAgendaData(agendaData.filter(item => item.id !== id));
        alert('Agenda berhasil dihapus');
      } catch (err) {
        console.error('Error deleting agenda:', err);
        alert('Gagal menghapus agenda');
      } finally {
        setDeleting(false);
      }
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('id-ID');
  };

  return (
    <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kelola Kegiatan</h1>
          <p className="text-gray-600">Manajemen berita, galeri, dan agenda kegiatan</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('berita')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'berita'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Berita
            </button>
            <button
              onClick={() => setActiveTab('galeri')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'galeri'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Image className="w-4 h-4 mr-2" />
              Galeri
            </button>
            <button
              onClick={() => setActiveTab('agenda')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'agenda'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Agenda
            </button>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => router.push('/admin/kegiatan/berita/create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            disabled={loading || activeTab !== 'berita'}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Berita Baru
          </button>
          <button
            onClick={() => router.push('/admin/kegiatan/galeri/create')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
            disabled={loading || activeTab !== 'galeri'}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Galeri Baru
          </button>
          <button
            onClick={() => router.push('/admin/kegiatan/agenda/create')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
            disabled={loading || activeTab !== 'agenda'}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Agenda Baru
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && activeTab === 'berita' && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Table */}
        {!loading && activeTab === 'berita' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {beritaData.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Tidak ada data berita. Klik "Buat Berita Baru" untuk membuat berita.
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {beritaData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <div className="max-w-xs truncate">{item.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.isPublished ? 'Dipublikasikan' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(item.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => router.push(`/admin/kegiatan/berita/${item.id}/edit`)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBerita(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Hapus"
                              disabled={deleting}
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
          </div>
        )}

        {/* Loading State - Galeri */}
        {loading && activeTab === 'galeri' && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Gallery Table */}
        {!loading && activeTab === 'galeri' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {galleryData.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Tidak ada data galeri. Klik "Buat Galeri Baru" untuk membuat galeri.
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {galleryData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <div className="max-w-xs truncate">{item.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.items?.length || 0} gambar</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(item.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => router.push(`/admin/kegiatan/galeri/${item.id}/edit`)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteGallery(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Hapus"
                              disabled={deleting}
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
          </div>
        )}

        {/* Loading State - Agenda */}
        {loading && activeTab === 'agenda' && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Agenda Table */}
        {!loading && activeTab === 'agenda' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {agendaData.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Tidak ada data agenda. Klik "Buat Agenda Baru" untuk membuat agenda.
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Mulai</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agendaData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <div className="max-w-xs truncate">{item.title}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate">{item.location || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.startDate).toLocaleDateString('id-ID', { 
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => router.push(`/admin/kegiatan/agenda/${item.id}/edit`)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAgenda(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Hapus"
                              disabled={deleting}
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
          </div>
        )}
      </div>
  );
};

export default Kegiatan;

