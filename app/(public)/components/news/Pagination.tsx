'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages,
  baseUrl = '/berita'
}) => {
  const pages = [];
  
  // Show page numbers (max 5 pages visible)
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  // Add first page and ellipsis if needed
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push('...');
    }
  }

  // Add page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add last page and ellipsis if needed
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    pages.push(totalPages);
  }

  return (
    <div className="py-12">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Previous Button */}
        <Link
          href={currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : '#'}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            currentPage > 1
              ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          aria-disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
          <span className="sm:hidden">Prev</span>
        </Link>

        {/* Page Numbers */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {pages.map((page, idx) => 
            typeof page === 'number' ? (
              <Link
                key={idx}
                href={page !== currentPage ? `${baseUrl}?page=${page}` : '#'}
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-semibold transition-all ${
                  page === currentPage
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            ) : (
              <span key={idx} className="text-gray-400 font-bold">
                {page}
              </span>
            )
          )}
        </div>

        {/* Next Button */}
        <Link
          href={currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : '#'}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            currentPage < totalPages
              ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          aria-disabled={currentPage === totalPages}
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Page Info */}
      <div className="text-center mt-6 text-sm text-gray-600">
        Halaman <span className="font-semibold text-gray-900">{currentPage}</span> dari <span className="font-semibold text-gray-900">{totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;
