# Prasarana Module - Complete Structure & Pattern Analysis

## Overview

The Prasarana (Infrastructure/Facility Records) module is a complete CRUD system for managing sports facility records in specific villages/sub-districts. It demonstrates the standard enterprise pattern used throughout the Sidora v3 admin application.

---

## 1. MODULE STRUCTURE

```
/app/(admin)/admin/prasarana/
├── page.tsx                 # List view with filters, pagination, and action buttons
├── create/
│   └── page.tsx            # Create new facility record page
└── [id]/
    └── edit/
        └── page.tsx        # Edit existing facility record page

/components/admin/form/
└── FacilityRecordForm.tsx   # Shared form component for create & edit modes
```

---

## 2. PAGE.TSX - LIST VIEW STRUCTURE

**Location**: `app/(admin)/admin/prasarana/page.tsx`

### Component Structure

```typescript
'use client';  // Client component (required for interactivity)

// Imports
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // For navigation with router.push()
import { Plus, Edit, Trash2, Eye, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { FacilityRecord } from '@/types/masterdata';

// Component: Prasarana
const Prasarana: React.FC = () => {
  const router = useRouter();
  
  // ========== STATE MANAGEMENT ==========
  
  // Data Management
  const [facilityRecords, setFacilityRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  
  // Modal & UI State
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    kecamatanId: '',              // District/Kecamatan
    desaKelurahanId: '',          // Village/Sub-district
    year: '',                      // Year
  });
  
  // Filter Dropdown Data
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaKelurahanList, setDesaKelurahanList] = useState<any[]>([]);
  const [yearList, setYearList] = useState<number[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });
};

// Pagination Interface
interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}
```

### UseEffect Hooks

```typescript
// 1. Initial load & filter dependency
useEffect(() => {
  fetchFacilityRecords(1);
}, [filters]);  // Re-fetch whenever filters change

// 2. Load filter options (kecamatan, desa/kelurahan, years)
useEffect(() => {
  fetchFilterOptions();
}, []);  // Only run on component mount
```

### Fetch Functions

#### Fetch Filter Options
```typescript
const fetchFilterOptions = async () => {
  try {
    setLoadingFilters(true);

    // Fetch kecamatan list
    const kecamRes = await fetch('/api/masterdata/kecamatan?page=1&limit=1000');
    if (kecamRes.ok) {
      const kecamData = await kecamRes.json();
      setKecamatanList(kecamData.data || []);
    }

    // Fetch desa/kelurahan list
    const desaRes = await fetch('/api/masterdata/desa-kelurahan?page=1&limit=1000');
    if (desaRes.ok) {
      const desaData = await desaRes.json();
      setDesaKelurahanList(desaData.data || []);
    }

    // Generate year list (current year - 9 previous years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i)
      .sort((a, b) => b - a);
    setYearList(years);
  } catch (err) {
    console.error('Error fetching filter options:', err);
  } finally {
    setLoadingFilters(false);
  }
};
```

#### Fetch Facility Records
```typescript
const fetchFacilityRecords = async (page: number = 1) => {
  try {
    setLoading(true);
    setError(null);

    // Build query string with filters
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', '10');
    if (filters.kecamatanId) params.append('kecamatanId', filters.kecamatanId);
    if (filters.desaKelurahanId) params.append('desaKelurahanId', filters.desaKelurahanId);
    if (filters.year) params.append('year', filters.year);

    const response = await fetch(`/api/facility-records?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch facility records');
    
    const data = await response.json();
    setFacilityRecords(data.data || []);
    setPagination(data.meta);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch facility records');
  } finally {
    setLoading(false);
  }
};
```

### Action Button Handler Functions

```typescript
// CREATE - Navigate to create page
const handleCreate = () => {
  router.push('/admin/prasarana/create');
};

// EDIT - Navigate to edit page with ID
const handleEdit = (id: number) => {
  router.push(`/admin/prasarana/${id}/edit`);  // Dynamic route: [id]
};

// VIEW - Open modal with record details
const handleView = (record: any) => {
  setSelectedRecord(record);
  setIsViewModalOpen(true);
};

