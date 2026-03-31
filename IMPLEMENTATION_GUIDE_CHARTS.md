# Implementation Guide: Refactored Dashboard Charts

## Overview
This guide shows HOW to integrate the new chart components into `page.tsx` with exact code replacements.

---

## Step 1: Import New Components

**Location**: Top of `app/(admin)/admin/page.tsx`

```typescript
// Add these imports after existing imports
import {
  AthleteGroupBarChart,
  AchievementRankingChart,
  EquipmentMetrics,
  PrasaranaMetrics,
  PerformanceCorrelationChart,
} from '@/components/admin/dashboard/ChartComponents';
```

---

## Step 2: Replace Athlete & Sports Group Section

### BEFORE (Lines 553-598)
```tsx
<section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
  <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold">ATLET & KELOMPOK OLAHRAGA</h2>
      <Award className="w-5 h-5 text-indigo-500" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="text-sm font-semibold mb-3 text-slate-700">Atlet (Total: {dashboardSummary?.totalAthletes ?? 0})</div>
        <div className="h-48 flex items-center justify-center">
          {athleteDist.series.length > 0 ? (
            <ReactApexChart
              type="pie"
              width={220}
              height={200}
              series={athleteDist.series}
              options={{
                labels: athleteDist.labels,
                legend: { position: 'bottom' },
                title: { text: 'Distribusi Atlet per Cabang Olahraga', align: 'center', style: { fontSize: '14px' } },
                dataLabels: { enabled: true },
                tooltip: { y: { formatter: (val: number) => `${val} atlet` } },
              }}
            />
          ) : (
            <span className="text-slate-400">Memuat chart...</span>
          )}
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold mb-3 text-slate-700">Kelompok (Total: {dashboardSummary?.totalSportsGroups ?? 0})</div>
        <div className="h-48 flex items-center justify-center">
          {groupDist.series.length > 0 ? (
            <ReactApexChart
              type="pie"
              width={220}
              height={200}
              series={groupDist.series}
              options={{
                labels: groupDist.labels,
                legend: { position: 'bottom' },
                title: { text: 'Distribusi Kelompok per Cabang Olahraga', align: 'center', style: { fontSize: '14px' } },
                dataLabels: { enabled: true },
                tooltip: { y: { formatter: (val: number) => `${val} kelompok` } },
              }}
            />
          ) : (
            <span className="text-slate-400">Memuat chart...</span>
          )}
        </div>
      </div>
    </div>
  </article>
  // ... rest of section
</section>
```

### AFTER (Replacement Code)
```tsx
<section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
  <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold">ATLET & KELOMPOK OLAHRAGA</h2>
      <Award className="w-5 h-5 text-indigo-500" />
    </div>
    <AthleteGroupBarChart
      athleteData={athleteDist}
      groupData={groupDist}
      totalAthletes={dashboardSummary?.totalAthletes ?? 0}
      totalGroups={dashboardSummary?.totalSportsGroups ?? 0}
      isLoading={isLoading}
    />
  </article>
  // ... keep rest of section unchanged
</section>
```

**Why This Change**:
- ✅ Replaces 2 pie charts (unscalable) with 1 grouped bar chart
- ✅ Single chart for both metrics (saves space, clearer comparison)
- ✅ All calculation logic is inside component (cleaner page code)
- ✅ Easy to reuse in other dashboards

---

## Step 3: Replace Prestasi Atlet (Achievement) Section

### BEFORE (Lines 569-602)
```tsx
<article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-bold">PRESTASI ATLET (Tren)</h2>
    <LineChart className="w-5 h-5 text-cyan-600" />
  </div>
  <div className="h-56 relative">
    {kecamatanData.length > 0 ? (
      <svg viewBox="0 0 330 170" className="w-full h-full">
        <polyline
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="3"
          points={kecamatanData
            .map((item, index) => {
              const x = 20 + (index / Math.max(kecamatanData.length - 1, 1)) * 290;
              const value = item.totalAchievement;
              const maxAchievement = Math.max(...kecamatanData.map((i) => i.totalAchievement), 1);
              const y = 150 - (value / maxAchievement) * 130;
              return `${x},${y}`;
            })
            .join(' ')}
        />
        {kecamatanData.map((item, index) => {
          const x = 20 + (index / Math.max(kecamatanData.length - 1, 1)) * 290;
          const maxAchievement = Math.max(...kecamatanData.map((i) => i.totalAchievement), 1);
          const y = 150 - (item.totalAchievement / maxAchievement) * 130;
          return <circle key={item.id} cx={x} cy={y} r="4" fill="#0ea5e9" />;
        })}
      </svg>
    ) : (
      <div className="flex items-center justify-center h-full text-slate-500">Tidak ada data</div>
    )}
    <div className="absolute bottom-0 left-0 right-0 px-4 pb-1 text-xs text-slate-500 flex justify-between">
      {kecamatanData.map((item) => (
        <span key={item.id}>{item.nama.substring(0, 8)}</span>
      ))}
    </div>
  </div>
</article>
```

