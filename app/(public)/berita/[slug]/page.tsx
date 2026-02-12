import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Calendar, User, Clock } from 'lucide-react';
import { getNewsBySlug, newsData } from '@/lib/news/data';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = getNewsBySlug(slug);
  
  if (!news) {
    return {
      title: 'Berita Tidak Ditemukan',
      description: 'Berita yang Anda cari tidak ditemukan.',
    };
  }

  return {
    title: `${news.title} | SIDORA`,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: [
        {
          url: news.image,
          width: 1200,
          height: 630,
          alt: news.title,
        },
      ],
    },
  };
}

export function generateStaticParams() {
  return newsData.map((news) => ({
    slug: news.slug,
  }));
}

export const dynamicParams = true;

export default async function BeritaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/berita"
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
            news.category === 'Trending' ? 'bg-red-500' :
            news.category === 'Latest' ? 'bg-blue-500' :
            'bg-yellow-500'
          }`}>
            {news.category}
          </span>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={news.publishedAt}>
              {new Date(news.publishedAt).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          {news.author && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {news.author}
            </div>
          )}
          {news.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {news.readTime} min read
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 md:mb-8">
          {news.title}
        </h1>

        {/* Featured Image */}
        <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8 md:mb-12 shadow-lg">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-sm md:prose-base max-w-none mb-12">
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: news.content
            }}
          />
        </div>

        {/* Article Footer */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Kategori</p>
              <p className="text-lg font-semibold text-gray-900">{news.category}</p>
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
      <section className="bg-gray-50 border-t border-gray-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Berita Lainnya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsData
              .filter(item => item.id !== news.id)
              .slice(0, 3)
              .map((relatedNews) => (
                <Link
                  key={relatedNews.id}
                  href={`/berita/${relatedNews.slug}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="relative h-40 overflow-hidden bg-gray-200">
                    <Image
                      src={relatedNews.image}
                      alt={relatedNews.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {relatedNews.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(relatedNews.publishedAt).toLocaleDateString('id-ID', {
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
    </main>
  );
}
