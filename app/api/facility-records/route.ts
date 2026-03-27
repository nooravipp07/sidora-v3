import { NextRequest, NextResponse } from 'next/server';
import { FacilityRecordService } from '@/services/facility-record.service';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const kecamatanId = searchParams.get('kecamatanId') ? parseInt(searchParams.get('kecamatanId')!) : undefined;
        const desaKelurahanId = searchParams.get('desaKelurahanId') ? parseInt(searchParams.get('desaKelurahanId')!) : undefined;
        const prasaranaId = searchParams.get('prasaranaId') ? parseInt(searchParams.get('prasaranaId')!) : undefined;
        const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
        const isActiveParam = searchParams.get('isActive');
        const isActive = isActiveParam ? isActiveParam === 'true' : undefined;

        const result = await FacilityRecordService.getAll(
            { kecamatanId, desaKelurahanId, prasaranaId, year, isActive },
            { page, limit }
        );

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching facility records:', error);
        return NextResponse.json(
            { error: 'Failed to fetch facility records' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            desaKelurahanId,
            prasaranaId,
            year,
            condition,
            ownershipStatus,
            address,
            notes,
            isActive,
            photos = [] // Accept photos array
        } = body;

        if (!desaKelurahanId || !prasaranaId || !year) {
            return NextResponse.json(
                { error: 'Desa/Kelurahan, prasarana, dan tahun tidak boleh kosong' },
                { status: 400 }
            );
        }

        // Validate each photo in the array
        if (Array.isArray(photos)) {
            for (const photo of photos) {
                if (!photo.fileUrl) {
                    return NextResponse.json(
                        { error: 'Setiap foto harus memiliki fileUrl' },
                        { status: 400 }
                    );
                }
            }
        }

        const facilityRecord = await FacilityRecordService.create({
            desaKelurahanId,
            prasaranaId,
            year,
            condition,
            ownershipStatus,
            address,
            notes,
            isActive
        }, photos);

        return NextResponse.json(facilityRecord, { status: 201 });
    } catch (error: any) {
        console.error('Error creating facility record:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create facility record' },
            { status: 500 }
        );
    }
}
