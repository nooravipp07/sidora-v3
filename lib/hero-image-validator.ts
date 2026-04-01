/**
 * Hero Image Validator
 * Validasi gambar untuk hero slider dengan standar kualitas dan ukuran tertentu
 */

export interface ImageValidationResult {
  valid: boolean;
  errors: string[];
  width?: number;
  height?: number;
  fileSize?: number;
}

// Konfigurasi untuk hero section image
export const HERO_IMAGE_CONFIG = {
  // Minimum dimensions untuk hero slider
  MIN_WIDTH: 1200,
  MIN_HEIGHT: 500,
  
  // Maximum file size dalam bytes (10MB)
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  
  // Allowed MIME types
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  
  // Compression quality settings
  COMPRESSION_QUALITY: 0.8, // 0-1
  
  // Aspect ratio range untuk hero (lebar:tinggi)
  MIN_ASPECT_RATIO: 1.5, // minimum 1.5:1 (wider)
  MAX_ASPECT_RATIO: 3.0, // maximum 3:1 (very wide)
};

/**
 * Validasi file gambar sebelum upload
 * @param file File yang akan divalidasi
 * @returns ImageValidationResult dengan detail validasi
 */
export async function validateHeroImage(file: File): Promise<ImageValidationResult> {
  const errors: string[] = [];

  // 1. Check MIME type
  if (!HERO_IMAGE_CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) {
    errors.push(
      `Format gambar tidak didukung. Gunakan JPEG, PNG, atau WebP. (Diterima: ${file.type})`
    );
  }

  // 2. Check file size
  if (file.size > HERO_IMAGE_CONFIG.MAX_FILE_SIZE) {
    const maxSizeMB = HERO_IMAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    errors.push(
      `Ukuran gambar terlalu besar. Maksimal ${maxSizeMB}MB, file Anda: ${fileSizeMB}MB`
    );
  }

  let imageWidth = 0;
  let imageHeight = 0;

  // 3. Check image dimensions and aspect ratio
  try {
    const dimensions = await getImageDimensions(file);
    imageWidth = dimensions.width;
    imageHeight = dimensions.height;

    // Check minimum dimensions
    if (imageWidth < HERO_IMAGE_CONFIG.MIN_WIDTH) {
      errors.push(
        `Lebar gambar minimum ${HERO_IMAGE_CONFIG.MIN_WIDTH}px. Lebar gambar Anda: ${imageWidth}px`
      );
    }

    if (imageHeight < HERO_IMAGE_CONFIG.MIN_HEIGHT) {
      errors.push(
        `Tinggi gambar minimum ${HERO_IMAGE_CONFIG.MIN_HEIGHT}px. Tinggi gambar Anda: ${imageHeight}px`
      );
    }

    // Check aspect ratio
    const aspectRatio = imageWidth / imageHeight;
    if (
      aspectRatio < HERO_IMAGE_CONFIG.MIN_ASPECT_RATIO ||
      aspectRatio > HERO_IMAGE_CONFIG.MAX_ASPECT_RATIO
    ) {
      errors.push(
        `Proporsi gambar harus antara ${HERO_IMAGE_CONFIG.MIN_ASPECT_RATIO}:1 hingga ${HERO_IMAGE_CONFIG.MAX_ASPECT_RATIO}:1. ` +
        `Proporsi gambar Anda: ${aspectRatio.toFixed(2)}:1`
      );
    }
  } catch (error) {
    errors.push(`Gagal membaca dimensi gambar: ${(error as Error).message}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    width: imageWidth,
    height: imageHeight,
    fileSize: file.size,
  };
}

/**
 * Get image dimensions dari File object
 * Menggunakan buffer-based approach yang compatible dengan server-side
 */
async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  try {
    // Import image-size library secara dynamic
    const sizeOf = (await import('image-size')).default;
    
    // Convert File ke Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Get dimensions
    const dimensions = sizeOf(buffer);
    
    if (!dimensions || !dimensions.width || !dimensions.height) {
      throw new Error('Tidak dapat membaca dimensi gambar');
    }
    
    return {
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch (error) {
    throw new Error(`Gagal membaca dimensi gambar: ${(error as Error).message}`);
  }
}

/**
 * Get error message user-friendly
 */
export function getValidationErrorMessage(errors: string[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];
  return errors.join('\n');
}

/**
 * Format file size untuk display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
