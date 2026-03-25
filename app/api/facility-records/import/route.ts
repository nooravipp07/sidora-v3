import { NextRequest, NextResponse } from 'next/server';
import { FacilityRecordService } from '@/services/facility-record.service';
import { importFromExcel, parseExcelWithValidation } from '@/lib/excel-utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'File harus diunggah' }, { status: 400 });
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'Ukuran file maksimal 10MB' }, { status: 400 });
        }

        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            return NextResponse.json(
                { error: 'File harus berformat .xlsx atau .xls' },
                { status: 400 }
            );
        }

        // Parse Excel file
        const jsonData = await importFromExcel(file);

        if (jsonData.length === 0) {
            return NextResponse.json(
                { error: 'File Excel kosong' },
                { status: 400 }
            );
        }

        // Validate required columns
        const requiredColumns = ['Tahun', 'Prasarana', 'Desa/Kelurahan'];
        const firstRow = jsonData[0];
        const missingColumns = requiredColumns.filter(col => !Object.keys(firstRow).includes(col));

        if (missingColumns.length > 0) {
            return NextResponse.json(
                { error: `Kolom yang hilang: ${missingColumns.join(', ')}` },
                { status: 400 }
            );
        }

        // Get user info from request (you might want to pass this from frontend)
        const createdBy = formData.get('createdBy') as string | null;

        // Import data
        const result = await FacilityRecordService.importFromExcel(
            jsonData,
            createdBy || undefined
        );

        return NextResponse.json(
            {
                message: 'Import selesai',
                success: result.success,
                failed: result.failed,
                errors: result.errors,
                data: result.created
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error importing facility records:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Gagal mengimpor data' },
            { status: 500 }
        );
    }
}
