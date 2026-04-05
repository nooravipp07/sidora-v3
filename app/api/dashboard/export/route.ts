import { NextRequest, NextResponse } from 'next/server';
import { FacilityRecordService } from '@/services/facility-record.service';
import { EquipmentService } from '@/services/equipment.service';
import { AthleteService } from '@/services/athlete.service';
import { SportsGroupService } from '@/services/sports-group.service';
import * as XLSX from 'xlsx';

const athleteService = new AthleteService();

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
        const kecamatanId = searchParams.get('kecamatanId') ? parseInt(searchParams.get('kecamatanId')!) : undefined;

        if (!year || !kecamatanId) {
            return NextResponse.json(
                { error: 'Tahun dan Kecamatan harus diisi' },
                { status: 400 }
            );
        }

        // Get data from all services
        const [facilityData, equipmentData, athleteData, sportsGroupData] = await Promise.all([
            FacilityRecordService.exportToExcel({ year, kecamatanId }),
            EquipmentService.exportToExcel({ kecamatanId, year }),
            athleteService.exportToExcel({ kecamatanId }),
            SportsGroupService.exportToExcel({ kecamatanId, year })
        ]);

        // Create workbook
        const wb = XLSX.utils.book_new();

        // Add sheets
        if (facilityData.length > 0) {
            const facilityWs = XLSX.utils.json_to_sheet(facilityData);
            XLSX.utils.book_append_sheet(wb, facilityWs, 'Prasarana');
            facilityWs['!cols'] = [
                { wch: 5 }, // No
                { wch: 15 }, // Tahun
                { wch: 20 }, // Prasarana
                { wch: 20 }, // Desa/Kelurahan
                { wch: 15 }, // Kecamatan
                { wch: 15 }, // Kondisi
                { wch: 20 }, // Status Kepemilikan
                { wch: 25 }, // Alamat
                { wch: 20 }, // Catatan
                { wch: 10 }, // Aktif
                { wch: 15 }, // Dibuat Oleh
                { wch: 15 }, // Diperbarui Oleh
                { wch: 15 }, // Tanggal Dibuat
                { wch: 15 }, // Tanggal Diperbarui
            ];
        }

        if (equipmentData.length > 0) {
            const equipmentWs = XLSX.utils.json_to_sheet(equipmentData);
            XLSX.utils.book_append_sheet(wb, equipmentWs, 'Sarana');
            equipmentWs['!cols'] = [
                { wch: 5 }, // No
                { wch: 20 }, // Sarana
                { wch: 20 }, // Jenis Sarana
                { wch: 10 }, // Jumlah
                { wch: 10 }, // Satuan
                { wch: 15 }, // Layak Pakai
                { wch: 20 }, // Bantuan Pemerintah
                { wch: 10 }, // Tahun
                { wch: 20 }, // Desa/Kelurahan
                { wch: 15 }, // Kecamatan
                { wch: 15 }, // Tanggal Dibuat
                { wch: 15 }, // Tanggal Diperbarui
            ];
        }

        if (athleteData.length > 0) {
            const athleteWs = XLSX.utils.json_to_sheet(athleteData);
            XLSX.utils.book_append_sheet(wb, athleteWs, 'Atlet');
            athleteWs['!cols'] = [
                { wch: 5 }, // No
                { wch: 15 }, // NIK
                { wch: 25 }, // Nama Lengkap
                { wch: 20 }, // Tempat Lahir
                { wch: 15 }, // Tanggal Lahir
                { wch: 10 }, // Jenis Kelamin
                { wch: 15 }, // Organisasi
                { wch: 15 }, // Kategori
                { wch: 20 }, // Cabang Olahraga
                { wch: 25 }, // Alamat
                { wch: 20 }, // Desa/Kelurahan
                { wch: 15 }, // Kecamatan
                { wch: 10 }, // Status
                { wch: 20 }, // Prestasi
                { wch: 15 }, // Tanggal Dibuat
                { wch: 15 }, // Tanggal Diperbarui
            ];
        }

        if (sportsGroupData.length > 0) {
            const sportsGroupWs = XLSX.utils.json_to_sheet(sportsGroupData);
            XLSX.utils.book_append_sheet(wb, sportsGroupWs, 'Kelompok Olahraga');
            sportsGroupWs['!cols'] = [
                { wch: 5 }, // No
                { wch: 10 }, // Tahun
                { wch: 20 }, // Cabang Olahraga
                { wch: 25 }, // Nama Klub/Kelompok
                { wch: 20 }, // Nama Ketua
                { wch: 15 }, // Jumlah Anggota
                { wch: 15 }, // Verifikasi
                { wch: 20 }, // Nomor SK
                { wch: 25 }, // Alamat Sekretariat
                { wch: 20 }, // Desa/Kelurahan
                { wch: 15 }, // Kecamatan
                { wch: 15 }, // Tanggal Dibuat
                { wch: 15 }, // Tanggal Diperbarui
            ];
        }

        if (wb.SheetNames.length === 0) {
            return NextResponse.json(
                { error: 'Tidak ada data untuk diekspor' },
                { status: 404 }
            );
        }

        // Create buffer
        const arrayData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const buffer = Buffer.from(arrayData as any);

        // Set response headers
        const filename = `Dashboard_${year}_${new Date().getTime()}.xlsx`;
        return new NextResponse(buffer as any, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`,
            }
        });
    } catch (error) {
        console.error('Error exporting dashboard data:', error);
        return NextResponse.json(
            { error: 'Gagal mengekspor data' },
            { status: 500 }
        );
    }
}