// DELETE - Soft delete with confirmation
const handleDelete = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

  setDeleting(id);
  try {
    const response = await fetch(`/api/facility-records/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete facility record');
    
    // Update UI
    setFacilityRecords(facilityRecords.filter(record => record.id !== id));
    setError(null);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delete facility record');
  } finally {
    setDeleting(null);
  }
};
```

### Filter Functions

```typescript
// Toggling filters visibility
const handleShowFilters = () => setShowFilters(!showFilters);

// Change single filter field
const handleFilterChange = (field: string, value: string) => {
  setFilters(prev => ({
    ...prev,
    [field]: value,
  }));
  // Reset to page 1 when filter changes
  setPagination(prev => ({ ...prev, page: 1 }));
};

// Reset all filters
const handleResetFilters = () => {
  setFilters({
    kecamatanId: '',
    desaKelurahanId: '',
    year: '',
  });
  setPagination(prev => ({ ...prev, page: 1 }));
};

// Computed: Filter desa/kelurahan based on selected kecamatan
const filteredDesaKelurahan = filters.kecamatanId
  ? desaKelurahanList.filter(d => d.kecamatan?.id === parseInt(filters.kecamatanId))
  : desaKelurahanList;
```

### Pagination Functions

```typescript
const handlePrevPage = () => {
  if (pagination.page > 1) {
    const prevPage = pagination.page - 1;
    setPagination(prev => ({ ...prev, page: prevPage }));
    fetchFacilityRecords(prevPage);
  }
};

const handleNextPage = () => {
  if (pagination.hasMore) {
    const nextPage = pagination.page + 1;
    setPagination(prev => ({ ...prev, page: nextPage }));
    fetchFacilityRecords(nextPage);
  }
};

const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= pagination.totalPages) {
    setPagination({ ...pagination, page: newPage });
  }
};
```

### JSX Structure - Layout Sections

```typescript
return (
  <div className="p-6 bg-white min-h-screen">
    
    {/* 1. HEADER SECTION */}
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Prasarana Olahraga</h1>
      <p className="text-gray-600">Kelola data prasarana olahraga per kecamatan</p>
    </div>

    {/* 2. ERROR MESSAGE */}
    {error && (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    )}

    {/* 3. ACTION BUTTONS */}
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Create Button */}
      <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        <Plus className="w-4 h-4 mr-2" />
        Tambah Data
      </button>
      
      {/* Toggle Filters */}
      <button onClick={() => setShowFilters(!showFilters)} className="...">
        <Filter className="w-4 h-4 mr-2" />
        {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
      </button>
      
      {/* Export (placeholder) */}
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
        <Download className="w-4 h-4 mr-2" />
        Export Excel
      </button>
    </div>

    {/* 4. FILTER PANEL (Conditional) */}
    {showFilters && (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filter Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Kecamatan Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan</label>
            <select
              value={filters.kecamatanId}
              onChange={(e) => {
                handleFilterChange('kecamatanId', e.target.value);
                setFilters(prev => ({ ...prev, desaKelurahanId: '' }));  // Reset desa
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Semua Kecamatan --</option>
              {kecamatanList.map((kec) => (
                <option key={kec.id} value={kec.id}>{kec.nama}</option>
              ))}
            </select>
          </div>

          {/* Desa/Kelurahan Filter (Cascading) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Desa/Kelurahan</label>
            <select
              value={filters.desaKelurahanId}
              onChange={(e) => handleFilterChange('desaKelurahanId', e.target.value)}
              disabled={!filters.kecamatanId}  // Requires kecamatan selection
              className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">-- Semua Desa/Kelurahan --</option>
              {filteredDesaKelurahan.map((desa) => (
                <option key={desa.id} value={desa.id}>{desa.nama}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Semua Tahun --</option>
              {yearList.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filter Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Reset Filter
          </button>
        </div>
      </div>
    )}

    {/* 5. MAIN TABLE */}
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : facilityRecords.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Tidak ada data prasarana. Klik "Tambah Data" untuk membuat data prasarana baru.
          </div>
        ) : (
          <table className="w-full">
            {/* TABLE HEADER */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prasarana</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Desa/Kelurahan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kecamatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahun</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kondisi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="bg-white divide-y divide-gray-200">
              {facilityRecords.map((record, index) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  {/* Row Number - Dynamic based on pagination */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </td>
                  
                  {/* Prasarana Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.prasarana?.nama || '-'}
                  </td>
                  
                  {/* Village/Sub-district */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.desaKelurahan?.nama || '-'}
                  </td>
                  
                  {/* District */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.desaKelurahan?.kecamatan?.nama || '-'}
                  </td>
                  
                  {/* Year */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.year}
                  </td>
                  
                  {/* Condition Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {record.condition || '-'}
                    </span>
                  </td>
                  
                  {/* Status Badge - Conditional coloring */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      record.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  
                  {/* Action Buttons */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      {/* Edit Button - Uses router.push() */}
                      <button
                        onClick={() => handleEdit(record.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(record.id)}
                        disabled={deleting === record.id}
                        className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
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

      {/* 6. PAGINATION */}
      {facilityRecords.length > 0 && (
        <div className="flex flex-col items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 gap-4 sm:flex-row">
          {/* Records Info */}
          <div className="text-sm text-gray-600">
            Menampilkan {(pagination.page - 1) * pagination.limit + 1} - 
            {Math.min(pagination.page * pagination.limit, pagination.total)} 
            dari {pagination.total} data
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={pagination.page === 1 || loading}
              className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-600">
              Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={!pagination.hasMore || loading}
              className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>

    {/* 7. VIEW DETAILS MODAL */}
    {isViewModalOpen && selectedRecord && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Detail Prasarana</h2>
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          {/* Modal Body - Display Record Details */}
          <div className="px-6 py-4 space-y-3">
            {/* Various detail fields... */}
            <div>
              <p className="text-sm font-medium text-gray-500">Prasarana</p>
              <p className="text-gray-900">{selectedRecord.prasarana?.nama || '-'}</p>
            </div>
            {/* ... more fields ... */}
          </div>
          
          {/* Modal Footer - Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-2">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                setIsViewModalOpen(false);
                handleEdit(selectedRecord.id);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
```

---

## 3. CREATE/PAGE.TSX - CREATE VIEW

**Location**: `app/(admin)/admin/prasarana/create/page.tsx`

### Complete Structure

```typescript
'use client';

import FacilityRecordForm from '@/components/admin/form/FacilityRecordForm';

export default function CreateFacilityRecordPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Pass no initialData = Create mode */}
      <FacilityRecordForm />
    </div>
  );
}
```

### Key Points:
- **Minimal page** - Delegates form logic to reusable component
- **Props**: No `initialData` prop = Create Mode (vs Edit Mode)
- **Styling**: Gray background container with padding
- **Router context**: Form handles navigation internally

---

## 4. [ID]/EDIT/PAGE.TSX - EDIT VIEW

**Location**: `app/(admin)/admin/prasarana/[id]/edit/page.tsx`

### Complete Structure

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FacilityRecordForm from '@/components/admin/form/FacilityRecordForm';
import { FacilityRecord } from '@/types/masterdata';

export default function EditFacilityRecordPage() {
  const params = useParams();
  const [facilityRecord, setFacilityRecord] = useState<FacilityRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch record data on component mount
  useEffect(() => {
    const fetchFacilityRecord = async () => {
      try {
        const response = await fetch(`/api/facility-records/${params.id}`);
        if (!response.ok) throw new Error('Facility record not found');
        const data = await response.json();
        setFacilityRecord(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch facility record');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchFacilityRecord();
    }
  }, [params.id]);

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error if fetch failed
  if (error || !facilityRecord) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || 'Facility record not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Pass initialData for Edit mode + isEdit flag */}
      <FacilityRecordForm initialData={facilityRecord} isEdit={true} />
    </div>
  );
}
```

### Key Features:

#### Dynamic Routing with `useParams()`
```typescript
const params = useParams();
// Access dynamic segment: params.id from [id]
// Used in:
// 1. Fetching specific record: `/api/facility-records/${params.id}`
// 2. Photo endpoints: `/api/facility-records/${params.id}/photos`
```

#### Loading States
- **Loading**: Spinner while fetching
- **Error**: Error message if fetch fails
- **Success**: Form with pre-filled data

#### Form Mode Determination
```typescript
// Edit mode is triggered by passing:
// - initialData: The fetched facility record
// - isEdit: true boolean flag
<FacilityRecordForm initialData={facilityRecord} isEdit={true} />
```

---

## 5. FACILITYRECORDFORM COMPONENT - SHARED FORM LOGIC

**Location**: `components/admin/form/FacilityRecordForm.tsx`

### Component Props Interface

```typescript
interface FacilityRecordFormProps {
  initialData?: FacilityRecord;  // Optional: populated in edit mode
  isEdit?: boolean;               // Optional: flag for edit mode
}

// Default values:
// - initialData = undefined (create mode)
// - isEdit = false (create mode)
```

### Complete Form Component Structure

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader, Trash2, Plus } from 'lucide-react';
import ImageUpload from '@/components/admin/form/ImageUpload';
import { FacilityRecord } from '@/types/masterdata';

// Type definitions
interface Prasarana {
  id: number;
  nama: string;
}

interface DesaKelurahan {
  id: number;
  nama: string;
  kecamatan?: {
    id: number;
    nama: string;
  };
}

interface FacilityRecordPhoto {
  id: number;
  fileUrl: string;
  fileName?: string;
  description?: string;
  uploadedAt: string;
}

// ============ COMPONENT ============
const FacilityRecordForm: React.FC<FacilityRecordFormProps> = ({ 
  initialData, 
  isEdit = false 
}) => {
  const router = useRouter();

  // ========== STATE ==========
  
  // Submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Option lists
  const [prasaranaList, setPrasaranaList] = useState<Prasarana[]>([]);
  const [desaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  
  // Photo management (edit mode only)
  const [photos, setPhotos] = useState<FacilityRecordPhoto[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoDescription, setNewPhotoDescription] = useState('');
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  // ========== FORM DATA ==========
  const [formData, setFormData] = useState({
    desaKelurahanId: initialData?.desaKelurahanId || '',
    prasaranaId: initialData?.prasaranaId || '',
    year: initialData?.year || new Date().getFullYear(),
    condition: initialData?.condition || '',
    ownershipStatus: initialData?.ownershipStatus || 'OWNED',
    address: initialData?.address || '',
    notes: initialData?.notes || '',
    isActive: initialData?.isActive !== false,
  });

  // ========== USEEFFECT HOOKS ==========

  // 1. Load dropdown options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        
        // Fetch prasarana
        const prasaranaRes = await fetch('/api/masterdata/prasarana?page=1&limit=1000');
        if (prasaranaRes.ok) {
          const prasaranaData = await prasaranaRes.json();
          setPrasaranaList(prasaranaData.data || []);
        }

        // Fetch desa/kelurahan
        const desaRes = await fetch('/api/masterdata/desa-kelurahan?page=1&limit=1000');
        if (desaRes.ok) {
          const desaData = await desaRes.json();
          setDesaKelurahanList(desaData.data || []);
        }
      } catch (err) {
        console.error('Error fetching options:', err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // 2. Load photos when editing
  useEffect(() => {
    if (isEdit && initialData?.id) {
      const fetchPhotos = async () => {
        try {
          const response = await fetch(`/api/facility-records/${initialData.id}/photos`);
          if (response.ok) {
            const data = await response.json();
            setPhotos(data || []);
          }
        } catch (err) {
          console.error('Error fetching photos:', err);
        }
      };

      fetchPhotos();
    }
  }, [isEdit, initialData?.id]);

  // ========== HANDLE SUBMIT ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.prasaranaId) {
      setError('Prasarana tidak boleh kosong');
      return;
    }

    if (!formData.desaKelurahanId) {
      setError('Desa/Kelurahan tidak boleh kosong');
      return;
    }

    if (!formData.year) {
      setError('Tahun tidak boleh kosong');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Determine method based on mode
      const url = isEdit 
        ? `/api/facility-records/${initialData?.id}` 
        : '/api/facility-records';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desaKelurahanId: parseInt(formData.desaKelurahanId as string),
          prasaranaId: parseInt(formData.prasaranaId as string),
          year: formData.year,
          condition: formData.condition.trim() || null,
          ownershipStatus: formData.ownershipStatus || null,
          address: formData.address.trim() || null,
          notes: formData.notes.trim() || null,
          isActive: formData.isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save facility record');
      }

      // Navigate back on success
      router.push('/admin/prasarana');
      router.refresh();  // Refresh server data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========== PHOTO HANDLERS ==========
  const handleAddPhoto = async () => {
    if (!newPhotoUrl.trim()) {
      setError('Foto URL tidak boleh kosong');
      return;
    }

    try {
      setLoadingPhotos(true);
      const response = await fetch(`/api/facility-records/${initialData?.id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl: newPhotoUrl,
          description: newPhotoDescription || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add photo');
      }

      const newPhoto = await response.json();
      setPhotos([newPhoto, ...photos]);
      setNewPhotoUrl('');
      setNewPhotoDescription('');
      setSuccess('Foto berhasil ditambahkan');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah foto');
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleRemovePhoto = async (photoId: number) => {
    if (!confirm('Yakin ingin menghapus foto ini?')) return;

    try {
      const response = await fetch(`/api/facility-records/${initialData?.id}/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove photo');
      }

      setPhotos(photos.filter(photo => photo.id !== photoId));
      setSuccess('Foto berhasil dihapus');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus foto');
    }
  };

  // ========== YEAR HELPER ==========
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // ========== LOADING STATE ==========
  if (loadingOptions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ========== RENDER ==========
  return (
    <>
      {/* FORM */}
      <form onSubmit={handleSubmit}>
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Prasarana' : 'Tambah Prasarana Baru'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {isEdit ? 'Ubah data prasarana' : 'Tambah data prasarana baru'}
              </p>
            </div>
          </div>
          
          {/* Save Button - Form Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Data'}
          </button>
        </div>

        {/* ===== ERROR MESSAGE ===== */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* ===== MAIN FORM FIELDS ===== */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          
          {/* 1. PRASARANA SELECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prasarana <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.prasaranaId}
              onChange={(e) => setFormData({ ...formData, prasaranaId: e.target.value })}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">-- Pilih Prasarana --</option>
              {prasaranaList.map((prasarana) => (
                <option key={prasarana.id} value={prasarana.id}>
                  {prasarana.nama}
                </option>
              ))}
            </select>
          </div>

          {/* 2. DESA/KELURAHAN SELECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desa/Kelurahan <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.desaKelurahanId}
              onChange={(e) => setFormData({ ...formData, desaKelurahanId: e.target.value })}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">-- Pilih Desa/Kelurahan --</option>
              {desaKelurahanList.map((desa) => (
                <option key={desa.id} value={desa.id}>
                  {desa.kecamatan?.nama} - {desa.nama}
                </option>
              ))}
            </select>
          </div>

          {/* 3. YEAR SELECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tahun <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* 4. ADDRESS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* 5. CONDITION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kondisi</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">-- Pilih Kondisi --</option>
              <option value="Baik">Baik</option>
              <option value="Cukup">Cukup</option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Berat">Rusak Berat</option>
            </select>
          </div>

          {/* 6. OWNERSHIP STATUS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Kepemilikan
            </label>
            <select
              value={formData.ownershipStatus}
              onChange={(e) => setFormData({ ...formData, ownershipStatus: e.target.value })}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="OWNED">Milik Sendiri</option>
              <option value="RENTED">Sewa</option>
              <option value="SHARED">Bersama</option>
            </select>
          </div>

          {/* 7. NOTES / REMARKS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={loading}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Masukkan catatan tambahan..."
            />
          </div>

          {/* 8. ACTIVE STATUS CHECKBOX */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              disabled={loading}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
              Aktif
            </label>
          </div>
        </div>
      </form>

      {/* ===== PHOTO MANAGEMENT SECTION (EDIT ONLY) ===== */}
      {isEdit && initialData && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Kelola Foto</h2>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {success}
              </div>
            )}

            {/* ADD NEW PHOTO SECTION */}
            <div className="mb-8 pb-6 border-b">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Tambah Foto Baru</h3>
              <div className="space-y-4">
                
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                  <ImageUpload
                    value={newPhotoUrl}
                    onChange={setNewPhotoUrl}
                    disabled={loadingPhotos}
                  />
                </div>

                {/* Photo Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    value={newPhotoDescription}
                    onChange={(e) => setNewPhotoDescription(e.target.value)}
                    placeholder="Keterangan foto (opsional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Add Photo Button */}
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  disabled={!newPhotoUrl.trim() || loadingPhotos}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Foto
                </button>
              </div>
            </div>

            {/* PHOTOS GRID */}
            {photos.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Foto ({photos.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photos.map(photo => (
                    <div 
                      key={photo.id} 
                      className="relative group border rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={photo.fileUrl}
                        alt={photo.description}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3">
                        {photo.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {photo.description}
                          </p>
                        )}
                        
                        {/* Delete Photo Button */}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Belum ada foto untuk prasarana ini
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FacilityRecordForm;
```

---

## 6. STYLING & CSS PATTERNS USED

### Tailwind CSS Classes Breakdown

#### **Spacing & Layout**
```
p-6         → padding: 1.5rem (6 * 0.25rem)
mb-6        → margin-bottom: 1.5rem
px-4 py-2   → padding horizontal/vertical
gap-4       → gap between flex/grid items
```

#### **Colors & States**
```
bg-blue-600      → Button backgrounds
bg-red-50        → Error message backgrounds
text-red-700     → Error text color
bg-green-100     → Success status badge
disabled:opacity-50  → Disabled state opacity
hover:bg-blue-700    → Hover effect
```

#### **Form Elements**
```
border border-gray-300           → Input borders
focus:outline-none               → Remove default focus
focus:ring-2 focus:ring-blue-500 → Custom focus ring
rounded-lg                       → Border radius
w-full                           → Full width

disabled:bg-gray-100        → Disabled input background
disabled:cursor-not-allowed → Disabled cursor
```

#### **Status Badges**
```
{/* Condition Badges */}
<span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
  {record.condition || '-'}
</span>

{/* Active Status Badges */}
<span className={`px-2 py-1 text-xs rounded-full ${
  record.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}`}>
  {record.isActive ? 'Aktif' : 'Tidak Aktif'}
</span>
```

#### **Responsive Grid**
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
→ 1 column on mobile
→ 2 columns on tablet
→ 3 columns on desktop
```

#### **Shadow & Visual Effects**
```
shadow-sm           → Small shadow
shadow-lg           → Large shadow (modal)
rounded-lg          → Rounded corners
overflow-hidden     → Clip overflow
```

---

## 7. BUTTONS & ACTIONS REFERENCE

### Button Types by Purpose

#### **Create Modal (List Page)**
```typescript
<button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
  <Plus className="w-4 h-4 mr-2" />
  Tambah Data
</button>
// Actions: router.push('/admin/prasarana/create')
```

#### **Back Button (Form Pages)**
```typescript
<button
  type="button"
  onClick={() => router.back()}
  className="p-2 hover:bg-gray-100 rounded-lg"
>
  <ArrowLeft className="w-5 h-5 text-gray-600" />
</button>
// Actions: Navigate to previous page
```

#### **Save/Submit Button (Form)**
```typescript
<button
  type="submit"
  disabled={loading}
  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
>
  {loading && <Loader className="w-4 h-4 animate-spin" />}
  {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Data'}
</button>
// Actions: Submit form → API call → router.push() to list
```

#### **Edit Button (Row Action)**
```typescript
<button
  onClick={() => handleEdit(record.id)}
  className="text-blue-600 hover:text-blue-800 transition-colors"
>
  <Edit className="w-4 h-4" />
</button>
// Actions: router.push(`/admin/prasarana/${id}/edit`)
```

#### **Delete Button (Row Action)**
```typescript
<button
  onClick={() => handleDelete(record.id)}
  disabled={deleting === record.id}
  className="text-red-600 hover:text-red-800 disabled:opacity-50"
>
  <Trash2 className="w-4 h-4" />
</button>
// Actions: 
// 1. Confirm dialog
// 2. DELETE /api/facility-records/{id}
// 3. Update local state
```

---

## 8. ERROR & SUCCESS MESSAGE DISPLAY PATTERNS

### Error Message Pattern

```typescript
// State
const [error, setError] = useState<string | null>(null);

// Display
{error && (
  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
    {error}
  </div>
)}

// Usage
setError('Prasarana tidak boleh kosong');  // Validation error
setError(err instanceof Error ? err.message : 'Gagal menyimpan data');  // API error
```

### Success Message Pattern

```typescript
// State
const [success, setSuccess] = useState<string | null>(null);

// Display
{success && (
  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
    {success}
  </div>
)}

// Usage (photo operations)
setSuccess('Foto berhasil ditambahkan');
setSuccess('Foto berhasil dihapus');
```

### Message Clearing Strategy

```typescript
// Clear on successful submit
setError(null);  // Before submit attempt

// Clear on navigation
router.push('/admin/prasarana');
router.refresh();  // Refresh page data
```

### Location of Messages

**List Page (page.tsx)**
- Error displayed at top, above action buttons
- Used for: Delete failures, fetch failures

**Form Pages (FacilityRecordForm.tsx)**
- Error: Top of form, above fields
- Success: In photo management section only (for photo ops)
- Submit errors show as error (not success)

---

## 9. FORM FIELD ORGANIZATION & STRUCTURE

### Form Fields (In Order)

```
1. Prasarana ID         → Required select dropdown
2. Desa/Kelurahan ID    → Required select dropdown  
3. Year                 → Required select (current - 9 years)
4. Address              → Optional text input
5. Condition            → Optional select (Baik/Cukup/Rusak Ringan/Rusak Berat)
6. Ownership Status     → Optional select (OWNED/RENTED/SHARED)
7. Notes/Remarks        → Optional textarea (4 rows)
8. Is Active            → Optional checkbox
```

### Form Field Patterns

#### **Required Select Field**
```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Prasarana <span className="text-red-500">*</span>
  </label>
  <select
    value={formData.prasaranaId}
    onChange={(e) => setFormData({ ...formData, prasaranaId: e.target.value })}
    disabled={loading}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
  >
    <option value="">-- Pilih Prasarana --</option>
    {prasaranaList.map((prasarana) => (
      <option key={prasarana.id} value={prasarana.id}>
        {prasarana.nama}
      </option>
    ))}
  </select>
</div>
```

#### **Optional Text Input**
```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Alamat
  </label>
  <input
    type="text"
    value={formData.address}
    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
    disabled={loading}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
  />
</div>
```

#### **Textarea**
```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Catatan
  </label>
  <textarea
    value={formData.notes}
    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
    disabled={loading}
    rows={4}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
    placeholder="Masukkan catatan tambahan..."
  />
</div>
```

#### **Checkbox**
```typescript
<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
  <input
    type="checkbox"
    id="isActive"
    checked={formData.isActive}
    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
    disabled={loading}
    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  />
  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
    Aktif
  </label>
</div>
```

---

## 10. DATA FLOW DIAGRAMS

### CREATE FLOW
```
User Click "Tambah Data"
    ↓
router.push('/admin/prasarana/create')
    ↓
CreateFacilityRecordPage renders
    ↓
<FacilityRecordForm /> (no initialData)
    ↓
useEffect: fetch prasarana & desa/kelurahan lists
    ↓
User fills form
    ↓
Click "Tambah Data" (submit)
    ↓
POST /api/facility-records { ...formData }
    ↓
router.push('/admin/prasarana')
↓ router.refresh()
    ↓
Return to list view with new record
```

### EDIT FLOW
```
User Click Edit icon on row
    ↓
handleEdit(record.id)
    ↓
router.push(`/admin/prasarana/${id}/edit`)
    ↓
EditFacilityRecordPage renders
    ↓
useEffect: fetch record by ID
    ↓
Loading → Complete
    ↓
<FacilityRecordForm initialData={facilityRecord} isEdit={true} />
    ↓
useEffect: fetch photos
    ↓
User modifies form fields
    ↓
Click "Simpan Perubahan" (submit)
    ↓
PUT /api/facility-records/{id} { ...formData }
    ↓
router.push('/admin/prasarana')
↓ router.refresh()
    ↓
Return to list view with updated record
```

### DELETE FLOW
```
User Click Delete icon
    ↓
handleDelete(record.id)
    ↓
Confirm dialog: "Apakah Anda yakin?"
    ↓
✓ Yes: DELETE /api/facility-records/{id}
✗ No: Return
    ↓
Success
    ↓
setFacilityRecords(filter out deleted ID)
    ↓
Table auto-updates
    ↓
Error
    ↓
setError(message)
    ↓
Display error banner
```

---

## 11. API CONTRACTS

### List/Filter Endpoint
```
GET /api/facility-records

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- kecamatanId?: number
- desaKelurahanId?: number
- year?: number

Response:
{
  data: FacilityRecord[],
  meta: {
    total: number,
    page: number,
    limit: number,
    totalPages: number,
    hasMore: boolean
  }
}
```

### Create Endpoint
```
POST /api/facility-records

Body:
{
  desaKelurahanId: number (required),
  prasaranaId: number (required),
  year: number (required),
  condition?: string | null,
  ownershipStatus?: string | null,
  address?: string | null,
  notes?: string | null,
  isActive: boolean
}

Response:
FacilityRecord
```

### Get Single Endpoint
```
GET /api/facility-records/{id}

Response:
FacilityRecord
```

### Update Endpoint
```
PUT /api/facility-records/{id}

Body: (same as POST)

Response:
FacilityRecord
```

### Delete Endpoint
```
DELETE /api/facility-records/{id}

Response:
Success or error message
```

### Photos Endpoints
```
GET /api/facility-records/{id}/photos
POST /api/facility-records/{id}/photos
DELETE /api/facility-records/{id}/photos/{photoId}
```

---

## 12. KEY PATTERNS & CONVENTIONS

### Mode Detection Pattern
```typescript
// Create Mode
<FacilityRecordForm />  // No props = create

// Edit Mode
<FacilityRecordForm initialData={record} isEdit={true} />

// In component
const url = isEdit ? `/api/facility-records/${initialData?.id}` : '/api/facility-records';
const method = isEdit ? 'PUT' : 'POST';
const buttonLabel = isEdit ? 'Simpan Perubahan' : 'Tambah Data';
```

### Cascading Select Pattern
```typescript
// Show desa/kelurahan only when kecamatan is selected
<select disabled={!filters.kecamatanId}>
  {/* options */}
</select>

// Filter options based on parent select
const filteredDesaKelurahan = filters.kecamatanId
  ? desaKelurahanList.filter(d => d.kecamatan?.id === parseInt(filters.kecamatanId))
  : desaKelurahanList;
```

### Router Navigation Pattern
```typescript
// Push new route
router.push('/admin/prasarana');
router.push(`/admin/prasarana/${id}/edit`);

// Go back
router.back();

// Refresh data
router.refresh();
```

### Conditional Rendering Pattern
```typescript
// Show only in edit mode
{isEdit && initialData && (
  <div>{/* Photo management */}</div>
)}

// Show only when loading
{loading && (
  <div className="animate-spin">...</div>
)}

// Show only when no data
{facilityRecords.length === 0 && (
  <div>Tidak ada data...</div>
)}
```

### State Update Pattern (Immutable)
```typescript
// Single field update
setFormData({ ...formData, prasaranaId: e.target.value })

// Filter array
setFacilityRecords(facilityRecords.filter(record => record.id !== id))

// Map transform
setPhotos([newPhoto, ...photos])
```

---

## Summary

The Prasarana module demonstrates:
✅ **Clean separation**: List, Create, and Edit pages
✅ **Reusable components**: Single FacilityRecordForm for both modes
✅ **Complete CRUD**: Create, Read (with filters + pagination), Update, Delete
✅ **Advanced filtering**: Multi-field filters with cascading selects
✅ **Pagination**: Full pagination with previous/next controls
✅ **Error handling**: Comprehensive error states and messages
✅ **Modal patterns**: View details modal with edit action
✅ **Form validation**: Required field checks
✅ **Photo management**: Edit-only photo upload and management
✅ **Responsive design**: Mobile-first Tailwind CSS styling
✅ **User feedback**: Loading states, success/error messages, disabled actions
