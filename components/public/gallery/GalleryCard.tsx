'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Calendar } from 'lucide-react';

interface GalleryItem {
  id: number;
  imageUrl: string;
  caption?: string;
}

interface GalleryCardProps {
  item: {
    id: number;
    title: string;
    description?: string | null;
    items: GalleryItem[];
    createdAt: string;
  };
}

export default function GalleryCard({ item }: GalleryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Get the first image from the items array
  const rawImageUrl = item.items?.[0]?.imageUrl;
  const defaultImage = 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400';
  
  // Normalize image URL - support both local and remote URLs
  const getImageUrl = (url?: string) => {
    if (!url) return defaultImage;
    
    // If it's already a remote URL (starts with http/https), use as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a local path but doesn't start with /, add it
    if (!url.startsWith('/')) {
      return `/${url}`;
    }
    
    return url;
  };
  
  // Parse date safely
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    
    try {
      // Try parsing as ISO string or standard date format
      const date = new Date(dateStr);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return null;
      }
      
      return date;
    } catch {
      return null;
    }
  };
  
  // Format date for display
  const formatDateShort = (dateStr: string) => {
    const date = parseDate(dateStr);
    if (!date) return 'Tanggal tidak diketahui';
    
    try {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: '2-digit'
      });
    } catch {
      return 'Tanggal tidak diketahui';
    }
  };
  
  // Format date for modal
  const formatDateLong = (dateStr: string) => {
    const date = parseDate(dateStr);
    if (!date) return 'Tanggal tidak diketahui';
    
    try {
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Tanggal tidak diketahui';
    }
  };
  
  const firstImage = imageError ? defaultImage : getImageUrl(rawImageUrl) || defaultImage;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
        {/* Image Container */}
        <div
          className="relative h-56 bg-gray-200 overflow-hidden"
          onClick={() => setIsModalOpen(true)}
        >
          {imageError ? (
            // Fallback: Regular img tag if Next Image fails
            <img
              src={firstImage}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            // Primary: Next.js Image component
            <Image
              src={firstImage}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              onError={() => setImageError(true)}
            />
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center">
              <p className="font-semibold">Lihat Gambar</p>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description || 'Koleksi foto tanpa deskripsi'}
          </p>

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-200 pt-3">
            <Calendar className="w-3 h-3" />
            <time dateTime={item.createdAt}>
              {formatDateShort(item.createdAt)}
            </time>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image */}
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
              {imageError ? (
                // Fallback: Regular img tag
                <img
                  src={firstImage}
                  alt={item.title}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              ) : (
                // Primary: Next.js Image component
                <Image
                  src={firstImage}
                  alt={item.title}
                  width={1200}
                  height={800}
                  className="object-contain"
                  priority
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            {/* Info below image */}
            <div className="bg-gray-900 text-white p-4 rounded-b-lg space-y-2">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-gray-300">{item.description || 'Koleksi foto tanpa deskripsi'}</p>
              <div className="flex items-center justify-end pt-2 border-t border-gray-700">
                <time dateTime={item.createdAt} className="text-sm text-gray-400">
                  {formatDateLong(item.createdAt)}
                </time>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
