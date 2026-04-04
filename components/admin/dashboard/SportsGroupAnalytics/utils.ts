/**
 * Data Transformation Utilities for Sports Group Analytics
 * Production-ready utilities for aggregating and processing sports group data
 */

export interface SportsGroup {
  id: number;
  desaKelurahanId: number;
  groupName: string;
  leaderName?: string;
  memberCount: number;
  isVerified: boolean;
  decreeNumber?: string;
  secretariatAddress?: string;
  createdAt?: Date;
}

export interface DesaKelurahan {
  id: number;
  name: string;
}

// ============================================================================
// 1. DISTRIBUTION BY REGION (Kecamatan)
// ============================================================================

export interface RegionGroupData {
  regionId: number;
  regionName: string;
  totalGroups: number;
}

/**
 * Aggregate groups by region with optional mapping
 * Returns top N regions sorted descending by group count
 */
export function aggregateGroupsByRegion(
  groups: SportsGroup[],
  regionMap?: Map<number, string>,
  limit: number = 10
): RegionGroupData[] {
  if (!groups || groups.length === 0) return [];

  const regionMap_local = new Map<number, number>();

  groups.forEach((group) => {
    const count = regionMap_local.get(group.desaKelurahanId) || 0;
    regionMap_local.set(group.desaKelurahanId, count + 1);
  });

  const result: RegionGroupData[] = Array.from(regionMap_local.entries())
    .map(([regionId, totalGroups]) => ({
      regionId,
      regionName: regionMap?.get(regionId) || `Region ${regionId}`,
      totalGroups,
    }))
    .sort((a, b) => b.totalGroups - a.totalGroups)
    .slice(0, limit);

  return result;
}

// ============================================================================
// 2. VERIFIED VS UNVERIFIED
// ============================================================================

export interface VerificationStats {
  verified: number;
  unverified: number;
  verifiedPercent: number;
  unverifiedPercent: number;
}

/**
 * Calculate verification statistics
 */
export function calculateVerificationStats(groups: SportsGroup[]): VerificationStats {
  if (!groups || groups.length === 0) {
    return {
      verified: 0,
      unverified: 0,
      verifiedPercent: 0,
      unverifiedPercent: 0,
    };
  }

  const verified = groups.filter((g) => g.isVerified).length;
  const unverified = groups.length - verified;

  return {
    verified,
    unverified,
    verifiedPercent: Math.round((verified / groups.length) * 100),
    unverifiedPercent: Math.round((unverified / groups.length) * 100),
  };
}

// ============================================================================
// 3. GROWTH TREND
// ============================================================================

export interface GrowthTrendData {
  period: string;
  count: number;
  year?: number;
  month?: number;
}

type GroupingPeriod = 'year' | 'month';

/**
 * Aggregate groups by time period
 * Automatically selects month if data is dense (>12 entries for years)
 */
export function calculateGrowthTrend(
  groups: SportsGroup[],
  period?: GroupingPeriod
): GrowthTrendData[] {
  if (!groups || groups.length === 0) return [];

  const groupsWithDate = groups.filter((g) => g.createdAt);
  if (groupsWithDate.length === 0) return [];

  // Auto-detect period if not specified
  let selectedPeriod = period;
  if (!selectedPeriod) {
    const yearCounts = new Set(
      groupsWithDate.map((g) => new Date(g.createdAt!).getFullYear())
    );
    selectedPeriod = yearCounts.size > 12 ? 'month' : 'year';
  }

  const periodMap = new Map<string, number>();
  const periodMetadata = new Map<string, { year?: number; month?: number }>();

  groupsWithDate.forEach((group) => {
    const date = new Date(group.createdAt!);
    let periodKey: string;
    let metadata: { year?: number; month?: number } = {};

    if (selectedPeriod === 'year') {
      const year = date.getFullYear();
      periodKey = `${year}`;
      metadata = { year };
    } else {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      periodKey = `${year}-${String(month).padStart(2, '0')}`;
      metadata = { year, month };
    }

    periodMap.set(periodKey, (periodMap.get(periodKey) || 0) + 1);
    periodMetadata.set(periodKey, metadata);
  });

  const result: GrowthTrendData[] = Array.from(periodMap.entries())
    .map(([period, count]) => ({
      period,
      count,
      ...periodMetadata.get(period),
    }))
    .sort((a, b) => a.period.localeCompare(b.period));

  return result;
}

// ============================================================================
// 4. MEMBER COUNT DISTRIBUTION
// ============================================================================

export interface MemberCountBin {
  label: string;
  range: [number, number];
  count: number;
  groupNames: string[];
}

const MEMBER_COUNT_BINS = [
  { label: '0-10', range: [0, 10] as [number, number] },
  { label: '11-20', range: [11, 20] as [number, number] },
  { label: '21-50', range: [21, 50] as [number, number] },
  { label: '51-100', range: [51, 100] as [number, number] },
  { label: '100+', range: [100, Infinity] as [number, number] },
];

/**
 * Distribute groups into member count bins
 * Includes metadata for identifying outliers
 */
export function calculateMemberDistribution(
  groups: SportsGroup[]
): MemberCountBin[] {
  if (!groups || groups.length === 0) {
    return MEMBER_COUNT_BINS.map((bin) => ({
      ...bin,
      count: 0,
      groupNames: [],
    }));
  }

  const binData = MEMBER_COUNT_BINS.map((bin) => ({
    ...bin,
    count: 0,
    groupNames: [] as string[],
  }));

  groups.forEach((group) => {
    const bin = binData.find(
      (b) => group.memberCount >= b.range[0] && group.memberCount <= b.range[1]
    );
    if (bin) {
      bin.count += 1;
      bin.groupNames.push(group.groupName);
    }
  });

  return binData;
}

/**
 * Calculate outlier statistics
 * Returns groups with unusual member counts
 */
export function identifyOutliers(groups: SportsGroup[]): SportsGroup[] {
  if (groups.length < 4) return [];

  const memberCounts = groups.map((g) => g.memberCount).sort((a, b) => a - b);

  const q1Index = Math.floor(memberCounts.length * 0.25);
  const q3Index = Math.floor(memberCounts.length * 0.75);

  const q1 = memberCounts[q1Index];
  const q3 = memberCounts[q3Index];
  const iqr = q3 - q1;

  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return groups.filter(
    (g) => g.memberCount < lowerBound || g.memberCount > upperBound
  );
}
