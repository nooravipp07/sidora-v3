'use client';

import { useEffect } from 'react';
import { trackVisitor } from '@/lib/analytics/visitor-tracking';

interface DetailArticleTrackerProps {
  slug: string;
  newsId: number;
}

/**
 * Client-side component to track article views and increment view count
 * Use this in article detail pages to track visitor analytics and article views
 */
export function DetailArticleTracker({ slug, newsId }: DetailArticleTrackerProps) {
  useEffect(() => {
    // Track page view
    trackVisitor({ page: `/berita/${slug}` });

    // Increment article views count
    const incrementViews = async () => {
      try {
        await fetch(`/api/berita/${newsId}/views`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    };

    incrementViews();
  }, [slug, newsId]);

  // This component doesn't render anything, it just tracks
  return null;
}
