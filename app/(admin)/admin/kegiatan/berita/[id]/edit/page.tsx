'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BeritaForm from '@/components/admin/form/BeritaForm';
import { News } from '@/types/news';
import { Loader } from 'lucide-react';

export default function EditBeritaPage() {
  const params = useParams();
  const id = params.id as string;
  const [berita, setBerita] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/berita/${id}`);
        if (!response.ok) throw new Error('Failed to fetch berita');
        const data = await response.json();
        setBerita(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load berita');
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !berita) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="text-center text-red-600">
          {error || 'Berita tidak ditemukan'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <BeritaForm initialData={berita} isEdit={true} />
    </div>
  );
}
