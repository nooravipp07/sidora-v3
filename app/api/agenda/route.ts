import { NextRequest, NextResponse } from 'next/server';
import { AgendaService } from '@/services/agenda.service';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const title = searchParams.get('title') || '';
        const startDate = searchParams.get('startDate');
        const location = searchParams.get('location');

        const result = await AgendaService.getAll(
            { title },
            { page, limit }
        );

        // Filter by startDate and location if provided
        let filteredData = result.data;
        if (startDate) {
            const date = new Date(startDate);
            filteredData = filteredData.filter((agenda: any) => {
                const agendaDate = new Date(agenda.startDate);
                return agendaDate.toDateString() === date.toDateString();
            });
        }

        if (location) {
            filteredData = filteredData.filter((agenda: any) =>
                agenda.location?.toLowerCase().includes(location.toLowerCase())
            );
        }

        const totalCount = filteredData.length;
        const totalPages = Math.ceil(totalCount / limit);

        // Paginate filtered results
        const start = (page - 1) * limit;
        const paginatedData = filteredData.slice(start, start + limit);

        return NextResponse.json({
            data: paginatedData,
            meta: {
                total: totalCount,
                page: page,
                limit: limit,
                totalPages: totalPages,
                hasMore: page < totalPages
            }
        }, { status: 200 });
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
        const { title, description, location, category, level, status, startDate, endDate, isAllDay } = body;

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
            category,
            level,
            status,
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
