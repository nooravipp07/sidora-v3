import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Calendar, User, Eye } from 'lucide-react';
import { notFound } from 'next/navigation';
import { DetailArticleTracker } from '@/components/public/news/DetailArticleTracker';
import { ArticleContentRenderer } from '@/components/public/news/ArticleContentRenderer';
import { getImageUrl } from '@/lib/image-utils';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getNewsBySlug(slug: string) {
  try {
    const news = await prisma.news.findUnique({
      where: { slug },
      include: { category: true, tags: { include: { tag: true } } }
    });
    return news;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  
  if (!news) {
    return {
      title: 'Berita Tidak Ditemukan',
      description: 'Berita yang Anda cari tidak ditemukan.',
    };
  }

  return {
    title: `${news.title} | SIDORA`,
    description: news.content.substring(0, 160),
    openGraph: {
      title: news.title,
      description: news.content.substring(0, 160),
      images: [
        {
          url: news.thumbnail || 'https://via.placeholder.com/1200x630',
          width: 1200,
          height: 630,
          alt: news.title,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  try {
    const allNews = await prisma.news.findMany({
      where: { isPublished: true, deletedAt: null },
      select: { slug: true },
      take: 100
    });
    return allNews.map((news) => ({
      slug: news.slug,
    }));
  } catch (error) {
    return [];
  }
}

export const dynamicParams = true;

// Helper function for consistent date formatting
function formatDateIndonesian(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(date).toLocaleDateString('id-ID', options);
}

export default async function BeritaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news || !news.isPublished) {
    notFound();
  }

  const readTime = Math.ceil(news.content.split(' ').length / 200);

  return (
    <main className="min-h-screen bg-white">
      <DetailArticleTracker slug={slug} newsId={news.id} />
      
      {/* Back Button */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/berita"
            prefetch={false}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Berita
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Meta Info */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
            news.category?.name === 'Trending' ? 'bg-red-500' :
            news.category?.name === 'Latest' ? 'bg-blue-500' :
            'bg-yellow-500'
          }`}>
            {news.category?.name || 'Uncategorized'}
          </span>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={news.publishedAt?.toISOString()}>
              {news.publishedAt ? formatDateIndonesian(news.publishedAt) : 'Tanpa tanggal'}
            </time>
          </div>
          {news.author && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {news.author}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {news.views} dibaca
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 md:mb-8">
          {news.title}
        </h1>

        {/* Featured Image */}
        {news.thumbnail && (
          <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8 md:mb-12 shadow-lg">
            <img
              src={getImageUrl(news.thumbnail)}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-sm md:prose-base max-w-none mb-12">
          <ArticleContentRenderer content={news.content} />
        </div>

        {/* Article Footer */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Kategori</p>
              <p className="text-lg font-semibold text-gray-900">{news.category?.name || 'Uncategorized'}</p>
            </div>
            <Link
              href="/berita"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold whitespace-nowrap"
            >
              Kembali ke Berita
            </Link>
          </div>
        </div>
      </article>

      {/* Related Articles Section */}
      <RelatedArticlesSection currentNewsId={news.id} />
    </main>
  );
}

interface RelatedArticleProps {
  currentNewsId: number;
}

async function RelatedArticlesSection({ currentNewsId }: RelatedArticleProps) {
  try {
    const relatedNews = await prisma.news.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
        id: {
          not: currentNewsId
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        publishedAt: true,
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 3
    });

    if (relatedNews.length === 0) {
      return null;
    }

    return (
      <section className="bg-gray-50 border-t border-gray-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Berita Lainnya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNews.map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                prefetch={false}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  {item.thumbnail && item.thumbnail.trim() ? (
                    <img
                      src={getImageUrl(item.thumbnail)}
                      alt={item.title}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Tidak ada gambar</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.publishedAt.toLocaleDateString('id-ID', {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit'
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return null;
  }
}
