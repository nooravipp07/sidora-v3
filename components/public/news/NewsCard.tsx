'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Calendar } from 'lucide-react';

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
}

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const hasImage = news.thumbnail && news.thumbnail.trim();
  
  return (
    <Link href={`/berita/${news.slug}`} prefetch={false}>
      <div className="h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col">
        {/* Image Container */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {hasImage ? (
            <Image
              src={news.thumbnail}
              alt={news.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 text-sm font-medium">No Image</p>
              </div>
            </div>
          )}
          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
              news.category === 'Trending' ? 'bg-red-500' :
              news.category === 'Latest' ? 'bg-blue-500' :
              'bg-yellow-500'
            }`}>
              {news.category}
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 p-4 md:p-5 flex flex-col">
          {/* Title */}
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {news.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {news.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <time dateTime={news.publishedAt}>
                {new Date(news.publishedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: '2-digit'
                })}
              </time>
            </div>
            <div className="flex items-center text-green-600 font-semibold gap-1 group-hover:gap-2 transition-all text-sm">
              Baca
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
