'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';
import { GalleryCard, GalleryPagination } from '@/components/public/gallery';

const ITEMS_PER_PAGE = 12;

interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  items: Array<{
    id: number;
    imageUrl: string;
    caption: string | null;
  }>;
  createdAt: string;
}

interface GalleryResponse {
  data: GalleryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

function GaleriPageContent() {
  useTrackPageView('/galeri');
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    total: 0,
  });

  // Fetch galleries from API
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/gallery?page=${page}&limit=${ITEMS_PER_PAGE}`);
        if (!response.ok) {
          throw new Error('Failed to fetch galleries');
        }

        const data: GalleryResponse = await response.json();

        // Transform gallery data with items
        const transformedGalleries = data.data.map((gallery: GalleryItem) => {
          // Get first image from items as thumbnail
          const thumbnail = gallery.items?.[0]?.imageUrl || '/placeholder-gallery.jpg';
          const allImages = gallery.items || [];

          return {
            id: gallery.id.toString(),
            title: gallery.title,
            description: gallery.description || '',
            image: thumbnail,
            category: 'Gallery',
            postedAt: new Date(gallery.createdAt).toLocaleDateString('id-ID'),
            allImages: allImages, // Include all images for detail view
          };
        });

        setGalleries(transformedGalleries);
        setPagination({
          totalPages: data.meta.totalPages,
          total: data.meta.total,
        });
      } catch (err) {
        console.error('Error fetching galleries:', err);
        setError('Gagal memuat galeri. Silahkan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleries();
  }, [page]);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Galeri
          </h1>
          <p className="text-lg text-gray-600">
            Dokumentasi kegiatan dan momen berharga dari dunia olahraga daerah
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-xl shadow-md p-8 text-center border border-red-200">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : galleries.length > 0 ? (
          <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {galleries.map((item) => (
                <GalleryCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <GalleryPagination 
                currentPage={page} 
                totalPages={pagination.totalPages}
                baseUrl="/galeri"
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada galeri ditemukan untuk halaman ini.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function GaleriPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p>Loading...</p></div>}>
      <GaleriPageContent />
    </Suspense>
  );
}
