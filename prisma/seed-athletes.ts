// Seed script for athletes test data
// Run with: npx tsx prisma/seed-athletes.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAthletes() {
  console.log('Start seeding athletes...');

  try {
    // First, ensure we have a DesaKelurahan
    let desa = await prisma.desaKelurahan.findFirst();
    
    if (!desa) {
      // Create a Kecamatan if needed
      let kecamatan = await prisma.kecamatan.findFirst();
      if (!kecamatan) {
        kecamatan = await prisma.kecamatan.create({
          data: {
            nama: 'Kecamatan Test',
          },
        });
      }

      desa = await prisma.desaKelurahan.create({
        data: {
          kecamatanId: kecamatan.id,
          nama: 'Desa Test',
          tipe: 'Desa',
        },
      });
    }

    // First, get or create a sport
    let sport = await prisma.cabangOlahraga.findFirst();
    if (!sport) {
      sport = await prisma.cabangOlahraga.create({
        data: {
          nama: 'Olahraga Umum',
        },
      });
    }

    // Clear existing athletes (be careful in production!)
    // Also clear achievements
    await prisma.athleteAchievement.deleteMany({});
    await prisma.athlete.deleteMany({});

    // Seed KONI athletes
    const koniAthletes = [
      {
        nationalId: 'KONI001',
        fullName: 'Andi Setiawan',
        birthPlace: 'Bandung',
        birthDate: new Date('1995-05-15'),
        gender: 'Laki-laki',
        desaKelurahanId: desa.id,
        organization: 'KONI',
        category: 'ATLET',
        sportId: sport?.id,
        status: 'aktif',
      },
      {
        nationalId: 'KONI002',
        fullName: 'Budi Raharjo',
        birthPlace: 'Bandung',
        birthDate: new Date('1992-08-20'),
        gender: 'Laki-laki',
        desaKelurahanId: desa.id,
        organization: 'KONI',
        category: 'ATLET',
        sportId: sport?.id,
        status: 'aktif',
      },
      {
        nationalId: 'KONI003',
        fullName: 'Siti Nurhaliza',
        birthPlace: 'Bandung',
        birthDate: new Date('1998-02-10'),
        gender: 'Perempuan',
        desaKelurahanId: desa.id,
        organization: 'KONI',
        category: 'ATLET',
        sportId: sport?.id,
        status: 'aktif',
      },
      {
        nationalId: 'KONI004',
        fullName: 'Roni Hermawan',
        birthPlace: 'Bandung',
        birthDate: new Date('1988-11-25'),
        gender: 'Laki-laki',
        desaKelurahanId: desa.id,
        organization: 'KONI',
        category: 'PELATIH',
        sportId: sport?.id,
        status: 'aktif',
      },
      {
        nationalId: 'KONI005',
        fullName: 'Dina Permata',
        birthPlace: 'Bandung',
        birthDate: new Date('1990-06-30'),
        gender: 'Perempuan',
        desaKelurahanId: desa.id,
        organization: 'KONI',
        category: 'PELATIH',
        sportId: sport?.id,
        status: 'aktif',
      },
      {
        nationalId: 'KONI006',
        fullName: 'Budi Kartiko',
        birthPlace: 'Bandung',
        birthDate: new Date('1985-03-18'),
        gender: 'Laki-laki',
        desaKelurahanId: desa.id,
        organization: 'KONI',
        category: 'WASIT',
        sportId: sport?.id,
        status: 'aktif',
      },
    ];

    // Seed NPCI athletes
    const npciAthletes = [
      {
        nationalId: 'NPCI001',
        fullName: 'Ahmad Dahlan',
        birthPlace: 'Jakarta',
        birthDate: new Date('1996-07-12'),
        gender: 'Laki-laki',
        desaKelurahanId: desa.id,
        organization: 'NPCI',
        category: 'ATLET',
        sportId: sport?.id,
        status: 'aktif',
      },
      {
        nationalId: 'NPCI002',
        fullName: 'Farida Hanum',
        birthPlace: 'Jakarta',
        birthDate: new Date('1999-09-22'),
        gender: 'Perempuan',
        desaKelurahanId: desa.id,
        organization: 'NPCI',
        category: 'ATLET',
        sportId: sport?.id,
        status: 'aktif',
      },
      {
        nationalId: 'NPCI003',
        fullName: 'Iwan Sugito',
        birthPlace: 'Jakarta',
        birthDate: new Date('1993-01-14'),
        gender: 'Laki-laki',
        desaKelurahanId: desa.id,
        organization: 'NPCI',
        category: 'ATLET',
        sportId: sport?.id,
        status: 'aktif',
      },
      {
        nationalId: 'NPCI004',
        fullName: 'Yudi Pranoto',
        birthPlace: 'Jakarta',
        birthDate: new Date('1987-04-28'),
        gender: 'Laki-laki',
        desaKelurahanId: desa.id,
        organization: 'NPCI',
        category: 'PELATIH',
        sportId: sport?.id,
        status: 'aktif',
      },
      {
        nationalId: 'NPCI005',
        fullName: 'Ani Wijaya',
        birthPlace: 'Jakarta',
        birthDate: new Date('1991-10-05'),
        gender: 'Perempuan',
        desaKelurahanId: desa.id,
        organization: 'NPCI',
        category: 'PELATIH',
        sportId: sport?.id,
        status: 'aktif',
      },
      {
        nationalId: 'NPCI006',
        fullName: 'Hendra Sutrisno',
        birthPlace: 'Jakarta',
        birthDate: new Date('1984-12-11'),
        gender: 'Laki-laki',
        desaKelurahanId: desa.id,
        organization: 'NPCI',
        category: 'WASIT',
        sportId: sport?.id,
        status: 'aktif',
      },
    ];

    // Create athletes
    const athletes = await prisma.athlete.createMany({
      data: [...koniAthletes, ...npciAthletes],
    });

    // Fetch created athletes to get their IDs for achievements
    const createdAthletes = await prisma.athlete.findMany({
      where: {
        nationalId: {
          in: [...koniAthletes, ...npciAthletes].map(a => a.nationalId)
        }
      }
    });

    // Create achievements/medals for athletes
    const achievements = [];
    
    // KONI athletes achievements
    for (const athlete of createdAthletes.filter(a => a.organization === 'KONI')) {
      if (athlete.category === 'ATLET') {
        achievements.push({
          athleteId: athlete.id,
          achievementName: 'Juara Regional 2024',
          category: athlete.category,
          medal: 'EMAS',
          year: 2024,
        });
        achievements.push({
          athleteId: athlete.id,
          achievementName: 'Juara Provinsi 2024',
          category: athlete.category,
          medal: 'PERAK',
          year: 2024,
        });
      }
    }

    // NPCI athletes achievements
    for (const athlete of createdAthletes.filter(a => a.organization === 'NPCI')) {
      if (athlete.category === 'ATLET') {
        achievements.push({
          athleteId: athlete.id,
          achievementName: 'Juara Nasional 2024',
          category: athlete.category,
          medal: 'EMAS',
          year: 2024,
        });
        achievements.push({
          athleteId: athlete.id,
          achievementName: 'Juara Regional 2024',
          category: athlete.category,
          medal: 'PERUNGGU',
          year: 2024,
        });
      }
    }

    // Create achievements
    if (achievements.length > 0) {
      await prisma.athleteAchievement.createMany({
        data: achievements,
      });
    }

    console.log('✅ Athletes seeding finished');
    console.log(`Total KONI athletes: ${koniAthletes.length}`);
    console.log(`Total NPCI athletes: ${npciAthletes.length}`);
    console.log(`Total athletes: ${koniAthletes.length + npciAthletes.length}`);
    console.log(`Total achievements: ${achievements.length}`);
  } catch (error) {
    console.error('Error seeding athletes:', error);
    throw error;
  }
}

seedAthletes()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
