// Manual seed script for seeding database with test data
// Run with: node prisma/manual-seed.js

const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  try {
    // Create roles
    const adminRole = await prisma.role.create({
      data: {
        name: 'admin',
        description: 'Administrator - Full system access',
      },
    });

    const operatorRole = await prisma.role.create({
      data: {
        name: 'operator',
        description: 'Operator - Limited access',
      },
    });

    const userRole = await prisma.role.create({
      data: {
        name: 'user',
        description: 'User - View only access',
      },
    });

    // Hash passwords
    const adminPassword = await bcryptjs.hash('password123', 10);
    const operatorPassword = await bcryptjs.hash('password123', 10);
    const userPassword = await bcryptjs.hash('password123', 10);

    // Create users
    const admin = await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@example.com',
        password: adminPassword,
        roleId: adminRole.id,
        status: 1,
        namaLengkap: 'Admin System',
        noTelepon: '081234567890',
      },
    });

    const operator = await prisma.user.create({
      data: {
        name: 'Operator',
        email: 'operator@example.com',
        password: operatorPassword,
        roleId: operatorRole.id,
        status: 1,
        namaLengkap: 'Operator SIDORA',
        noTelepon: '082345678901',
      },
    });

    const user = await prisma.user.create({
      data: {
        name: 'User',
        email: 'user@example.com',
        password: userPassword,
        roleId: userRole.id,
        status: 1,
        namaLengkap: 'Regular User',
        noTelepon: '083456789012',
      },
    });

    // Seed Berita (News)
    const category = await prisma.category.create({
      data: {
        name: 'Olahraga',
        slug: 'olahraga',
      },
    });

    await prisma.news.create({
      data: {
        title: 'Kompetisi Olahraga Kabupaten Dengan Partisipasi Atlet Lokal',
        slug: 'kompetisi-olahraga-kabupaten',
        content: 'Kabupaten mengadakan kompetisi olahraga tahunan dengan berbagai cabang olahraga. Acara ini diikuti oleh atlet dari seluruh desa dan kelurahan. Kejuaraan ini merupakan ajang untuk mengasah kemampuan dan prestasi atlet lokal.',
        thumbnail: '/uploads/news-thumbnail-1.jpg',
        author: 'Admin',
        isPublished: true,
        publishedAt: new Date('2026-03-15'),
        categoryId: category.id,
        views: 125,
      },
    });

    await prisma.news.create({
      data: {
        title: 'Program Pembinaan Atlet Muda Dimulai Bulan Ini',
        slug: 'program-pembinaan-atlet-muda',
        content: 'Dinas Olahraga meluncurkan program khusus untuk pembinaan atlet muda berbakat. Program ini mencakup pelatihan intensif dan pemberian beasiswa kepada atlet berprestasi. Pendaftaran dibuka untuk usia 12-18 tahun di berbagai cabang olahraga.',
        thumbnail: '/uploads/news-thumbnail-2.jpg',
        author: 'Admin',
        isPublished: true,
        publishedAt: new Date('2026-03-10'),
        categoryId: category.id,
        views: 89,
      },
    });

    await prisma.news.create({
      data: {
        title: 'Pembukaan Stadion Olahraga Baru di Pusat Kota',
        slug: 'pembukaan-stadion-olahraga-baru',
        content: 'Pemerintah daerah meresmikan pembukaan stadion olahraga modern dengan fasilitas lengkap. Stadion ini dilengkapi dengan lapangan sepak bola, lapangan bulu tangkis, dan area latihan atlet. Fasilitas ini diharapkan dapat meningkatkan prestasi olahraga di tingkat lokal.',
        thumbnail: '/uploads/news-thumbnail-3.jpg',
        author: 'Admin',
        isPublished: true,
        publishedAt: new Date('2026-03-05'),
        categoryId: category.id,
        views: 234,
      },
    });

    // Seed Agenda
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

    await prisma.agenda.create({
      data: {
        title: 'Latihan Rutin Klub Olahraga Desa',
        description: 'Latihan rutin untuk semua anggota klub olahraga desa dengan fokus pada teknik dasar.',
        location: 'Lapangan Desa Makmur',
        category: 'Pelatihan',
        level: 'Lokal',
        status: 'Active',
        startDate: nextWeek,
        endDate: new Date(nextWeek.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
        isAllDay: false,
      },
    });

    await prisma.agenda.create({
      data: {
        title: 'Turnamen Badminton Antar Kecamatan',
        description: 'Turnamen badminton dengan peserta dari berbagai kecamatan untuk mengasah kemampuan.',
        location: 'Gedung Olahraga Kabupaten',
        category: 'Kompetisi',
        level: 'Daerah',
        status: 'Active',
        startDate: twoWeeksLater,
        endDate: new Date(twoWeeksLater.getTime() + 8 * 60 * 60 * 1000), // 8 hours later
        isAllDay: false,
      },
    });

    await prisma.agenda.create({
      data: {
        title: 'Seminar Pelatihan Olahraga Modern',
        description: 'Seminar dan workshop mengenai pelatihan olahraga menggunakan teknologi modern.',
        location: 'Kantor Dinas Olahraga',
        category: 'Event Komunitas',
        level: 'Lokal',
        status: 'Active',
        startDate: new Date(nextWeek.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days later
        endDate: new Date(nextWeek.getTime() + 10 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
        isAllDay: false,
      },
    });

    // Seed Galeri (Gallery)
    const gallery1 = await prisma.gallery.create({
      data: {
        title: 'Kompetisi Olahraga Kabupaten 2026',
        description: 'Koleksi foto-foto dari acara kompetisi olahraga kabupaten dengan berbagai cabang olahraga.',
        items: {
          create: [
            {
              imageUrl: 'https://images.pexels.com/photos/3945657/pexels-photo-3945657.jpeg?auto=compress&cs=tinysrgb&w=600',
              caption: 'Pertandingan Bulu Tangkis',
            },
            {
              imageUrl: 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=600',
              caption: 'Lapangan Sepak Bola',
            },
            {
              imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=600',
              caption: 'Pertandingan Basket',
            },
          ],
        },
      },
    });

    const gallery2 = await prisma.gallery.create({
      data: {
        title: 'Pembinaan Atlet Muda 2026',
        description: 'Dokumentasi program pembinaan atlet muda dan workshop pelatihan olahraga modern.',
        items: {
          create: [
            {
              imageUrl: 'https://images.pexels.com/photos/3771045/pexels-photo-3771045.jpeg?auto=compress&cs=tinysrgb&w=600',
              caption: 'Workshop Pelatih',
            },
            {
              imageUrl: 'https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&w=600',
              caption: 'Pelatihan Atletik Usia Dini',
            },
            {
              imageUrl: 'https://images.pexels.com/photos/3808286/pexels-photo-3808286.jpeg?auto=compress&cs=tinysrgb&w=600',
              caption: 'Sesi Latihan Renang',
            },
          ],
        },
      },
    });

    const gallery3 = await prisma.gallery.create({
      data: {
        title: 'Festival Olahraga Komunitas',
        description: 'Kegiatan festival olahraga komunitas dengan partisipasi masyarakat dari berbagai desa.',
        items: {
          create: [
            {
              imageUrl: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=600',
              caption: 'Festival Olahraga Daerah',
            },
            {
              imageUrl: 'https://images.pexels.com/photos/5382567/pexels-photo-5382567.jpeg?auto=compress&cs=tinysrgb&w=600',
              caption: 'Pertandingan Pencak Silat',
            },
            {
              imageUrl: 'https://images.pexels.com/photos/8436760/pexels-photo-8436760.jpeg?auto=compress&cs=tinysrgb&w=600',
              caption: 'Senam Sehat Bersama',
            },
          ],
        },
      },
    });

    console.log('✅ Seeding finished successfully!');
    console.log('\nTest Credentials:');
    console.log('- Admin:', admin.email, '/ password123');
    console.log('- Operator:', operator.email, '/ password123');
    console.log('- User:', user.email, '/ password123');
    console.log('\n📰 Seeded Data:');
    console.log('- 3 Berita (News) articles');
    console.log('- 3 Agenda events');
    console.log('- 3 Galeri (Gallery) collections with 9 total images');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
