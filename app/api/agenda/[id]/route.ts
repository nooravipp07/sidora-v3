import { NextRequest, NextResponse } from 'next/server';
import { AgendaService } from '@/services/agenda.service';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const agendaId = parseInt(id);

        if (isNaN(agendaId)) {
            return NextResponse.json(
                { error: 'ID agenda tidak valid' },
                { status: 400 }
            );
        }

        const agenda = await AgendaService.getById(agendaId);

        if (!agenda) {
            return NextResponse.json(
                { error: 'Agenda tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json(agenda, { status: 200 });
    } catch (error) {
        console.error('Error fetching agenda:', error);
        return NextResponse.json(
            { error: 'Failed to fetch agenda' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const agendaId = parseInt(id);

        if (isNaN(agendaId)) {
            return NextResponse.json(
                { error: 'ID agenda tidak valid' },
                { status: 400 }
            );
        }

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

        const agenda = await AgendaService.update(agendaId, {
            title,
            description,
            location,
            startDate,
            endDate,
            isAllDay
        });

        return NextResponse.json(agenda, { status: 200 });
    } catch (error) {
        console.error('Error updating agenda:', error);
        return NextResponse.json(
            { error: 'Failed to update agenda' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const agendaId = parseInt(id);

        if (isNaN(agendaId)) {
            return NextResponse.json(
                { error: 'ID agenda tidak valid' },
                { status: 400 }
            );
        }

        await AgendaService.delete(agendaId);

        return NextResponse.json(
            { message: 'Agenda berhasil dihapus' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting agenda:', error);
        return NextResponse.json(
            { error: 'Failed to delete agenda' },
            { status: 500 }
        );
    }
}
