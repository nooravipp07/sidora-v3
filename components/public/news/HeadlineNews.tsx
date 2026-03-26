'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getImageUrl, getImageErrorSrc } from '@/lib/image-utils';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  category: string;
  views?: number;
  date?: string;
  publishedAt: string;
  readTime?: number;
}

interface HeadlineNewsProps {
  news: NewsItem;
}

const HeadlineNews: React.FC<HeadlineNewsProps> = ({ news }) => {
  const [imageError, setImageError] = useState(false);
  const hasImage = news.thumbnail && news.thumbnail.trim();
  const imageUrl = imageError ? getImageErrorSrc() : getImageUrl(news.thumbnail);
  
  return (
    <Link href={`/berita/${news.slug}`} prefetch={false}>
      <div className="mb-12 cursor-pointer group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Featured Image */}
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
          {hasImage ? (
            <>
              <img
                src={imageUrl}
                alt={news.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-300 text-lg font-medium">No Image Available</p>
              </div>
            </div>
          )}

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12">
            <div className="max-w-2xl">
              {/* Category Badge */}
              <div className="mb-4">
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white ${
                  news.category === 'Trending' ? 'bg-red-500' :
                  news.category === 'Latest' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`}>
                  {news.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 group-hover:text-yellow-300 transition-colors">
                {news.title}
              </h1>

              {/* Excerpt */}
              <p className="text-sm sm:text-base md:text-lg text-gray-100 mb-4 md:mb-6 line-clamp-2 md:line-clamp-3">
                {news.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between">
                <div className="text-xs sm:text-sm text-gray-300">
                  <time dateTime={news.publishedAt}>
                    {new Date(news.publishedAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  {news.readTime && (
                    <span className="ml-4">• {news.readTime} min read</span>
                  )}
                </div>
                <div className="flex items-center text-yellow-300 font-semibold gap-1 group-hover:gap-2 transition-all">
                  Baca Selengkapnya
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HeadlineNews;
