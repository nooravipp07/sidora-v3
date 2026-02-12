import { Athlete, Achievement, Club, AthleteStats, ClubStats } from './types';

export const athleteData: Athlete[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    district: 'Kecamatan Utara',
    sport: 'Badminton',
    clubId: 'club-1',
    clubName: 'BC Maju Jaya',
    isActive: true
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    district: 'Kecamatan Selatan',
    sport: 'Tenis Meja',
    clubId: 'club-2',
    clubName: 'TM Cemerlang',
    isActive: true
  },
  {
    id: '3',
    name: 'Ahmad Wijaya',
    district: 'Kecamatan Timur',
    sport: 'Basket',
    clubId: 'club-3',
    clubName: 'BB Bintang',
    isActive: true
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    district: 'Kecamatan Barat',
    sport: 'Voli',
    clubId: 'club-4',
    clubName: 'VB Cahaya',
    isActive: true
  },
  {
    id: '5',
    name: 'Roni Hermawan',
    district: 'Kecamatan Pusat',
    sport: 'Atletik',
    clubId: 'club-5',
    clubName: 'Atletik Jaya',
    isActive: true
  },
  {
    id: '6',
    name: 'Nina Susanti',
    district: 'Kecamatan Utara',
    sport: 'Badminton',
    clubId: 'club-1',
    clubName: 'BC Maju Jaya',
    isActive: true
  },
  {
    id: '7',
    name: 'Hendra Kusuma',
    district: 'Kecamatan Selatan',
    sport: 'Sepak Bola',
    clubId: 'club-6',
    clubName: 'SB Pelita',
    isActive: true
  },
  {
    id: '8',
    name: 'Eka Putri',
    district: 'Kecamatan Timur',
    sport: 'Tenis',
    clubId: 'club-7',
    clubName: 'Tenis Prestasi',
    isActive: false
  },
  {
    id: '9',
    name: 'Gunawan Setiawan',
    district: 'Kecamatan Barat',
    sport: 'Renang',
    clubId: 'club-8',
    clubName: 'Renang Merdeka',
    isActive: true
  },
  {
    id: '10',
    name: 'Lina Marlina',
    district: 'Kecamatan Pusat',
    sport: 'Pencak Silat',
    clubId: 'club-9',
    clubName: 'PS Warisan',
    isActive: true
  },
  {
    id: '11',
    name: 'Doni Irawan',
    district: 'Kecamatan Utara',
    sport: 'Tenis Meja',
    clubId: 'club-2',
    clubName: 'TM Cemerlang',
    isActive: true
  },
  {
    id: '12',
    name: 'Yuli Rahmawati',
    district: 'Kecamatan Selatan',
    sport: 'Badminton',
    clubId: 'club-1',
    clubName: 'BC Maju Jaya',
    isActive: true
  },
  {
    id: '13',
    name: 'Bambang Irawan',
    district: 'Kecamatan Timur',
    sport: 'Basket',
    clubId: 'club-3',
    clubName: 'BB Bintang',
    isActive: true
  },
  {
    id: '14',
    name: 'Rini Handayani',
    district: 'Kecamatan Barat',
    sport: 'Voli',
    clubId: 'club-4',
    clubName: 'VB Cahaya',
    isActive: true
  },
  {
    id: '15',
    name: 'Marta Siahaan',
    district: 'Kecamatan Pusat',
    sport: 'Atletik',
    clubId: 'club-5',
    clubName: 'Atletik Jaya',
    isActive: true
  }
];

