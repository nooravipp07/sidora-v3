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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
      <FacilityRecordForm initialData={facilityRecord} isEdit={true} />
    </div>
  );
}
