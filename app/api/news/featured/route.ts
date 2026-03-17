import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Berita Terpopuler - berdasarkan views tertinggi
    const popularNews = await prisma.news.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        content: true,
        views: true,
        createdAt: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        views: 'desc',
      },
      take: 3,
    });

    // Berita Trending - berdasarkan updated terbaru
    const trendingNews = await prisma.news.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        content: true,
        views: true,
        updatedAt: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 3,
    });

    // Berita Terbaru - berdasarkan created date terbaru
    const latestNews = await prisma.news.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        content: true,
        views: true,
        createdAt: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    // Format response data
    const formatNews = (news: any[], category: string) => {
      return news.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        thumbnail: item.thumbnail,
        excerpt: item.content.substring(0, 150) + '...',
        content: item.content,
        category: category,
        categoryName: item.category?.name || 'Uncategorized',
        views: item.views,
        date: new Date(item.createdAt || item.updatedAt).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        publishedAt: item.publishedAt?.toISOString() || new Date().toISOString(),
        tags: [],
      }));
    };

    return NextResponse.json({
      popular: formatNews(popularNews, 'Popular'),
      trending: formatNews(trendingNews, 'Trending'),
      latest: formatNews(latestNews, 'Latest'),
    });
  } catch (error) {
    console.error('Error fetching featured news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured news' },
      { status: 500 }
    );
  }
}
