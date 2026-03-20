'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SportsGroupForm from '@/components/admin/form/SportsGroupForm';

export default function EditSportsGroupPage() {
  const params = useParams();
  const [sportsGroup, setSportsGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSportsGroup = async () => {
      try {
        const response = await fetch(`/api/masterdata/sports-group/${params.id}`);
        if (!response.ok) throw new Error('Sports group not found');
        const data = await response.json();
        setSportsGroup(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSportsGroup();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {sportsGroup && <SportsGroupForm initialData={sportsGroup} isEdit={true} />}
    </div>
  );
}
