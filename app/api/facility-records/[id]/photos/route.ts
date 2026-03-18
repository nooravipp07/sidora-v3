import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const facilityRecordId = parseInt(idStr);

        const photos = await prisma.facilityRecordPhoto.findMany({
            where: { facilityRecordId },
            orderBy: { uploadedAt: 'desc' }
        });

        return NextResponse.json(photos, { status: 200 });
    } catch (error) {
        console.error('Error fetching facility record photos:', error);
        return NextResponse.json(
            { error: 'Failed to fetch facility record photos' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const facilityRecordId = parseInt(idStr);

        const body = await request.json();
        const {
            fileUrl,
            fileName,
            fileSize,
            mimeType,
            photoType,
            description,
            takenAt,
            uploadedBy,
            isPrimary
        } = body;

        if (!fileUrl) {
            return NextResponse.json(
                { error: 'Foto URL tidak boleh kosong' },
                { status: 400 }
            );
        }

        // Check if facility record exists
        const facilityRecord = await prisma.facilityRecord.findUnique({
            where: { id: facilityRecordId }
        });

        if (!facilityRecord) {
            return NextResponse.json(
                { error: 'Facility record not found' },
                { status: 404 }
            );
        }

        const photo = await prisma.facilityRecordPhoto.create({
            data: {
                facilityRecordId,
                fileUrl,
                fileName: fileName || null,
                fileSize: fileSize || null,
                mimeType: mimeType || null,
                photoType: photoType || null,
                description: description || null,
                takenAt: takenAt ? new Date(takenAt) : null,
                uploadedBy: uploadedBy || null,
                isPrimary: isPrimary || false
            }
        });

        return NextResponse.json(photo, { status: 201 });
    } catch (error) {
        console.error('Error creating facility record photo:', error);
        return NextResponse.json(
            { error: 'Failed to create facility record photo' },
            { status: 500 }
        );
    }
}
