/**
 * SportsGroupAnalytics Module Documentation
 * Complete guide for implementing and using the sports group analytics components
 */

# SportsGroup Analytics Dashboard

Production-ready ApexCharts components for sports group analytics visualization.

## Overview

This module provides 4 reusable React components for analyzing sports group (SportsGroup) data:

1. **RegionalGroupChart** - Horizontal bar chart showing group distribution per region
2. **VerificationStatusChart** - Donut chart showing verified vs unverified status
3. **GrowthTrendChart** - Line chart showing growth trend over time
4. **MemberDistributionChart** - Histogram-like bar chart showing member count distribution

## Quick Start

### 1. Import Components

```typescript
import {
  RegionalGroupChart,
  VerificationStatusChart,
  GrowthTrendChart,
  MemberDistributionChart,
  MOCK_SPORTS_GROUPS,
  MOCK_REGION_MAPPING,
} from '@/components/admin/dashboard/SportsGroupAnalytics';
```

### 2. Use in Dashboard

```typescript
import { SportsGroup } from '@/components/admin/dashboard/SportsGroupAnalytics';

export default function MyDashboard() {
  const [groups, setGroups] = useState<SportsGroup[]>([]);
  const [regionMap, setRegionMap] = useState<Map<number, string>>(new Map());

  // Fetch your actual data
  useEffect(() => {
    // Fetch groups from API
    // setGroups(response.data);
  }, []);

  return (
    <div>
      <RegionalGroupChart
        data={groups}
        regionMap={regionMap}
        limit={10}
        isLoading={false}
      />
      <VerificationStatusChart data={groups} />
      <GrowthTrendChart data={groups} period="year" />
      <MemberDistributionChart data={groups} highlightOutliers={true} />
    </div>
  );
}
```

## Component Details

### RegionalGroupChart

Displays group distribution across regions using a horizontal bar chart.

**Props:**
```typescript
interface RegionalGroupChartProps {
  data: SportsGroup[];
  regionMap?: Map<number, string>;  // Optional mapping for region names
  limit?: number;                    // Top N regions (default: 10)
  isLoading?: boolean;              // Loading state
}
```

**Features:**
- Sorted descending by group count
- Top N regions limit
- Interactive tooltip
- Responsive design
- Download chart as PNG

**Example:**
```typescript
<RegionalGroupChart
  data={sportGroups}
  regionMap={new Map([
    [1, 'Kecamatan Sepatan'],
    [2, 'Kecamatan Tigaraksa'],
  ])}
  limit={15}
/>
```

### VerificationStatusChart

Displays verification status distribution using a donut chart.

**Props:**
```typescript
interface VerificationChartProps {
  data: SportsGroup[];
  isLoading?: boolean;
}
```

**Features:**
- Color-coded: Green (verified) vs Red (unverified)
- Shows percentage and count
- Interactive legend
- Center statistics display

**Example:**
```typescript
<VerificationStatusChart data={sportGroups} />
```

### GrowthTrendChart

Displays growth trend over time using a line chart.

**Props:**
```typescript
interface GrowthTrendChartProps {
  data: SportsGroup[];
  period?: 'year' | 'month';  // Optional period override
  isLoading?: boolean;
}
```

**Features:**
- Auto-selects period (year/month) based on data density
- Smooth curve interpolation
- Zoomable and pannable
- Gradient fill under line

**Example:**
```typescript
<GrowthTrendChart
  data={sportGroups}
  period="month"
/>
```

### MemberDistributionChart

Displays member count distribution using a histogram-like bar chart.

**Props:**
```typescript
interface MemberDistributionChartProps {
  data: SportsGroup[];
  isLoading?: boolean;
  highlightOutliers?: boolean;  // Highlight groups with unusual member counts
}
```

**Bins:**
- 0-10 members
- 11-20 members
- 21-50 members
- 51-100 members
- 100+ members

**Features:**
- Predefined member count bins
- Optional outlier highlighting
- Outlier detection using IQR method
- Shows list of outlier groups

**Example:**
```typescript
<MemberDistributionChart
  data={sportGroups}
  highlightOutliers={true}
/>
```

## Data Transformation Utilities

### aggregateGroupsByRegion

Aggregate groups by region and return top N sorted descending.

