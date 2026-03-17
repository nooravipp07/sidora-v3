export type NewsTag = {
  newsId: number;
  tagId: number;
  tag: Tag;
};

export type Tag = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type News = {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  author: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  categoryId: number | null;
  category?: Category | null;
  tags?: NewsTag[];
  createdAt: Date;
  updatedAt: Date;
};
