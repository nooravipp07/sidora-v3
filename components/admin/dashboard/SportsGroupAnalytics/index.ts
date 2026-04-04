/**
 * SportsGroupAnalytics Module
 * Barrel export for all components, utilities, and data
 */

// Components
export { RegionalGroupChart } from './RegionalGroupChart';
export { VerificationStatusChart } from './VerificationStatusChart';
export { GrowthTrendChart } from './GrowthTrendChart';
export { MemberDistributionChart } from './MemberDistributionChart';

// Utilities
export {
  aggregateGroupsByRegion,
  calculateVerificationStats,
  calculateGrowthTrend,
  calculateMemberDistribution,
  identifyOutliers,
  type SportsGroup,
  type DesaKelurahan,
  type RegionGroupData,
  type VerificationStats,
  type GrowthTrendData,
  type MemberCountBin,
} from './utils';

// Mock Data
export {
  generateMockSportsGroupData,
  generateRegionMapping,
  MOCK_SPORTS_GROUPS,
  MOCK_REGION_MAPPING,
} from './mockData';