### AFTER (Replacement Code)
```tsx
<article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-bold">PRESTASI ATLET (Peringkat Kecamatan)</h2>
    <BarChart3 className="w-5 h-5 text-cyan-600" />
  </div>
  <AchievementRankingChart
    kecamatanData={kecamatanData}
    maxItems={12}
    isLoading={isLoading}
  />
</article>
```

**Why This Change**:
- ✅ From metadata-less custom SVG to interactive ApexChart
- ✅ Semantic correctness: ranking (not trend) visualization
- ✅ Automatic sorting by achievement (top performers first)
- ✅ Much easier to maintain and extend
- ✅ Better tooltips and interactivity built-in

**Note**: Changed icon from `LineChart` to `BarChart3` to reflect chart type

---

## Step 4: Replace Sarana & Prasarana Section

### BEFORE (Lines 495-536)
```tsx
<section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
  <article className="xl:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
    <h2 className="text-lg font-bold mb-4">Sarana Summary</h2>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600">Total Records</span>
          <span className="font-bold text-blue-600">{dashboardSummary?.totalEquipment ?? 0}</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600">Total Quantity</span>
          <span className="font-bold text-cyan-600">{dashboardSummary?.totalEquipmentQuantity ?? 0}</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '75%' }} />
        </div>
      </div>
    </div>
  </article>

  <article className="xl:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
    <h2 className="text-lg font-bold mb-4">Prasarana - Distribusi</h2>
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Total Prasarana</span>
          <span className="font-bold">{dashboardSummary?.totalPrasarana ?? 0}</span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div className="bg-orange-500 h-3 rounded-full" style={{ width: '85%' }} />
        </div>
      </div>
    </div>
  </article>
</section>
```

### AFTER (Replacement Code)
```tsx
<section className="space-y-4">
  <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
    <h2 className="text-lg font-bold mb-4">Sarana (Equipment) Summary</h2>
    <EquipmentMetrics
      totalRecords={dashboardSummary?.totalEquipment ?? 0}
      totalQuantity={dashboardSummary?.totalEquipmentQuantity ?? 0}
      isLoading={isLoading}
    />
  </article>

  <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
    <h2 className="text-lg font-bold mb-4">Prasarana (Infrastructure) Summary</h2>
    <PrasaranaMetrics
      totalCount={dashboardSummary?.totalPrasarana ?? 0}
      totalGroups={dashboardSummary?.totalSportsGroups ?? 0}
      totalAthletes={dashboardSummary?.totalAthletes ?? 0}
      isLoading={isLoading}
    />
  </article>
</section>
```

**Why This Change**:
- ✅ From static, hardcoded progress bars to meaningful metrics
- ✅ Shows relationships (avg per item, utilization)
- ✅ Separated into distinct sections for clarity
- ✅ Better spacing and visual hierarchy
- ✅ More informative without adding complexity

---

## Step 5: ADD OPTIONAL Advanced Insight Chart

**Location**: Add new section before or after existing sections (e.g., before "Data Summary per Kecamatan")

```tsx
<section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
  <h2 className="text-lg font-bold mb-4">Advanced Insight: Performance Correlation</h2>
  <p className="text-sm text-slate-600 mb-4">
    Analisis hubungan antara jumlah kelompok olahraga dengan prestasi atlet per kecamatan
  </p>
  <PerformanceCorrelationChart
    kecamatanData={kecamatanData}
    isLoading={isLoading}
  />
</section>
```

---

## Step 6: Update Imports (if needed)

If ApexCharts is not already installed:
```bash
npm install react-apexcharts apexcharts
```

---

## Step 7: Testing Checklist

After implementing changes, test:

