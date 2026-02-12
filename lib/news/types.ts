export type News = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  category: string;
  author?: string;
  readTime?: number;
};
