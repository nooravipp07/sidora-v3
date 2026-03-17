/**
 * Visitor tracking utility for recording page views
 * Use this in public pages to track visitor statistics
 */

const STORAGE_KEY = 'visitor_session_id';

/**
 * Get or generate a unique session ID for the current visitor
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // Check if session ID already exists in localStorage
  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    // Generate a new session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Detect device type based on user agent
 */
function detectDeviceType(): string {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }

  const ua = navigator.userAgent.toLowerCase();

  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile';
  } else if (/ipad|android|tablet/i.test(ua)) {
    return 'tablet';
  }

  return 'desktop';
}

export interface TrackVisitorOptions {
  page: string;
  referrer?: string;
}

/**
 * Track a visitor page view
 * Call this function from your pages to record visits
 */
export async function trackVisitor(options: TrackVisitorOptions): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const sessionId = getSessionId();
    const deviceType = detectDeviceType();
    const referrer = options.referrer || document.referrer;

    const response = await fetch('/api/analytics/track-visitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        page: options.page,
        referrer,
        deviceType,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to track visitor:', error);
    return false;
  }
}

/**
 * Clear visitor session (for testing or logout)
 */
export function clearVisitorSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
