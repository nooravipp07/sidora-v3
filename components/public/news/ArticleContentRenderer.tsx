'use client';

import React, { useEffect, useState } from 'react';

interface ArticleContentRendererProps {
  content: string;
}

/**
 * Client-side component to render HTML content safely
 * Prevents hydration mismatch by only rendering on client
 */
export function ArticleContentRenderer({ content }: ArticleContentRendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-[400px] bg-gray-100 rounded animate-pulse" />;
  }

  // Sanitize HTML content to prevent invalid nesting
  const sanitizeHtml = (html: string): string => {
    const container = document.createElement('div');
    container.innerHTML = html;
    return container.innerHTML;
  };

  return (
    <div
      className="text-gray-700 leading-relaxed prose prose-sm md:prose-base max-w-none"
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(content)
      }}
      suppressHydrationWarning
    />
  );
}
