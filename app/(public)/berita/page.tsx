'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';
import { HeadlineNews, NewsCard, Pagination } from '@/components/public/news';

const ITEMS_PER_PAGE = 12;

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  category: string;
  views: number;
  date: string;
  publishedAt: string;
}

interface FeaturedNews {
  popular: NewsItem[];
  trending: NewsItem[];
  latest: NewsItem[];
}

function BeritaPageContent() {
  useTrackPageView('/berita');
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [newsData, setNewsData] = useState<{
    data: NewsItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasMore: boolean;
    };
  } | null>(null);

  const [featuredNews, setFeaturedNews] = useState<NewsItem | null>(null);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news list
  useEffect(() => {
    const fetchNewsList = async () => {
      try {
        setIsLoadingNews(true);
        const response = await fetch(`/api/berita?page=${page}&limit=${ITEMS_PER_PAGE}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setNewsData(data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Gagal memuat berita. Silahkan coba lagi nanti.');
      } finally {
        setIsLoadingNews(false);
      }
    };

    fetchNewsList();
  }, [page]);

  // Fetch featured (trending) news
  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        setIsLoadingFeatured(true);
        const response = await fetch('/api/news/featured');
        
        if (response.ok) {
          const data = await response.json();
          // Get first trending news as banner
          if (data.trending && data.trending.length > 0) {
            setFeaturedNews(data.trending[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching featured news:', err);
      } finally {
        setIsLoadingFeatured(false);
      }
    };

    if (page === 1) {
      fetchFeaturedNews();
    }
  }, [page]);

  // Filter grid news to exclude featured on page 1
  const gridNews = page === 1 && newsData?.data
    ? newsData.data.filter(item => item.id !== featuredNews?.id)
    : newsData?.data || [];

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
        {page === 1 && (
          <>
            {isLoadingFeatured ? (
              <div className="mb-12 h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            ) : featuredNews ? (
              <HeadlineNews news={featuredNews} />
            ) : null}
          </>
        )}

        {/* News Grid */}
        {isLoadingNews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{error}</p>
          </div>
        ) : gridNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {gridNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>

            {/* Pagination */}
            {newsData && (
              <Pagination 
                currentPage={newsData.meta.page} 
                totalPages={newsData.meta.totalPages}
                baseUrl="/berita"
              />
            )}
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
