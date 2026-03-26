'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl, getImageErrorSrc } from '@/lib/image-utils';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  categoryName: string;
  date: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  views: number;
  tags: string[];
}

interface NewsSectionProps {
  onNewsClick?: (news: NewsItem) => void;
}

const NewsSection: React.FC<NewsSectionProps> = ({ 
  onNewsClick = () => {}
}) => {
  const [newsCategories, setNewsCategories] = useState<{
    popular: NewsItem[];
    trending: NewsItem[];
    latest: NewsItem[];
  }>({
    popular: [],
    trending: [],
    latest: [],
  });

  const [activeTab, setActiveTab] = useState<'popular' | 'trending' | 'latest'>('latest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Fetch featured news data
  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/news/featured');
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setNewsCategories(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured news:', err);
        setError('Gagal memuat berita. Silahkan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedNews();
  }, []);

  const currentNews = newsCategories[activeTab];

  const handleNewsClick = (news: NewsItem) => {
    onNewsClick(news);
  };

  return (
    <section id="info" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Berita Terkini
            </h2>
            <p className="text-xl text-gray-600">
              Update terbaru dari dunia olahraga daerah
            </p>
          </div>
          <Link href="/berita" className="hidden md:flex items-center text-green-600 hover:text-green-800 font-semibold">
            Lihat Semua
            <ChevronRight className="ml-1 w-5 h-5" />
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('latest')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'latest'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Terbaru
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'trending'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'popular'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Terpopuler
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{error}</p>
          </div>
        ) : currentNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentNews.map((news) => {
              const imageUrl = imageErrors[news.id] ? getImageErrorSrc() : getImageUrl(news.thumbnail) || 'https://via.placeholder.com/400x300?text=No+Image';
              
              return (
              <div key={news.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={imageUrl}
                    alt={news.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => {
                      setImageErrors(prev => ({
                        ...prev,
                        [news.id]: true
                      }));
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      activeTab === 'trending' ? 'bg-red-500 text-white' :
                      activeTab === 'latest' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {activeTab === 'trending' && '🔥 Trending'}
                      {activeTab === 'latest' && '✨ Terbaru'}
                      {activeTab === 'popular' && '⭐ Populer'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-500">{news.date}</p>
                    <p className="text-xs text-gray-400">👁️ {news.views} views</p>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{news.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{news.excerpt}</p>
                  <Link
                    href={`/berita/${news.slug}`}
                    onClick={() => handleNewsClick(news)}
                    className="text-green-600 hover:text-green-800 font-semibold flex items-center text-sm"
                  >
                    Baca Selengkapnya
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Belum ada berita untuk kategori ini</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
