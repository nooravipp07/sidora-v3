/**
 * Mock Data for Sports Group Analytics
 * Production-ready mock data for testing and development
 */

import { SportsGroup } from './utils';

/**
 * Generate mock sports group data
 * Includes realistic distribution across regions, verification states, dates, and member counts
 */
export function generateMockSportsGroupData(count: number = 250): SportsGroup[] {
  const groupNameTemplates = [
    'Kelompok',
    'Tim',
    'Komunitas',
    'Perkumpulan',
    'Organisasi',
    'Badan',
  ];
  const sports = [
    'Bulu Tangkis',
    'Sepak Bola',
    'Voli',
    'Tenis Meja',
    'Basket',
    'Renang',
    'Lari Marathon',
    'Sepeda',
    'Badminton',
    'Tarung Derajat',
  ];
  const leaders = [
    'Ahmad Syaiful',
    'Budi Santoso',
    'Cahya Pratama',
    'Desa Wijaya',
    'Eka Rahman',
    'Fajar Hidayat',
    'Gita Maharani',
    'Hendra Kusuma',
    'Indra Setiawan',
    'Joko Widodo',
  ];

  const groups: SportsGroup[] = [];

  for (let i = 0; i < count; i++) {
    const regionId = Math.floor(Math.random() * 8) + 1; // 8 regions
    const sportIndex = Math.floor(Math.random() * sports.length);
    const leaderIndex = Math.floor(Math.random() * leaders.length);

    // Create realistic date distribution (past 5 years)
    const now = new Date();
    const startDate = new Date(now.getFullYear() - 5, 0, 1);
    const randomDays = Math.floor(
      Math.random() * (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const createdAt = new Date(startDate.getTime() + randomDays * 24 * 60 * 60 * 1000);

    // Weighted verification: 70% verified, 30% unverified
    const isVerified = Math.random() < 0.7;

    // Member count with realistic distribution
    // More groups in lower ranges, fewer in higher
    let memberCount: number;
    const rand = Math.random();
    if (rand < 0.35) memberCount = Math.floor(Math.random() * 11);
    else if (rand < 0.55) memberCount = Math.floor(Math.random() * 10) + 11;
    else if (rand < 0.70) memberCount = Math.floor(Math.random() * 30) + 21;
    else if (rand < 0.85) memberCount = Math.floor(Math.random() * 50) + 51;
    else memberCount = Math.floor(Math.random() * 200) + 101; // Outliers

    groups.push({
      id: i + 1,
      desaKelurahanId: regionId,
      groupName: `${groupNameTemplates[i % groupNameTemplates.length]} ${sports[sportIndex]} ${regionId}-${String((i % 20) + 1).padStart(2, '0')}`,
      leaderName: leaders[leaderIndex],
      memberCount,
      isVerified,
      decreeNumber: isVerified ? `SK-${now.getFullYear()}-${String((i % 1000) + 1).padStart(4, '0')}` : undefined,
      secretariatAddress: `Jl. ${sports[sportIndex]} No. ${i + 1}, Wilayah ${regionId}`,
      createdAt,
    });
  }

  return groups;
}

/**
 * Generate region mapping (desaKelurahanId -> region name)
 * Simulates database lookup
 */
export function generateRegionMapping(): Map<number, string> {
  const regions = [
    'Kecamatan Sepatan',
    'Kecamatan Sepatan Timur',
    'Kecamatan Tigaraksa',
    'Kecamatan Kemiri',
    'Kecamatan Rajeg',
    'Kecamatan Teluk Naga',
    'Kecamatan Teluknaga',
    'Kecamatan Tangerang',
  ];

  const map = new Map<number, string>();
  regions.forEach((region, idx) => {
    map.set(idx + 1, region);
  });

  return map;
}

/**
 * Example mock data exports for immediate use
 */
export const MOCK_SPORTS_GROUPS = generateMockSportsGroupData(250);
export const MOCK_REGION_MAPPING = generateRegionMapping();