```typescript
import { aggregateGroupsByRegion } from '@/components/admin/dashboard/SportsGroupAnalytics';

const result = aggregateGroupsByRegion(
  groups,
  regionMap,
  10  // top 10
);
// Returns: RegionGroupData[]
// [
//   { regionId: 1, regionName: 'Region 1', totalGroups: 45 },
//   { regionId: 2, regionName: 'Region 2', totalGroups: 38 },
//   ...
// ]
```

### calculateVerificationStats

Calculate verification status statistics.

```typescript
import { calculateVerificationStats } from '@/components/admin/dashboard/SportsGroupAnalytics';

const stats = calculateVerificationStats(groups);
// Returns: VerificationStats
// {
//   verified: 175,
//   unverified: 75,
//   verifiedPercent: 70,
//   unverifiedPercent: 30
// }
```

### calculateGrowthTrend

Calculate group growth by time period (year or month).

```typescript
import { calculateGrowthTrend } from '@/components/admin/dashboard/SportsGroupAnalytics';

const trends = calculateGrowthTrend(groups, 'year');
// Returns: GrowthTrendData[]
// [
//   { period: '2021', count: 45, year: 2021 },
//   { period: '2022', count: 67, year: 2022 },
//   ...
// ]

// Auto-detect period
const trendsAuto = calculateGrowthTrend(groups); // Selects month if >12 years
```

### calculateMemberDistribution

Distribute groups into member count bins.

```typescript
import { calculateMemberDistribution } from '@/components/admin/dashboard/SportsGroupAnalytics';

const distribution = calculateMemberDistribution(groups);
// Returns: MemberCountBin[]
// [
//   { label: '0-10', range: [0, 10], count: 45, groupNames: [...] },
//   { label: '11-20', range: [11, 20], count: 32, groupNames: [...] },
//   ...
// ]
```

### identifyOutliers

Identify groups with unusual member counts using IQR method.

```typescript
import { identifyOutliers } from '@/components/admin/dashboard/SportsGroupAnalytics';

const outliers = identifyOutliers(groups);
// Returns: SportsGroup[]
// Groups with member counts outside [Q1 - 1.5*IQR, Q3 + 1.5*IQR]
```

## Mock Data

### Using Mock Data

```typescript
import {
  MOCK_SPORTS_GROUPS,
  MOCK_REGION_MAPPING,
  generateMockSportsGroupData,
  generateRegionMapping,
} from '@/components/admin/dashboard/SportsGroupAnalytics';

// Use predefined mock data (250 groups)
const groups = MOCK_SPORTS_GROUPS;
const regions = MOCK_REGION_MAPPING;

// Or generate custom mock data
const customGroups = generateMockSportsGroupData(500);
const customRegions = generateRegionMapping();
```

### Mock Data Structure

The mock data includes:
- 250 sample sports groups
- Realistic distribution across 8 regions
- 70% verified, 30% unverified
- Groups created over past 5 years
- Member counts from 0-300 with outliers
- Real-looking names and addresses

## Complete Dashboard Example

```typescript
'use client';

import { useState, useEffect } from 'react';
import {
  RegionalGroupChart,
  VerificationStatusChart,
  GrowthTrendChart,
  MemberDistributionChart,
  MOCK_SPORTS_GROUPS,
  MOCK_REGION_MAPPING,
  SportsGroup,
} from '@/components/admin/dashboard/SportsGroupAnalytics';

export default function SportsGroupDashboard() {
  const [groups, setGroups] = useState<SportsGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // For now, use mock data. Replace with API call.
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setGroups(MOCK_SPORTS_GROUPS);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Analitik Kelompok Olahraga</h1>

      <div className="grid grid-cols-2 gap-8">
        <RegionalGroupChart
          data={groups}
          regionMap={MOCK_REGION_MAPPING}
          limit={10}
        />
        <VerificationStatusChart data={groups} />
      </div>

      <GrowthTrendChart data={groups} period="year" />

      <MemberDistributionChart data={groups} highlightOutliers={true} />
    </div>
  );
}
```

## Integration with Real Data

### Step 1: Fetch from Database

```typescript
useEffect(() => {
  async function fetchGroups() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sports-groups');
      const data = await response.json();
      setGroups(data);

      // Fetch region mapping
      const regionsResponse = await fetch('/api/regions');
      const regionsData = await regionsResponse.json();
      const regionMap = new Map(
        regionsData.map((r: { id: number; name: string }) => [r.id, r.name])
      );
      setRegionMap(regionMap);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setIsLoading(false);
    }
  }

  fetchGroups();
}, []);
```

