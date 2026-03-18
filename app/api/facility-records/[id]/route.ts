import { NextRequest, NextResponse } from 'next/server';
import { FacilityRecordService } from '@/services/facility-record.service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid facility record ID' },
                { status: 400 }
            );
        }

        const facilityRecord = await FacilityRecordService.getById(id);

        if (!facilityRecord) {
            return NextResponse.json(
                { error: 'Facility record not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(facilityRecord, { status: 200 });
    } catch (error) {
        console.error('Error fetching facility record:', error);
        return NextResponse.json(
            { error: 'Failed to fetch facility record' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid facility record ID' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const {
            desaKelurahanId,
            prasaranaId,
            year,
            condition,
            ownershipStatus,
            address,
            notes,
            isActive
        } = body;

        const facilityRecord = await FacilityRecordService.update(id, {
            desaKelurahanId,
            prasaranaId,
            year,
            condition,
            ownershipStatus,
            address,
            notes,
            isActive
        });

        return NextResponse.json(facilityRecord, { status: 200 });
    } catch (error: any) {
        console.error('Error updating facility record:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Facility record not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: error.message || 'Failed to update facility record' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid facility record ID' },
                { status: 400 }
            );
        }

        await FacilityRecordService.delete(id);

        return NextResponse.json(
            { message: 'Facility record deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error deleting facility record:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Facility record not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to delete facility record' },
            { status: 500 }
        );
    }
}
