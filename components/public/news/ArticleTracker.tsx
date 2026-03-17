'use client';

import { useEffect } from 'react';
import { trackVisitor } from '@/lib/analytics/visitor-tracking';

interface ArticleTrackerProps {
  slug: string;
}

/**
 * Client-side component to track article views
 * Use this in server components to track visitor analytics
 */
export function ArticleTracker({ slug }: ArticleTrackerProps) {
  useEffect(() => {
    // Track article view with specific slug
    trackVisitor({ page: `/berita/${slug}` });
  }, [slug]);

  // This component doesn't render anything, it just tracks
  return null;
}
