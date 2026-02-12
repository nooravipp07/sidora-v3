'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function GalleryPagination({
  currentPage,
  totalPages,
  baseUrl
}: GalleryPaginationProps) {
  const getPageUrl = (page: number) => `${baseUrl}?page=${page}`;

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(
        <Link key="1" href={getPageUrl(1)} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
          1
        </Link>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`px-3 py-2 rounded-lg transition-colors ${
            currentPage === page
              ? 'bg-green-600 text-white'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </Link>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <Link
          key={totalPages}
          href={getPageUrl(totalPages)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <Link
        href={getPageUrl(Math.max(1, currentPage - 1))}
        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-disabled={currentPage === 1}
        onClick={(e) => currentPage === 1 && e.preventDefault()}
      >
        <ChevronLeft className="w-4 h-4" />
        Sebelumnya
      </Link>

      {renderPageNumbers()}

      <Link
        href={getPageUrl(Math.min(totalPages, currentPage + 1))}
        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-disabled={currentPage === totalPages}
        onClick={(e) => currentPage === totalPages && e.preventDefault()}
      >
        Berikutnya
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
