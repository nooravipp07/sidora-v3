/**
 * Image URL utilities for handling both local dev and production environments
 */

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';

  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If base64 (data URL), return as-is
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }

  // For relative paths like /uploads/berita/file.png
  // Try direct access first, fallback to API route if needed
  
  if (typeof window !== 'undefined') {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (!isDev) {
      // Production: Use API fallback route for serving files
      // This ensures files work even if not served as static
      if (imagePath.startsWith('/uploads/')) {
        // Use /api/files route which handles multiple storage locations
        return `/api/files/${imagePath.replace(/^\/uploads\//, '')}`;
      }
    }
  }

  // Development or system-side: return relative path
  return imagePath;
}

export function buildImageUrl(filename: string, type: 'berita' | 'gallery' = 'berita'): string {
  const relativePath = `/uploads/${type}/${filename}`;
  return getImageUrl(relativePath);
}

export function isImageUrl(url: string): boolean {
  try {
    const imageUrl = new URL(url, window?.location.origin);
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => imageUrl.pathname.toLowerCase().endsWith(ext));
  } catch {
    return false;
  }
}

export function getImageErrorSrc(): string {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3EImage Not Found%3C/text%3E%3C/svg%3E';
}
