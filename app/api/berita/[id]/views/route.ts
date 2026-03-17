import { NextRequest, NextResponse } from 'next/server';
import { NewsService } from '@/services/news.service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsId = parseInt(id, 10);

    if (isNaN(newsId)) {
      return NextResponse.json(
        { error: 'Invalid news ID' },
        { status: 400 }
      );
    }

    // Increment views
    const updatedNews = await NewsService.incrementViews(newsId);

    return NextResponse.json({
      success: true,
      views: updatedNews.views
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    );
  }
}
