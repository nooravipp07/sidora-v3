'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader } from 'lucide-react';

interface UserFormProps {
  initialData?: any;
  isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [selectedRole, setSelectedRole] = useState<number | null>(initialData?.roleId || null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    namaLengkap: initialData?.namaLengkap || '',
    email: initialData?.email || '',
    noTelepon: initialData?.noTelepon || '',
    password: '',
    roleId: initialData?.roleId || '',
    status: initialData?.status ?? 1,
    jenisAkun: initialData?.jenisAkun || '',
    kecamatanId: initialData?.kecamatanId || '',
  });

  // Fetch kecamatan options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const response = await fetch('/api/masterdata/kecamatan?page=1&limit=1000');
        if (response.ok) {
          const data = await response.json();
          setKecamatanList(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching kecamatan:', err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleRoleChange = (value: string) => {
    const roleId = parseInt(value);
    setSelectedRole(roleId);
    setFormData({
      ...formData,
      roleId: value,
      jenisAkun: '',
      kecamatanId: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Username harus diisi');
      return;
    }

    if (!formData.namaLengkap.trim()) {
      setError('Nama Lengkap harus diisi');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email harus diisi');
      return;
    }

    if (!formData.roleId) {
      setError('Role harus dipilih');
      return;
    }

    if (!isEdit && !formData.password.trim()) {
      setError('Password harus diisi');
      return;
    }
    
    if (selectedRole === 3 && !formData.kecamatanId) {
      setError('Kecamatan harus dipilih');
      return;
    }

    setLoading(true);

    try {
      const url = isEdit ? `/api/users/${initialData?.id}` : '/api/users';
      const method = isEdit ? 'PUT' : 'POST';

      const payload: any = {
        name: formData.name.trim(),
        namaLengkap: formData.namaLengkap.trim(),
        email: formData.email.trim(),
        noTelepon: formData.noTelepon.trim() || null,
        roleId: parseInt(formData.roleId as string),
        status: formData.status,
      };

      // Add password only for create or if provided for edit
      if (!isEdit || formData.password.trim()) {
        payload.password = formData.password;
      }

      // Add conditional fields based on role
      if (selectedRole === 2) {
        payload.jenisAkun = parseInt(formData.jenisAkun as string);
      } else if (selectedRole === 3) {
        payload.kecamatanId = parseInt(formData.kecamatanId as string);
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan data');
      }

      router.push('/admin/user-management');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const roles = [
    { label: 'Superadmin', value: 1 },
    { label: 'Operator / Verifikator', value: 2 },
    { label: 'Kecamatan', value: 3 },
    { label: 'KONI', value: 4 },
    { label: 'NPCI', value: 5 }
  ];

  const lembagaOptions = [
    { label: 'KONI', value: 1 },
    { label: 'NPCI', value: 2 }
  ];

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit User' : 'Tambah User Baru'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {isEdit ? 'Ubah data user dan hak akses' : 'Tambah user dan atur hak akses'}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah User'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Username & Nama Lengkap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
              placeholder="Masukkan username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.namaLengkap}
              onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
              disabled={loading}
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            />
          </div>
        </div>

        {/* Email & No. Telepon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              placeholder="Masukkan email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No. Telepon
            </label>
            <input
              type="text"
              value={formData.noTelepon}
              onChange={(e) => setFormData({ ...formData, noTelepon: e.target.value })}
              disabled={loading}
              placeholder="Masukkan nomor telepon"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password {!isEdit && <span className="text-red-500">*</span>}
            {isEdit && <span className="text-gray-500 text-xs">(Kosongkan jika tidak ingin mengubah)</span>}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={loading}
            placeholder={isEdit ? 'Password baru (opsional)' : 'Masukkan password'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            required={!isEdit}
          />
        </div>

        {/* Role & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.roleId}
              onChange={(e) => handleRoleChange(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            >
              <option value="">-- Pilih Role --</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value={1}>Aktif</option>
              <option value={0}>Tidak Aktif</option>
            </select>
          </div>
        </div>
        {selectedRole === 3 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kecamatan <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.kecamatanId}
              onChange={(e) => setFormData({ ...formData, kecamatanId: e.target.value })}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            >
              <option value="">-- Pilih Kecamatan --</option>
              {kecamatanList.map((kecamatan) => (
                <option key={kecamatan.id} value={kecamatan.id}>
                  {kecamatan.nama}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </form>
  );
};

export default UserForm;
