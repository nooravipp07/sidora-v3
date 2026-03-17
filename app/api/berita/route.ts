import { NextRequest, NextResponse } from 'next/server';
import { NewsService } from '@/services/news.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const title = searchParams.get('title') || undefined;
    const isPublished = searchParams.get('isPublished') === 'true' ? true : searchParams.get('isPublished') === 'false' ? false : true; // Default to published on public page

    const result = await NewsService.getAll(
      { title, isPublished },
      { page, limit }
    );

    // Transform to match frontend expectations
    const transformedItems = result.data.map((news: any) => ({
      id: news.id,
      title: news.title,
      slug: news.slug,
      thumbnail: news.thumbnail,
      excerpt: news.content.substring(0, 150) + '...',
      content: news.content,
      category: news.category?.name || 'Uncategorized',
      views: news.views,
      date: new Date(news.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      publishedAt: news.publishedAt?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json({
      items: transformedItems,
      currentPage: result.meta.page,
      totalPages: result.meta.totalPages,
      totalCount: result.meta.total
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await NewsService.create(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}
