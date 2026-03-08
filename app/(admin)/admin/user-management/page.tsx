'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, UserCheck, UserX, RefreshCw } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const userData = [
    {
      id: 1,
      username: 'admin_utara',
      nama: 'Budi Santoso',
      email: 'budi@kecamatan-utara.go.id',
      role: 'Admin Kecamatan',
      kecamatan: 'Kecamatan Utara',
      status: 'Aktif',
      lastLogin: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      username: 'verifikator_01',
      nama: 'Siti Aminah',
      email: 'siti@sidora.go.id',
      role: 'Verifikator',
      kecamatan: 'Semua Kecamatan',
      status: 'Aktif',
      lastLogin: '2024-01-14 14:20:00'
    },
    {
      id: 3,
      username: 'operator_selatan',
      nama: 'Ahmad Yusuf',
      email: 'ahmad@kecamatan-selatan.go.id',
      role: 'Operator',
      kecamatan: 'Kecamatan Selatan',
      status: 'Tidak Aktif',
      lastLogin: '2024-01-10 09:15:00'
    }
  ];

  const handleCreate = () => {
    setSelectedData(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (data: any) => {
    setSelectedData(data);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (data: any) => {
    setSelectedData(data);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      console.log('Delete user with id:', id);
    }
  };

  const handleActivate = (id: number) => {
    console.log('Activate user with id:', id);
  };

  const handleDeactivate = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menonaktifkan user ini?')) {
      console.log('Deactivate user with id:', id);
    }
  };

  const handleResetPassword = (id: number) => {
    if (confirm('Apakah Anda yakin ingin mereset password user ini?')) {
      console.log('Reset password for user with id:', id);
      alert('Password berhasil direset. Password baru telah dikirim ke email user.');
    }
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'role', label: 'Role', type: 'select', options: ['Superadmin', 'Admin Kabupaten/Kota', 'Admin Kecamatan', 'Verifikator', 'Operator'], required: true },
    { name: 'kecamatan', label: 'Kecamatan', type: 'select', options: ['Semua Kecamatan', 'Kecamatan Utara', 'Kecamatan Selatan', 'Kecamatan Timur', 'Kecamatan Barat'], required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Tidak Aktif'], required: true },
    { name: 'password', label: 'Password', type: 'password', required: modalMode === 'create' }
  ];

  return (
    <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manajemen User & Role</h1>
          <p className="text-gray-600">Kelola user dan hak akses sistem</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total User</p>
                <p className="text-2xl font-bold text-gray-900">25</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">User Aktif</p>
                <p className="text-2xl font-bold text-gray-900">20</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">User Tidak Aktif</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Admin Kecamatan</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userData.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'Superadmin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'Admin Kabupaten/Kota' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'Admin Kecamatan' ? 'bg-green-100 text-green-800' :
                        user.role === 'Verifikator' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.kecamatan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastLogin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(user)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-green-600 hover:text-green-800"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Reset Password"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        {user.status === 'Aktif' ? (
                          <button
                            onClick={() => handleDeactivate(user.id)}
                            className="text-orange-600 hover:text-orange-800"
                            title="Nonaktifkan"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(user.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Aktifkan"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id)}
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
          </div>
        </div>
      </div>
  );
};

export default UserManagement;
