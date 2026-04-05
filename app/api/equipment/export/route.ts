import { NextRequest, NextResponse } from 'next/server';
import { SaranaService } from '@/services/sarana.service';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const kecamatanId = searchParams.get('kecamatanId') ? parseInt(searchParams.get('kecamatanId')!) : undefined;
        const desaKelurahanId = searchParams.get('desaKelurahanId') ? parseInt(searchParams.get('desaKelurahanId')!) : undefined;

        if (!kecamatanId && !desaKelurahanId) {
            return NextResponse.json(
                { error: 'Kecamatan atau Desa/Kelurahan harus diisi' },
                { status: 400 }
            );
        }

        // Get Excel data from service
        const excelData = await SaranaService.exportToExcel({
            kecamatanId,
            desaKelurahanId
        });

        if (excelData.length === 0) {
            return NextResponse.json(
                { error: 'Tidak ada data untuk diekspor' },
                { status: 404 }
            );
        }

        // Create Excel file
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data Sarana');

        // Set column widths
        const columns = [
            'No', 'Tahun', 'Sarana', 'Jumlah', 'Satuan',
            'Dapat Digunakan', 'Hibah Pemerintah', 'Desa/Kelurahan', 'Kecamatan',
            'Tanggal Dibuat', 'Tanggal Diperbarui'
        ];
        ws['!cols'] = columns.map(() => ({ wch: 15 }));

        // Create buffer
        const arrayData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const buffer = Buffer.from(arrayData as any);

        // Set response headers
        const filename = `Sarana_${new Date().getTime()}.xlsx`;
        return new NextResponse(buffer as any, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`,
            }
        });
    } catch (error) {
        console.error('Error exporting equipment data:', error);
        return NextResponse.json(
            { error: 'Gagal mengekspor data' },
            { status: 500 }
        );
    }
}
