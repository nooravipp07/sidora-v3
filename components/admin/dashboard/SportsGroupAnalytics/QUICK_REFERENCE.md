/**
 * QUICK REFERENCE
 * Cheat sheet for SportsGroup Analytics Dashboard
 */

# SportsGroup Analytics - Quick Reference

## 📁 File Structure

```
components/admin/dashboard/SportsGroupAnalytics/
├── utils.ts                      # Data transformations
├── mockData.ts                   # Mock data generator
├── RegionalGroupChart.tsx        # Chart: Regional distribution (horizontal bar)
├── VerificationStatusChart.tsx   # Chart: Verification status (donut)
├── GrowthTrendChart.tsx          # Chart: Growth trend (line)
├── MemberDistributionChart.tsx   # Chart: Member distribution (histogram)
├── Dashboard.tsx                 # Complete dashboard example
├── index.ts                      # Exports everything
├── README.md                     # Detailed documentation
├── INTEGRATION.md                # Integration guide
└── QUICK_REFERENCE.md            # This file
```

## 🚀 Quick Start (5 minutes)

### 1. Import Everything

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

### 2. Use Mock Data

```typescript
<RegionalGroupChart data={MOCK_SPORTS_GROUPS} />
<VerificationStatusChart data={MOCK_SPORTS_GROUPS} />
<GrowthTrendChart data={MOCK_SPORTS_GROUPS} />
<MemberDistributionChart data={MOCK_SPORTS_GROUPS} />
```

### 3. Use Full Dashboard

```typescript
import { Dashboard } from '@/components/admin/dashboard/SportsGroupAnalytics';

export default function Page() {
  return <Dashboard />;
}
```

## 📊 Chart Components

| Chart | Type | Data Field | Best For |
|-------|------|-----------|----------|
| **RegionalGroupChart** | Horizontal Bar | `desaKelurahanId` | See which regions have most groups |
| **VerificationStatusChart** | Donut | `isVerified` | Status breakdown, percentages |
| **GrowthTrendChart** | Line | `createdAt` | Trend over time, growth pattern |
| **MemberDistributionChart** | Bar (Histogram) | `memberCount` | Member count distribution, outliers |

## 🔧 Key Props

### RegionalGroupChart
```typescript
<RegionalGroupChart
  data={SportsGroup[]}           // Required
  regionMap={Map}                // Optional: Map for region names
  limit={10}                     // Optional: Top N regions (default 10)
  isLoading={false}              // Optional: Loading state
/>
```

### VerificationStatusChart
```typescript
<VerificationStatusChart
  data={SportsGroup[]}           // Required
  isLoading={false}              // Optional
/>
```

### GrowthTrendChart
```typescript
<GrowthTrendChart
  data={SportsGroup[]}           // Required
  period={'year' | 'month'}      // Optional: Auto-selects if not given
  isLoading={false}              // Optional
/>
```

### MemberDistributionChart
```typescript
<MemberDistributionChart
  data={SportsGroup[]}           // Required
  isLoading={false}              // Optional
  highlightOutliers={true}       // Optional: Highlight unusual groups
/>
```

## 🛠️ Utility Functions

### Transform Data

```typescript
// Regional summary
const regions = aggregateGroupsByRegion(data, regionMap, 10);
// Returns: { regionId, regionName, totalGroups }[]

// Verification stats
const stats = calculateVerificationStats(data);
// Returns: { verified, unverified, verifiedPercent, unverifiedPercent }

// Growth trend
const trend = calculateGrowthTrend(data, 'year');
// Returns: { period, count, year?, month? }[]

// Member distribution
const dist = calculateMemberDistribution(data);
// Returns: { label, range, count, groupNames }[]

// Identify outliers
const outliers = identifyOutliers(data);
// Returns: SportsGroup[] with unusual member counts
```

## 📦 SportsGroup Type

```typescript
interface SportsGroup {
  id: number;
  desaKelurahanId: number;           // Region ID
  groupName: string;                 // Group name
  leaderName?: string;               // Leader name
  memberCount: number;               // Total members
  isVerified: boolean;               // Verification status
  decreeNumber?: string;             // Optional decree
  secretariatAddress?: string;       // Optional address
  createdAt?: Date;                  // Creation date
}
```

## 🎨 Common Patterns

### Filter Data Before Passing

```typescript
const verified = data.filter(g => g.isVerified);
<RegionalGroupChart data={verified} />
```

### Responsive Grid Layout

