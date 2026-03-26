'use client';

import React, { useEffect, useState } from 'react';
import { getImageUrl } from '@/lib/image-utils';

interface ArticleContentRendererProps {
  content: string;
}

// Sanitize HTML content to prevent invalid nesting
const sanitizeHtml = (html: string): string => {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container.innerHTML;
};

// Process all img src attributes to use getImageUrl
const processImageUrls = (html: string): string => {
  const container = document.createElement('div');
  container.innerHTML = html;
  
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
      // Process the URL through getImageUrl utility
      const processedUrl = getImageUrl(src);
      img.setAttribute('src', processedUrl);
    }
  });
  
  return container.innerHTML;
};

/**
 * Client-side component to render HTML content safely
 * Prevents hydration mismatch by only rendering on client
 * Also processes and fixes image URLs for production compatibility
 */
export function ArticleContentRenderer({ content }: ArticleContentRendererProps) {
  const [mounted, setMounted] = useState(false);
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    setMounted(true);
    
    // Process content to fix image URLs for production
    const processed = processImageUrls(content);
    setProcessedContent(processed);
  }, [content]);

  if (!mounted) {
    return <div className="min-h-[400px] bg-gray-100 rounded animate-pulse" />;
  }

  return (
    <div
      className="text-gray-700 leading-relaxed prose prose-sm md:prose-base max-w-none"
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(processedContent)
      }}
      suppressHydrationWarning
    />
  );
}
