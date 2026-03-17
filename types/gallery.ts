export interface GalleryItem {
  id: number;
  galleryId: number;
  imageUrl: string;
  caption?: string;
  createdAt: Date;
}

export interface Gallery {
  id: number;
  title: string;
  description?: string;
  items: GalleryItem[];
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