export const achievementData: Achievement[] = [
  {
    id: '1',
    athleteId: '1',
    athleteName: 'Budi Santoso',
    sport: 'Badminton',
    clubName: 'BC Maju Jaya',
    medal: 'gold',
    event: 'Kejuaraan Badminton Regional 2026',
    year: 2026,
    district: 'Kecamatan Utara'
  },
  {
    id: '2',
    athleteId: '2',
    athleteName: 'Siti Nurhaliza',
    sport: 'Tenis Meja',
    clubName: 'TM Cemerlang',
    medal: 'gold',
    event: 'Turnamen Tenis Meja Nasional 2025',
    year: 2025,
    district: 'Kecamatan Selatan'
  },
  {
    id: '3',
    athleteId: '3',
    athleteName: 'Ahmad Wijaya',
    sport: 'Basket',
    clubName: 'BB Bintang',
    medal: 'silver',
    event: 'Piala Basket Regional 2025',
    year: 2025,
    district: 'Kecamatan Timur'
  },
  {
    id: '4',
    athleteId: '4',
    athleteName: 'Dewi Lestari',
    sport: 'Voli',
    clubName: 'VB Cahaya',
    medal: 'bronze',
    event: 'Kejuaraan Voli Daerah 2025',
    year: 2025,
    district: 'Kecamatan Barat'
  },
  {
    id: '5',
    athleteId: '5',
    athleteName: 'Roni Hermawan',
    sport: 'Atletik',
    clubName: 'Atletik Jaya',
    medal: 'gold',
    event: 'Lari Marathon Regional 2026',
    year: 2026,
    district: 'Kecamatan Pusat'
  },
  {
    id: '6',
    athleteId: '6',
    athleteName: 'Nina Susanti',
    sport: 'Badminton',
    clubName: 'BC Maju Jaya',
    medal: 'silver',
    event: 'Kejuaraan Badminton Regional 2026',
    year: 2026,
    district: 'Kecamatan Utara'
  },
  {
    id: '7',
    athleteId: '7',
    athleteName: 'Hendra Kusuma',
    sport: 'Sepak Bola',
    clubName: 'SB Pelita',
    medal: 'gold',
    event: 'Piala Sepak Bola Nasional 2025',
    year: 2025,
    district: 'Kecamatan Selatan'
  },
  {
    id: '8',
    athleteId: '9',
    athleteName: 'Gunawan Setiawan',
    sport: 'Renang',
    clubName: 'Renang Merdeka',
    medal: 'bronze',
    event: 'Kejuaraan Renang Daerah 2025',
    year: 2025,
    district: 'Kecamatan Barat'
  },
  {
    id: '9',
    athleteId: '10',
    athleteName: 'Lina Marlina',
    sport: 'Pencak Silat',
    clubName: 'PS Warisan',
    medal: 'gold',
    event: 'Kejuaraan Pencak Silat Regional 2026',
    year: 2026,
    district: 'Kecamatan Pusat'
  },
  {
    id: '10',
    athleteId: '11',
    athleteName: 'Doni Irawan',
    sport: 'Tenis Meja',
    clubName: 'TM Cemerlang',
    medal: 'silver',
    event: 'Turnamen Tenis Meja Regional 2026',
    year: 2026,
    district: 'Kecamatan Utara'
  }
];

export const clubData: Club[] = [
  {
    id: 'club-1',
    name: 'BC Maju Jaya',
    district: 'Kecamatan Utara',
    sportCategory: 'Badminton',
    verified: true,
    totalAthletes: 24,
    activeAthletes: 22,
    totalMedals: 15
  },
  {
    id: 'club-2',
    name: 'TM Cemerlang',
    district: 'Kecamatan Selatan',
    sportCategory: 'Tenis Meja',
    verified: true,
    totalAthletes: 18,
    activeAthletes: 17,
    totalMedals: 12
  },
  {
    id: 'club-3',
    name: 'BB Bintang',
    district: 'Kecamatan Timur',
    sportCategory: 'Basket',
    verified: true,
    totalAthletes: 30,
    activeAthletes: 28,
    totalMedals: 8
  },
  {
    id: 'club-4',
    name: 'VB Cahaya',
    district: 'Kecamatan Barat',
    sportCategory: 'Voli',
    verified: true,
    totalAthletes: 25,
    activeAthletes: 24,
    totalMedals: 10
  },
  {
    id: 'club-5',
    name: 'Atletik Jaya',
    district: 'Kecamatan Pusat',
    sportCategory: 'Atletik',
    verified: true,
    totalAthletes: 40,
    activeAthletes: 38,
    totalMedals: 20
  },
  {
    id: 'club-6',
    name: 'SB Pelita',
    district: 'Kecamatan Selatan',
    sportCategory: 'Sepak Bola',
    verified: true,
    totalAthletes: 45,
    activeAthletes: 42,
    totalMedals: 18
  },
  {
    id: 'club-7',
    name: 'Tenis Prestasi',
    district: 'Kecamatan Timur',
    sportCategory: 'Tenis',
    verified: false,
    totalAthletes: 12,
    activeAthletes: 10,
    totalMedals: 5
  },
  {
    id: 'club-8',
    name: 'Renang Merdeka',
    district: 'Kecamatan Barat',
    sportCategory: 'Renang',
    verified: true,
    totalAthletes: 28,
    activeAthletes: 26,
    totalMedals: 14
  },
  {
    id: 'club-9',
    name: 'PS Warisan',
    district: 'Kecamatan Pusat',
    sportCategory: 'Pencak Silat',
    verified: true,
    totalAthletes: 35,
    activeAthletes: 33,
    totalMedals: 22
  }
];

