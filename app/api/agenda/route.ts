import { NextRequest, NextResponse } from 'next/server';
import { AgendaService } from '@/services/agenda.service';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const title = searchParams.get('title') || '';

        const result = await AgendaService.getAll(
            { title },
            { page, limit }
        );

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching agenda:', error);
        return NextResponse.json(
            { error: 'Failed to fetch agenda' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, location, startDate, endDate, isAllDay } = body;

        if (!title?.trim()) {
            return NextResponse.json(
                { error: 'Judul agenda tidak boleh kosong' },
                { status: 400 }
            );
        }

        if (!startDate) {
            return NextResponse.json(
                { error: 'Tanggal mulai harus diisi' },
                { status: 400 }
            );
        }

        const agenda = await AgendaService.create({
            title,
            description,
            location,
            startDate,
            endDate,
            isAllDay
        });

        return NextResponse.json(agenda, { status: 201 });
    } catch (error) {
        console.error('Error creating agenda:', error);
        return NextResponse.json(
            { error: 'Failed to create agenda' },
            { status: 500 }
        );
    }
}
