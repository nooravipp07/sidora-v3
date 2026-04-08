'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AthleteInputForm from '@/components/admin/form/AthleteInputForm';

const EditRejectedAthlete: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [athlete, setAthlete] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/staging/athlete/${id}`);

        if (!response.ok) {
          throw new Error('Gagal mengambil data atlet');
        }

        const data = await response.json();
        setAthlete(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        console.error('Error fetching athlete:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAthlete();
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

  if (!athlete) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
        Data atlet tidak ditemukan
      </div>
    );
  }

  return <AthleteInputForm initialData={athlete} isEdit={true} />;
};

export default EditRejectedAthlete;