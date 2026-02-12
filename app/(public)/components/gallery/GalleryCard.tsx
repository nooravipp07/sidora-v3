'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Gallery } from '@/lib/gallery/types';
import { X, Calendar } from 'lucide-react';

interface GalleryCardProps {
  item: Gallery;
}

export default function GalleryCard({ item }: GalleryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
        {/* Image Container */}
        <div
          className="relative h-56 bg-gray-200 overflow-hidden"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-green-600">
              {item.category}
            </span>
          </div>
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
            {item.description}
          </p>

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-200 pt-3">
            <Calendar className="w-3 h-3" />
            <time dateTime={item.postedAt}>
              {new Date(item.postedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: '2-digit'
              })}
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
              <Image
                src={item.image}
                alt={item.title}
                width={1200}
                height={800}
                className="object-contain"
                priority
              />
            </div>

            {/* Info below image */}
            <div className="bg-gray-900 text-white p-4 rounded-b-lg space-y-2">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-600">
                  {item.category}
                </span>
                <time dateTime={item.postedAt} className="text-sm text-gray-400">
                  {new Date(item.postedAt).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
