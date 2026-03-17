'use client';

import { useEffect } from 'react';
import { trackVisitor } from '@/lib/analytics/visitor-tracking';

/**
 * Custom hook to track page visits
 * Use this hook in your page components to automatically track visitors
 * 
 * @example
 * 'use client';
 * export default function NewsPage() {
 *   useTrackPageView('/berita');
 *   return <div>News Content</div>;
 * }
 */
export function useTrackPageView(page: string): void {
  useEffect(() => {
    // Track the page view when component mounts
    trackVisitor({ page });
  }, [page]);
}
