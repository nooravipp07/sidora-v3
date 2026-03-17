'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AgendaForm from '@/components/admin/form/AgendaForm';
import { Agenda } from '@/types/agenda';

export default function EditAgendaPage() {
  const params = useParams();
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const response = await fetch(`/api/agenda/${params.id}`);
        if (!response.ok) throw new Error('Agenda not found');
        const data = await response.json();
        setAgenda(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch agenda');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAgenda();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !agenda) {
    return (
      <div className="p-6">
        <div className="text-red-600">{error || 'Agenda not found'}</div>
      </div>
    );
  }

  return <AgendaForm initialData={agenda} isEdit />;
}
