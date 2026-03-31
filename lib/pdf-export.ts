import jsPDF from 'jspdf';

interface PDFGeneratorOptions {
  title: string;
  kecamatan: any;
  summary: any;
  data: any;
  year: number;
}

// Initialize autoTable when module loads
let autoTableLoaded = false;

async function ensureAutoTable(doc: any) {
  if (doc.autoTable) {
    return;
  }
  
  if (!autoTableLoaded) {
    try {
      // Use require to load autoTable plugin
      if (typeof window !== 'undefined') {
        // Browser environment - use dynamic import
        await import('jspdf-autotable');
      }
      autoTableLoaded = true;
    } catch (err) {
      console.error('Could not load autoTable plugin:', err);
      throw new Error('PDF generation library not available');
    }
  }
}

export async function generateDetailPDF(options: PDFGeneratorOptions) {
  const { title, kecamatan, summary, data, year } = options;
  
  // Create PDF document
  const doc: any = new jsPDF();
  
  // Ensure autoTable is loaded
  await ensureAutoTable(doc);
  
  if (!doc.autoTable) {
    throw new Error('autoTable function not found on jsPDF instance');
  }
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 10;
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;

  // Set default font
  doc.setFont('Arial', 'normal');

  // Header
  doc.setFontSize(18);
  doc.setTextColor(25, 103, 210); // Blue
  doc.text('LAPORAN DETAIL KECAMATAN', margin, yPos);
  yPos += 8;

  // District Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('Arial', 'bold');
  doc.text(`Kecamatan: ${kecamatan.nama}`, margin, yPos);
  yPos += 6;

  doc.setFont('Arial', 'normal');
  doc.setFontSize(10);
  doc.text(
    `Lokasi: Lat ${kecamatan.latitude || '-'}, Long ${kecamatan.longitude || '-'}`,
    margin,
    yPos
  );
  yPos += 6;
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, margin, yPos);
  yPos += 6;
  doc.text(`Tahun Data: ${year}`, margin, yPos);
  yPos += 10;

  // Summary Stats Section
  doc.setFontSize(12);
  doc.setFont('Arial', 'bold');
  doc.text('RINGKASAN STATISTIK', margin, yPos);
  yPos += 6;

  doc.setFont('Arial', 'normal');
  doc.setFontSize(10);

  const stats = [
    { label: 'Total Desa/Kelurahan', value: summary.totalDesaKelurahan },
    { label: 'Total Prasarana', value: summary.totalInfrastructure },
    { label: 'Total Sarana', value: summary.totalSarana },
    { label: 'Total Kelompok Olahraga', value: summary.totalSportsGroups },
    { label: 'Total Atlet', value: summary.totalAthletes },
    { label: 'Total Prestasi', value: summary.totalAchievement },
  ];

  const statsPerRow = 3;
  const statWidth = contentWidth / statsPerRow;
  const statHeight = 18;

  for (let i = 0; i < stats.length; i++) {
    const row = Math.floor(i / statsPerRow);
    const col = i % statsPerRow;
    const x = margin + col * statWidth;
    const y = yPos + row * statHeight;

    // Draw box
    doc.setDrawColor(200, 200, 200);
    doc.rect(x, y - 5, statWidth - 2, 15);

    // Draw text
    doc.setFont('Arial', 'bold');
    doc.setFontSize(11);
    doc.text(String(stats[i].value), x + statWidth / 2 - 2, y + 2, { align: 'center' });

    doc.setFont('Arial', 'normal');
    doc.setFontSize(8);
    doc.text(stats[i].label, x + 1, y + 7);
  }

  yPos += 40;

  // Check if we need a new page
  const checkPageBreak = (requiredHeight: number) => {
    if (yPos + requiredHeight > pageHeight - 10) {
      doc.addPage();
      yPos = 10;
    }
  };

  // Table: Kelompok Olahraga
  if (data.sportsGroups && data.sportsGroups.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(11);
    doc.setFont('Arial', 'bold');
    doc.text('DAFTAR KELOMPOK OLAHRAGA', margin, yPos);
    yPos += 5;

    const sportsTableData = data.sportsGroups.map((group: any, idx: number) => [
      (idx + 1).toString(),
      group.groupName || group.nama || '-',
      group.desaKelurahan?.nama || '-',
      group.year || '-',
      group.isVerified ? 'Terverifikasi' : 'Belum',
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['No', 'Nama Kelompok', 'Desa/Kelurahan', 'Tahun', 'Status']],
      body: sportsTableData,
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 40 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
      },
      headStyles: {
        fillColor: [25, 103, 210],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    yPos = doc.lastAutoTable.finalY + 5;
  }

  // Table: Prasarana
  if (data.facilityRecords && data.facilityRecords.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(11);
    doc.setFont('Arial', 'bold');
    doc.text('DAFTAR PRASARANA (FASILITAS)', margin, yPos);
    yPos += 5;

    const prasaranaTableData = data.facilityRecords.map((facility: any, idx: number) => [
      (idx + 1).toString(),
      facility.prasarana?.nama || '-',
      facility.desaKelurahan?.nama || '-',
      facility.photos?.length > 0
        ? `${facility.photos.length} foto`
        : 'Tidak ada foto',
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['No', 'Prasarana', 'Desa/Kelurahan', 'Foto']],
      body: prasaranaTableData,
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { cellWidth: 50 },
        3: { cellWidth: 35 },
      },
      headStyles: {
        fillColor: [230, 126, 34],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [255, 250, 240],
      },
    });

    yPos = doc.lastAutoTable.finalY + 5;
  }

  // Table: Sarana
  if (data.equipments && data.equipments.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(11);
    doc.setFont('Arial', 'bold');
    doc.text('DAFTAR SARANA', margin, yPos);
    yPos += 5;

    const saranaTableData = data.equipments.map((eq: any, idx: number) => [
      (idx + 1).toString(),
      eq.sarana?.nama || '-',
      eq.desaKelurahan?.nama || '-',
      (eq.quantity || 0).toString(),
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['No', 'Sarana', 'Desa/Kelurahan', 'Kuantitas']],
      body: saranaTableData,
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 75 },
        2: { cellWidth: 50 },
        3: { cellWidth: 20 },
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [240, 255, 240],
      },
    });

    yPos = doc.lastAutoTable.finalY + 5;
  }

  // Table: Atlet
  if (data.athletes && data.athletes.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(11);
    doc.setFont('Arial', 'bold');
    doc.text('DAFTAR ATLET', margin, yPos);
    yPos += 5;

    const athleteTableData = data.athletes.map((athlete: any, idx: number) => [
      (idx + 1).toString(),
      athlete.fullName || '-',
      athlete.category || '-',
      athlete.sport?.nama || '-',
      (athlete.achievements?.length || 0).toString(),
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['No', 'Nama', 'Kategori', 'Cabang Olahraga', `Prestasi (${year})`]],
      body: athleteTableData,
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30 },
        4: { cellWidth: 20 },
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
    });

    yPos = doc.lastAutoTable.finalY + 5;
  }

  // Footer
  const pageCount = doc.internal.pages.length;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  // Save PDF
  const fileName = `Laporan-Detail-${kecamatan.nama.replaceAll(' ', '-')}-${year}.pdf`;
  doc.save(fileName);
}
