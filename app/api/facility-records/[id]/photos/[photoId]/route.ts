import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; photoId: string }> }
) {
    try {
        const { id: idStr, photoId: photoIdStr } = await params;
        const photoId = parseInt(photoIdStr);
        const facilityRecordId = parseInt(idStr);

        // Verify photo belongs to facility record
        const photo = await prisma.facilityRecordPhoto.findUnique({
            where: { id: photoId }
        });

        if (!photo || photo.facilityRecordId !== facilityRecordId) {
            return NextResponse.json(
                { error: 'Photo not found' },
                { status: 404 }
            );
        }

        await prisma.facilityRecordPhoto.delete({
            where: { id: photoId }
        });

        return NextResponse.json(
            { message: 'Photo deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting facility record photo:', error);
        return NextResponse.json(
            { error: 'Failed to delete facility record photo' },
            { status: 500 }
        );
    }
}
