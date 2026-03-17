'use client';

import React, { FC, useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, UserCheck, UserX, RefreshCw, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
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

const UserManagement: FC = () => {
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
    const [roles, setRoles] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({
        total: 0,
        active: 0,
        inactive: 0
    });
    const [kecamatanOptions, setKecamatanOptions] = useState<any[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

    const fields = [
        { name: 'name', label: 'Username', type: 'text' as const, required: true },
        { name: 'namaLengkap', label: 'Nama Lengkap', type: 'text' as const, required: true },
        { name: 'email', label: 'Email', type: 'text' as const, required: true },
        { name: 'noTelepon', label: 'No. Telepon', type: 'text' as const, required: false },
        { name: 'roleId', label: 'Role', type: 'select' as const, required: true, options: [] as any[] },
        { name: 'status', label: 'Status', type: 'select' as const, required: true, options: [
            { label: 'Aktif', value: 1 },
            { label: 'Tidak Aktif', value: 0 }
        ] },
        { name: 'password', label: 'Password', type: 'text' as const, required: modalMode === 'create' }
    ];

    // Fetch data
    const fetchData = async (page: number = 1, filterParams: Record<string, any> = {}) => {
        try {
        setLoading(true);
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: pagination.limit.toString(),
            ...filterParams,
        });

        const response = await fetch(`/api/users?${queryParams}`);
        
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

    // Fetch roles and stats on component mount
    useEffect(() => {
        fetchRoles();
        fetchStats();
        fetchData(1, {});
    }, []);

    const fetchRoles = async () => {
        try {
        const response = await fetch('/api/users');
        if (response.ok) {
            // In a real scenario, create a separate endpoint for roles
            // For now, use hardcoded roles
            setRoles([
            { label: 'Superadmin', value: 1 },
            { label: 'Admin Lembaga', value: 2 },
            { label: 'Admin Kecamatan', value: 3 },
            { label: 'Verifikator', value: 4 },
            { label: 'Operator', value: 5 }
            ]);
        }
        } catch (error) {
        console.error('Error fetching roles:', error);
        }
    };

    const fetchStats = async () => {
        try {
        const response = await fetch('/api/users');
        if (response.ok) {
            const result: any = await response.json();
            setStats({
            total: result.meta.total,
            active: result.data.filter((u: any) => u.status === 1).length,
            inactive: result.data.filter((u: any) => u.status === 0).length
            });
        }
        } catch (error) {
        console.error('Error fetching stats:', error);
        }
    };

    // Handle search/filter
    const handleSearch = (searchValue: string) => {
        const filterParams: Record<string, any> = {};
        
        if (searchValue) {
        filterParams.nama = searchValue;
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
        setSelectedRoleId(null);
        setIsModalOpen(true);
        fetchKecamatanOptions();
    };

    const handleEdit = (item: any) => {
        setSelectedData(item);
        setModalMode('edit');
        setSelectedRoleId(item.roleId);
        setIsModalOpen(true);
        fetchKecamatanOptions();
    };

    const handleView = (item: any) => {
        setSelectedData(item);
        setModalMode('view');
        setSelectedRoleId(item.roleId);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

        try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchData(pagination.page, filters);
            fetchStats();
        } else {
            alert('Gagal menghapus user');
        }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Terjadi kesalahan saat menghapus user');
        }
    };

    const handleActivate = async (id: number) => {
        try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'updateStatus', status: 1 }),
        });

        if (response.ok) {
            fetchData(pagination.page, filters);
            fetchStats();
        } else {
            alert('Gagal mengaktifkan user');
        }
        } catch (error) {
            console.error('Error activating user:', error);
            alert('Terjadi kesalahan');
        }
    };

    const handleDeactivate = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menonaktifkan user ini?')) return;

        try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'updateStatus', status: 0 }),
        });

        if (response.ok) {
            fetchData(pagination.page, filters);
            fetchStats();
        } else {
            alert('Gagal menonaktifkan user');
        }
        } catch (error) {
            console.error('Error deactivating user:', error);
            alert('Terjadi kesalahan');
        }
    };

    const handleResetPassword = async (id: number) => {
        const newPassword = prompt('Masukkan password baru:');
        if (!newPassword) return;

        try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'resetPassword', password: newPassword }),
        });

        if (response.ok) {
            alert('Password berhasil direset');
        } else {
            alert('Gagal mereset password');
        }
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Terjadi kesalahan');
        }
    };

    const handleSaveData = async (formData: any) => {
        try {
        const url = modalMode === 'create' 
            ? '/api/users'
            : `/api/users/${selectedData.id}`;
        
        const method = modalMode === 'create' ? 'POST' : 'PUT';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            fetchData(pagination.page, filters);
            fetchStats();
            setIsModalOpen(false);
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Gagal menyimpan data');
        }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Terjadi kesalahan saat menyimpan data');
        }
    };

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

    // Get fields with role options and conditional fields
    const getFieldsForModal = () => {
        const baseFields = fields.map(field => {
        if (field.name === 'roleId') {
            return {
            ...field,
            options: [
                { label: 'Superadmin', value: 1 },
                { label: 'Admin Lembaga (KONI, NPCI, KORMI)', value: 2 },
                { label: 'Admin Kecamatan', value: 3 },
                { label: 'Verifikator', value: 4 },
                { label: 'Operator', value: 5 }
            ]
            };
        }
        return field;
        });

        // Determine which role is currently selected
        const roleId = selectedRoleId !== null ? selectedRoleId : selectedData?.roleId;

        // Add conditional fields based on role
        if (roleId === 2) {
        // Admin Lembaga - show Lembaga field
        const lembagaField = {
            name: 'jenisAkun',
            label: 'Lembaga',
            type: 'select' as const,
            required: true,
            options: [
                { label: 'KONI', value: 1 },
                { label: 'KORMI', value: 2 },
                { label: 'NPCI', value: 3 }
            ]
        };
        
        // Find the position to insert (after roleId)
        const roleIdIndex = baseFields.findIndex(f => f.name === 'roleId');
        baseFields.splice(roleIdIndex + 1, 0, lembagaField);
        } else if (roleId === 3) {
        // Admin Kecamatan - show Kecamatan field
        const kecamatanField = {
            name: 'kecamatanId',
            label: 'Kecamatan',
            type: 'select' as const,
            required: true,
            options: kecamatanOptions.map((k: any) => ({
            label: k.nama,
            value: k.id
            }))
        };
        
        // Find the position to insert (after roleId)
        const roleIdIndex = baseFields.findIndex(f => f.name === 'roleId');
        baseFields.splice(roleIdIndex + 1, 0, kecamatanField);
        }

        return baseFields;
    };

    return (
        <div className="p-6 bg-white min-h-screen">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Kelola user dan hak akses sistem</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                <p className="text-sm text-gray-600">Total User</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                </div>
            </div>
            </div>
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
            {/* <input
            type="text"
            placeholder="Cari nama atau email..."
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading && (
            <div className="flex justify-center items-center p-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
            )}

            {!loading && (
            <>
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {data.length > 0 ? (
                        data.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(pagination.page - 1) * pagination.limit + index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.namaLengkap}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                user.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {user.status === 1 ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString('id-ID') : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleView(user)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    title="Lihat Detail"
                                >
                                <Eye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="text-green-600 hover:text-green-800 transition-colors"
                                    title="Edit"
                                >
                                <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleResetPassword(user.id)}
                                    className="text-yellow-600 hover:text-yellow-800 transition-colors"
                                    title="Reset Password"
                                >
                                <RefreshCw className="w-4 h-4" />
                                </button>
                                {user.status === 1 ? (
                                <button
                                    onClick={() => handleDeactivate(user.id)}
                                    className="text-orange-600 hover:text-orange-800 transition-colors"
                                    title="Nonaktifkan"
                                >
                                    <UserX className="w-4 h-4" />
                                </button>
                                ) : (
                                <button
                                    onClick={() => handleActivate(user.id)}
                                    className="text-green-600 hover:text-green-800 transition-colors"
                                    title="Aktifkan"
                                >
                                    <UserCheck className="w-4 h-4" />
                                </button>
                                )}
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                    title="Hapus"
                                >
                                <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                            Tidak ada data user
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
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
            </>
            )}
        </div>

        {/* Modal */}
        {isModalOpen && (
            <DataModal
            title={
                modalMode === 'create' 
                ? 'Tambah User Baru'
                : modalMode === 'edit'
                ? 'Edit User'
                : 'Detail User'
            }
            fields={getFieldsForModal()}
            data={selectedData}
            mode={modalMode}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveData}
            onFieldChange={(fieldName, value) => {
                if (fieldName === 'roleId') {
                    setSelectedRoleId(parseInt(value, 10));
                }
            }}
            />
        )}
        </div>
    );
};

export default UserManagement;