export function getAthleteStats(): AthleteStats {
  const activeAthletes = athleteData.filter(a => a.isActive).length;
  const athletesWithAchievements = new Set(achievementData.map(a => a.athleteId)).size;
  const goldMedals = achievementData.filter(a => a.medal === 'gold').length;
  const silverMedals = achievementData.filter(a => a.medal === 'silver').length;
  const bronzeMedals = achievementData.filter(a => a.medal === 'bronze').length;

  return {
    totalAthletes: athleteData.length,
    activeAthletes,
    athletesWithAchievements,
    totalMedals: achievementData.length,
    goldMedals,
    silverMedals,
    bronzeMedals
  };
}

export function getClubStats(): ClubStats {
  const verifiedClubs = clubData.filter(c => c.verified).length;
  const clubsWithActiveAthletes = clubData.filter(c => c.activeAthletes > 0).length;
  const clubsWithMedals = clubData.filter(c => c.totalMedals > 0).length;

  return {
    totalClubs: clubData.length,
    verifiedClubs,
    clubsWithActiveAthletes,
    clubsWithMedals
  };
}

export function filterAchievements(
  medalFilter?: string,
  sportFilter?: string,
  yearFilter?: string,
  districtFilter?: string
): Achievement[] {
  return achievementData.filter(achievement => {
    let matches = true;

    if (medalFilter) {
      matches = matches && achievement.medal === medalFilter;
    }

    if (sportFilter) {
      matches = matches && achievement.sport === sportFilter;
    }

    if (yearFilter) {
      matches = matches && achievement.year === parseInt(yearFilter);
    }

    if (districtFilter) {
      matches = matches && achievement.district === districtFilter;
    }

    return matches;
  });
}

export function filterClubs(
  districtFilter?: string,
  sportCategoryFilter?: string,
  statusFilter?: string
): Club[] {
  return clubData.filter(club => {
    let matches = true;

    if (districtFilter) {
      matches = matches && club.district === districtFilter;
    }

    if (sportCategoryFilter) {
      matches = matches && club.sportCategory === sportCategoryFilter;
    }

    if (statusFilter) {
      if (statusFilter === 'verified') {
        matches = matches && club.verified;
      } else if (statusFilter === 'pending') {
        matches = matches && !club.verified;
      }
    }

    return matches;
  });
}

export function getSports(): string[] {
  return Array.from(new Set(achievementData.map(a => a.sport))).sort();
}

export function getSportCategories(): string[] {
  return Array.from(new Set(clubData.map(c => c.sportCategory))).sort();
}

export function getDistricts(): string[] {
  return Array.from(new Set([
    ...achievementData.map(a => a.district),
    ...clubData.map(c => c.district)
  ])).sort();
}

export function getYears(): number[] {
  return Array.from(new Set(achievementData.map(a => a.year))).sort((a, b) => b - a);
}
