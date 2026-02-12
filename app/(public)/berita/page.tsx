'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HeadlineNews from '../components/news/HeadlineNews';
import NewsCard from '../components/news/NewsCard';
import Pagination from '../components/news/Pagination';
import { getNewsPage, getFeaturedNews } from '@/lib/news/data';

const ITEMS_PER_PAGE = 12;

function BeritaPageContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Validate page number
  const newsPageData = getNewsPage(page, ITEMS_PER_PAGE);
  const validPage = Math.max(1, Math.min(page, newsPageData.totalPages));
  
  // Get featured news (first item)
  const featuredNews = getFeaturedNews();
  
  // Get paginated news (excluding featured from the grid if it's on page 1)
  const gridNews = validPage === 1 && newsPageData.items.length > 0
    ? newsPageData.items.slice(1) // Skip featured news on first page
    : newsPageData.items;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Berita Terkini
          </h1>
          <p className="text-lg text-gray-600">
            Update terbaru dari dunia olahraga dan kegiatan daerah
          </p>
        </div>

        {/* Featured Headline - Only on page 1 */}
        {validPage === 1 && (
          <HeadlineNews news={featuredNews} />
        )}

        {/* News Grid */}
        {gridNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {gridNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination 
              currentPage={validPage} 
              totalPages={newsPageData.totalPages}
              baseUrl="/berita"
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada berita ditemukan untuk halaman ini.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function BeritaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p>Loading...</p></div>}>
      <BeritaPageContent />
    </Suspense>
  );
}
