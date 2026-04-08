'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EquipmentInputForm from '@/components/admin/form/EquipmentInputForm';

const EditRejectedEquipment: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/staging/equipment/${id}`);

        if (!response.ok) {
          throw new Error('Gagal mengambil data peralatan');
        }

        const data = await response.json();
        setEquipment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        console.error('Error fetching equipment:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEquipment();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
        Data peralatan tidak ditemukan
      </div>
    );
  }

  return <EquipmentInputForm initialData={equipment} isEdit={true} />;
};

export default EditRejectedEquipment;
