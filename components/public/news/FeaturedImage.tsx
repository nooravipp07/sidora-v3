'use client';

import React, { useState } from 'react';
import { getImageUrl, getImageErrorSrc } from '@/lib/image-utils';

interface FeaturedImageProps {
  thumbnail: string | null;
  title: string;
}

export function FeaturedImage({ thumbnail, title }: FeaturedImageProps) {
  const [imageError, setImageError] = useState(false);

  if (!thumbnail) {
    return null;
  }

  const imageUrl = imageError ? getImageErrorSrc() : getImageUrl(thumbnail);

  return (
    <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8 md:mb-12 shadow-lg">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