- [ ] All charts render without console errors
- [ ] Charts update when filters (year, kecamatan) change
- [ ] Charts show loading state while fetching data
- [ ] Charts show empty state when no data
- [ ] Tooltips display correct values + formatting
- [ ] Charts are responsive on mobile (test width < 640px)
- [ ] Export button works (if implemented)
- [ ] No memory leaks (check DevTools > Memory)
- [ ] Performance: no janky animations on re-render

---

## Step 8: Data Validation (Important)

**Before rendering charts**, ensure data is properly formatted:

```typescript
// Safe data checks
const isValidChartData = (series: any[], labels: any[]) => {
  return (
    Array.isArray(series) &&
    Array.isArray(labels) &&
    series.length > 0 &&
    labels.length > 0 &&
    series.every((val) => typeof val === 'number' || val === null) &&
    series.length === labels.length
  );
};

// Usage in page.tsx:
{isValidChartData(athleteDist.series, athleteDist.labels) ? (
  <AthleteGroupBarChart ... />
) : (
  <div>Data tidak valid atau kosong</div>
)}
```

---

## Step 9: Styling Customization

All components use Tailwind CSS. To customize colors:

**In ChartComponents.tsx**, update these color values:

```typescript
// Athlete bar chart
colors: ['#3b82f6', '#10b981'], // blue, green

// Achievement ranking
colors: (value: number) => { ... }, // gradient function

// Equipment metrics
from-blue-50, to-blue-100 // Tailwind color classes
from-cyan-50, to-cyan-100
from-orange-50, to-orange-100

// To change: Edit hex colors or Tailwind classes
```

---

## Step 10: Performance Optimization

If dashboard has many kecamatan (>100), consider:

```typescript
// Limit bar chart to top N categories
const TOP_SPORTS = 10; // Show top 10 sports
const filteredAthleteData = {
  labels: athleteDist.labels.slice(0, TOP_SPORTS),
  series: athleteDist.series.slice(0, TOP_SPORTS),
};

// Limit ranking to top N
const TOP_ACHIEVEMENTS = 15;
<AchievementRankingChart
  kecamatanData={kecamatanData}
  maxItems={TOP_ACHIEVEMENTS}
/>
```

---

## Common Issues & Solutions

### Issue 1: Chart Not Displaying
**Problem**: Chart appears blank
**Solution**: 
```typescript
// Add data validation
console.log('athleteDist:', athleteDist);
console.log('isLoading:', isLoading);
// Ensure series is array of numbers, not strings
athleteDist.series = athleteDist.series.map(Number);
```

### Issue 2: Memory Leak Warning
**Problem**: React warning about cleanup
**Solution**: Components already handle this with `ssr: false` in dynamic import

### Issue 3: Tooltip Not Showing
**Problem**: Hover tooltips not visible
**Solution**: Ensure ApexCharts CSS is imported
```typescript
// In layout.tsx or page.tsx
import 'apexcharts/dist/apexcharts.css';
```

### Issue 4: Chart Too Wide/Narrow
**Problem**: Chart doesn't fit container
**Solution**: Width is already set to `100%` and height responsive

---

## File Structure After Implementation

```
components/
  admin/
    dashboard/
      ChartComponents.tsx          ← NEW: All chart components
      DashboardMap.tsx             ← existing
      DistrictTable.tsx            ← existing
      
app/
  (admin)/
    admin/
      page.tsx                     ← MODIFIED: New imports + replacements
```

---

## Summary of Changes

| Component | Before | After | Benefit |
|-----------|--------|-------|---------|
| Athlete Distribution | Pie chart × 2 | Bar chart (1) | Scalable, comparable |
| Achievement Trend | Line chart | Bar ranking | Correct semantics |
| Sarana Summary | Progress bar | Dual metrics | Shows relationships |
| Prasarana Summary | Progress bar | Efficiency cards | Utilization insight |
| NEW | — | Scatter chart | Correlation analysis |

**Total LOC removed**: ~150 lines of custom SVG and prop drilling
**Total LOC added**: ~50 lines (imports + component calls)
**Net improvement**: Cleaner code + better UX

---

## Next Steps

1. ✅ Copy `ChartComponents.tsx` to components folder
2. ✅ Update imports in `page.tsx`
3. ✅ Replace chart sections (Steps 2-5)
4. ✅ Test thoroughly
5. ⏭️ (Optional) Add drill-down interactivity
6. ⏭️ (Optional) Add export/report functionality
7. ⏭️ (Future) Implement category filters

