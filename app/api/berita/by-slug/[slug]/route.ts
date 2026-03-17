import { NextRequest, NextResponse } from 'next/server';
import { NewsService } from '@/services/news.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const news = await NewsService.getBySlug(slug);

    if (!news || !news.isPublished) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    // Format response
    const formatted = {
      id: news.id,
      title: news.title,
      slug: news.slug,
      content: news.content,
      thumbnail: news.thumbnail,
      views: news.views,
      publishedAt: news.publishedAt,
      createdAt: news.createdAt,
      category: news.category?.name || 'Uncategorized',
      author: news.author || 'Redaksi',
      excerpt: news.content.substring(0, 150) + '...',
      tags: news.tags.map(tag => tag.tag.name),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching news detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news detail' },
      { status: 500 }
    );
  }
}
