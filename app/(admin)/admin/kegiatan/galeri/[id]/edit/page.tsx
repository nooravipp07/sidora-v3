'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import GalleryForm from '@/components/admin/form/GalleryForm';
import { Gallery } from '@/types/gallery';

export default function EditGalleryPage() {
  const params = useParams();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`/api/gallery/${params.id}`);
        if (!response.ok) throw new Error('Gallery not found');
        const data = await response.json();
        setGallery(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch gallery');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchGallery();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <div className="p-6">
        <div className="text-red-600">{error || 'Gallery not found'}</div>
      </div>
    );
  }

  return <GalleryForm initialData={gallery} isEdit />;
}