```typescript
<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
  <RegionalGroupChart data={data} />
  <VerificationStatusChart data={data} />
</div>

<div className="mt-8">
  <GrowthTrendChart data={data} />
</div>
```

### With Loading State

```typescript
{isLoading ? (
  <div>Loading...</div>
) : (
  <RegionalGroupChart data={data} />
)}
```

### From API

```typescript
const [groups, setGroups] = useState<SportsGroup[]>([]);

useEffect(() => {
  fetch('/api/sports-groups')
    .then(r => r.json())
    .then(setGroups);
}, []);

<RegionalGroupChart data={groups} />
```

## 🧪 Testing with Mock Data

```typescript
import { MOCK_SPORTS_GROUPS, MOCK_REGION_MAPPING } from '...';

// Use predefined mock data (250 groups)
render(<Dashboard data={MOCK_SPORTS_GROUPS} />);

// Or generate custom mock data
const customData = generateMockSportsGroupData(500);
render(<Dashboard data={customData} />);
```

## ⚡ Performance Tips

| Issue | Solution |
|-------|----------|
| Slow rendering | Use `useMemo` to cache filtered data |
| Too many data points | Reduce with `limit` prop or filtering |
| Re-renders on parent change | Wrap with `React.memo()` |
| Heavy computation | Move transformations to server |
| Stale data | Add refetch interval with useSWR |

## 🎯 Common Use Cases

### Show Top 5 Regions

```typescript
<RegionalGroupChart data={groups} limit={5} />
```

### Show Only Verified Groups

```typescript
const verified = groups.filter(g => g.isVerified);
<VerificationStatusChart data={verified} />
```

### Show Growth by Month

```typescript
<GrowthTrendChart data={groups} period="month" />
```

### Show Member Distribution with Outliers

```typescript
<MemberDistributionChart
  data={groups}
  highlightOutliers={true}
/>
```

## 🔄 Data Flow

```
Raw Data (SportsGroup[])
    ↓
Transformation Util (utils.ts)
    ↓
Formatted Data (RegionGroupData[] | VerificationStats | etc)
    ↓
Chart Component
    ↓
ApexChart Render
    ↓
Browser Display
```

## 🐛 Debugging

### Check data is formatted correctly
```typescript
console.log('Data:', groups.slice(0, 2));
// Should have: id, desaKelurahanId, memberCount, isVerified, createdAt, etc
```

### Check transformation output
```typescript
const regions = aggregateGroupsByRegion(groups);
console.log('Regions:', regions);
// Should have: regionId, regionName, totalGroups
```

### Check chart is rendered
```typescript
// In browser DevTools
// 1. Check ApexCharts library loaded
console.log(window.ApexCharts);
// 2. Check chart div exists
document.querySelector('[class*="apexcharts"]');
```

## 📱 Responsive Design

All charts are responsive by default:
- **Mobile**: Stacked layout, smaller fonts
- **Tablet**: 2-column grid
- **Desktop**: Full 2-column grid + full-width charts

## 🌐 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 12+)
- Mobile: ✅ Optimized

## 📝 Component Checklist

- [x] TypeScript types included
- [x] Error states handled
- [x] Empty data states handled
- [x] Loading states supported
- [x] Responsive design
- [x] Accessibility labels
- [x] Tooltip support
- [x] Download/export support
- [x] Dark mode compatible
- [x] Performance optimized (useMemo)

## 🔗 Integration Paths

| Need | File |
|------|------|
| Just copy-paste code | Use `Dashboard.tsx` |
| Integrate into existing page | See `INTEGRATION.md` |
| Understand everything | Read `README.md` |
| Quick overview | You're reading it! |

## 🆘 Common Errors

| Error | Fix |
|-------|-----|
| "ApexCharts is not defined" | Ensure `'use client'` directive |
| Chart not showing | Check data passed is not empty |
| TypeError in filter | Ensure `regionMap` is `Map<number, string>` |
| Memory leak warning | Move fetch to `useEffect` or server |

## 📚 External Resources

- ApexCharts Docs: https://apexcharts.com
- Tailwind CSS: https://tailwindcss.com
- Next.js: https://nextjs.org
- React: https://react.dev

## 📞 Support

For issues:
1. Check README.md for details
2. Review INTEGRATION.md for setup
3. Check mock data format matches SportsGroup interface
4. Verify apexcharts is installed: `npm list apexcharts`

---

**Last Updated**: 2026-04-03  
**Version**: 1.0  
**Status**: Production-Ready