### Step 2: Add Type Safety

```typescript
// types/sports-group.ts
export interface SportsGroupResponse {
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

export interface RegionResponse {
  id: number;
  name: string;
}
```

### Step 3: Handle Errors & Loading

```typescript
return (
  <div>
    {isLoading && <LoadingSpinner />}
    {error && <ErrorAlert error={error} />}
    {groups.length === 0 && !isLoading && (
      <EmptyState message="Tidak ada data kelompok" />
    )}
    {groups.length > 0 && (
      <>
        <RegionalGroupChart data={groups} regionMap={regionMap} />
        {/* Other charts */}
      </>
    )}
  </div>
);
```

## Performance Optimization

### Built-in Optimizations

1. **useMemo** - Data transformations cached and only recalculated when data changes
2. **Dynamic Import** - ApexCharts loaded dynamically (CSR only, no SSR)
3. **Responsive Design** - Charts adapt to screen size
4. **No Unnecessary Re-renders** - Memoized components prevent re-renders

### Additional Tips

1. **Filter data before passing to components** - Let components handle visualization only:
```typescript
const filteredGroups = useMemo(
  () => groups.filter(g => g.isVerified),
  [groups]
);
<RegionalGroupChart data={filteredGroups} />
```

2. **Lazy load chart components** if not immediately visible:
```typescript
const RegionalGroupChart = dynamic(
  () => import('./RegionalGroupChart'),
  { loading: () => <LoadingSpinner /> }
);
```

3. **Use React.memo** for chart containers:
```typescript
const ChartContainer = React.memo(({ data }) => (
  <RegionalGroupChart data={data} />
));
```

## Styling & Customization

All components use Tailwind CSS and are styled for light mode. To customize:

### Change Colors

Edit chart component options:
```typescript
colors: ['#your-hex-color'],
plotOptions: {
  bar: {
    colors: {
      ranges: [
        { from: 0, to: 50, color: '#yourColor' },
      ]
    }
  }
}
```

### Change Typography

Edit in component:
```typescript
dataLabels: {
  style: {
    fontSize: '14px',      // Change size
    fontWeight: 700,       // Change weight
    colors: ['#yourColor']
  }
}
```

### Change Layout (Dark Mode)

Add dark mode styles:
```typescript
// In your Tailwind config
darkMode: 'class'

// In component
<div className="dark:bg-gray-900">
  <RegionalGroupChart data={groups} />
</div>
```

## API Reference

### Types

```typescript
// Main data model
interface SportsGroup {
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

// Chart data
interface RegionGroupData {
  regionId: number;
  regionName: string;
  totalGroups: number;
}

interface VerificationStats {
  verified: number;
  unverified: number;
  verifiedPercent: number;
  unverifiedPercent: number;
}

interface GrowthTrendData {
  period: string;
  count: number;
  year?: number;
  month?: number;
}

interface MemberCountBin {
  label: string;
  range: [number, number];
  count: number;
  groupNames: string[];
}
```

## Troubleshooting

### Chart not rendering?
- Ensure data is passed correctly
- Check that ApexCharts is installed: `npm list apexcharts react-apexcharts`
- Verify component is used in `'use client'` component

### Data not updating?
- Check that dependencies in `useMemo` are correct
- Verify state updates are triggering re-render

### Dates not parsing?
- Ensure `createdAt` is a valid Date object
- Use `new Date(dateString)` if needed

### Performance issues?
- Reduce number of data points displayed
- Increase `limit` in RegionalGroupChart
- Use filtering to show subset of data

## Files

```
components/admin/dashboard/SportsGroupAnalytics/
├── utils.ts                      # Data transformation utilities
├── mockData.ts                   # Mock data generation
├── RegionalGroupChart.tsx        # Component 1: Regional distribution
├── VerificationStatusChart.tsx   # Component 2: Verification status
├── GrowthTrendChart.tsx          # Component 3: Growth trend
├── MemberDistributionChart.tsx   # Component 4: Member distribution
├── Dashboard.tsx                 # Complete dashboard example
├── index.ts                      # Barrel export
└── README.md                     # This file
```

## Dependencies

- `apexcharts` (already installed)
- `react-apexcharts` (already installed)
- Next.js
- React 19+
- TypeScript
- Tailwind CSS

## License

Part of sidora-v3 project.
