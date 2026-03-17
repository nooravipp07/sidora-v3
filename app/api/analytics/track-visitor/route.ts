import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const {
      sessionId,
      page,
      referrer,
      deviceType
    } = await request.json();

    // Validate required fields
    if (!sessionId || !page) {
      return NextResponse.json(
        { error: 'sessionId and page are required' },
        { status: 400 }
      );
    }

    // Get IP address and user agent from request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent');

    // Create visitor record
    await prisma.visitor.create({
      data: {
        sessionId,
        ipAddress,
        userAgent,
        page,
        referrer,
        deviceType,
      }
    });

    return NextResponse.json(
      { success: true, message: 'Visitor tracked successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}
