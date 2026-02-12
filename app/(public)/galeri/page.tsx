'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GalleryCard from '../components/gallery/GalleryCard';
import GalleryPagination from '../components/gallery/GalleryPagination';
import { getGalleryPage } from '@/lib/gallery/data';

const ITEMS_PER_PAGE = 12;

function GaleriPageContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Validate page number
  const galleryPageData = getGalleryPage(page, ITEMS_PER_PAGE);
  const validPage = Math.max(1, Math.min(page, galleryPageData.totalPages));

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

        {/* Gallery Grid */}
        {galleryPageData.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {galleryPageData.items.map((item) => (
                <GalleryCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <GalleryPagination 
                currentPage={validPage} 
                totalPages={galleryPageData.totalPages}
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
