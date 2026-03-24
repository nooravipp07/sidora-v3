// Script untuk check dan update kecamatanId di database
// Jalankan di Prisma Studio atau Node REPL

import { prisma } from '@/lib/prisma';

async function checkAndUpdateKecamatanId() {
  try {
    // Find user dengan id 6
    const user = await prisma.user.findUnique({
      where: { id: 6 },
    });

    console.log('User current data:', user);
    
    if (user && !user.kecamatanId) {
      // Update kecamatanId ke 1 (Kecamatan Ariasari)
      const updated = await prisma.user.update({
        where: { id: 6 },
        data: {
          kecamatanId: 1, // Update ke kecamatan id 1
        },
        select: {
          id: true,
          name: true,
          email: true,
          roleId: true,
          kecamatanId: true,
        },
      });

      console.log('User after update:', updated);
      console.log('kecamatanId berhasil diset ke:', updated.kecamatanId);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Uncomment untuk menjalankan:
// checkAndUpdateKecamatanId();
