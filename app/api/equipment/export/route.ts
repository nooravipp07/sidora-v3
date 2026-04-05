import { NextRequest, NextResponse } from 'next/server';
import { EquipmentService } from '@/services/equipment.service';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const kecamatanId = searchParams.get('kecamatanId') ? parseInt(searchParams.get('kecamatanId')!) : undefined;
        const desaKelurahanId = searchParams.get('desaKelurahanId') ? parseInt(searchParams.get('desaKelurahanId')!) : undefined;
        const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;

        if (!kecamatanId && !desaKelurahanId) {
            return NextResponse.json(
                { error: 'Kecamatan atau Desa/Kelurahan harus diisi' },
                { status: 400 }
            );
        }

        // Get Excel data from service
        const excelData = await EquipmentService.exportToExcel({
            kecamatanId,
            desaKelurahanId,
            year
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
        XLSX.utils.book_append_sheet(wb, ws, 'Data Peralatan');

        // Set column widths
        const columns = [
            'No', 'Sarana', 'Jenis Sarana', 'Jumlah', 'Satuan',
            'Layak Pakai', 'Bantuan Pemerintah', 'Tahun', 'Desa/Kelurahan', 'Kecamatan',
            'Tanggal Dibuat', 'Tanggal Diperbarui'
        ];
        ws['!cols'] = columns.map(() => ({ wch: 15 }));

        // Create buffer
        const arrayData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const buffer = Buffer.from(arrayData as any);

        // Set response headers
        const filename = `Peralatan_${new Date().getTime()}.xlsx`;
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
