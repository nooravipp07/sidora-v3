'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  date: string;
  description: string;
}

interface GallerySectionProps {
  galleryData?: GalleryItem[];
}

interface GalleryAPIItem {
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

interface GalleryAPIResponse {
  data: GalleryAPIItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

const GallerySection: React.FC<GallerySectionProps> = ({ galleryData: externalGalleryData }) => {
  const [galleryData, setGalleryData] = useState<GalleryItem[]>(externalGalleryData);
  const [currentGallerySlide, setCurrentGallerySlide] = useState(0);
  const [isLoading, setIsLoading] = useState(!externalGalleryData);
  const [error, setError] = useState<string | null>(null);

  // Fetch gallery data from API if not provided
  useEffect(() => {
    if (externalGalleryData) {
      setGalleryData(externalGalleryData);
      return;
    }

    const fetchGalleries = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch first page with 6 items to show in carousel
        const response = await fetch('/api/gallery?page=1&limit=6');
        if (!response.ok) {
          throw new Error('Failed to fetch galleries');
        }

        const data: GalleryAPIResponse = await response.json();

        // Transform API data to component format
        const transformedGalleries = data.data.map((gallery: GalleryAPIItem) => {
          const thumbnail = gallery.items?.[0]?.imageUrl || 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400';
          
          return {
            id: gallery.id,
            title: gallery.title,
            image: thumbnail,
            date: new Date(gallery.createdAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            description: gallery.description || 'Dokumentasi kegiatan olahraga daerah',
          };
        });

        setGalleryData(transformedGalleries);
      } catch (err) {
        console.error('Error fetching galleries:', err);
        setError('Gagal memuat galeri');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleries();
  }, [externalGalleryData]);

  // Auto carousel effect
  useEffect(() => {
    if (galleryData?.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentGallerySlide((prev) => (prev + 1) % galleryData?.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [galleryData?.length]);

  // Handle empty/loading state
  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Galeri Kegiatan
              </h2>
              <p className="text-xl text-gray-600">
                Dokumentasi kegiatan olahraga dan prestasi atlet
              </p>
            </div>
          </div>
          <div className="relative w-full h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </section>
    );
  }

  if (galleryData.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Galeri Kegiatan
              </h2>
              <p className="text-xl text-gray-600">
                Dokumentasi kegiatan olahraga dan prestasi atlet
              </p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada galeri tersedia saat ini</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
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
          <Link href="/galeri" className="hidden md:flex items-center text-green-600 hover:text-green-800 font-semibold">
            Lihat Semua
            <ChevronRight className="ml-1 w-5 h-5" />
          </Link>
        </div>

        {/* Gallery Grid Carousel */}
        <div className="relative w-full">
          <div className="relative w-full mx-auto px-0 sm:px-2 lg:px-0">
            {/* Carousel Wrapper */}
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6"
                style={{
                  transform: `translateX(calc(-${currentGallerySlide} * (100% / 1 + (${currentGallerySlide === 0 ? 0 : 1} * 16px / 1))))`,
                }}
              >
                {galleryData.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3"
                  >
                    <div className="relative h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-lg group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Title Overlay - Top Left */}
                      <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 z-20">
                        <p className="text-xs sm:text-sm text-gray-200 mb-1">
                          {item.date}
                        </p>
                        <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white drop-shadow-lg max-w-xs leading-tight">
                          {item.title}
                        </h3>
                      </div>

                      {/* Description - Bottom (Hidden on Mobile, Visible on Larger Screens) */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 z-20 hidden sm:block">
                        <p className="text-xs sm:text-sm text-gray-100 drop-shadow-lg line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              {/* Left Navigation Arrow */}
              <button
                onClick={() =>
                  setCurrentGallerySlide((prev) =>
                    prev === 0 ? galleryData.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 group hover:shadow-xl"
                aria-label="Previous gallery items"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              </button>

              {/* Right Navigation Arrow */}
              <button
                onClick={() =>
                  setCurrentGallerySlide((prev) =>
                    prev === galleryData.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 group hover:shadow-xl"
                aria-label="Next gallery items"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Carousel Indicators - Below Carousel */}
            <div className="flex justify-center gap-2 mt-6 sm:mt-8">
              {galleryData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentGallerySlide(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    currentGallerySlide === idx
                      ? 'bg-gray-900 w-8 h-3'
                      : 'bg-gray-400 w-3 h-3 hover:bg-gray-600'
                  }`}
                  aria-label={`Go to gallery item ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
