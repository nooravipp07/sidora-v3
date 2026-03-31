# SIDORA Dashboard - Chart Redesign Strategy

## Executive Summary
The current dashboard uses 4 visualization sections. This analysis identifies redundancies, scalability issues, and proposes production-grade alternatives using ApexCharts with React.

---

## 1. CURRENT STATE ANALYSIS

### 1.1 Athlete & Sports Group Distribution (Lines 530-567)
**Current Implementation**: Two separate pie charts
```
Left:  Pie chart for athlete distribution by sport
Right: Pie chart for group distribution by sport
```

**Problems**:
- ❌ Pie charts become unreadable with >5 categories (categorical explosion)
- ❌ Hard to compare values between two pie charts (cognitive load)
- ❌ No interaction or drill-down capability
- ❌ Doesn't scale if sports grow to 20+ categories
- ❌ Wastes horizontal space on redundant labels

**Data Points Available**:
- `athleteDist.labels` (sport names)
- `athleteDist.series` (athlete counts per sport)
- `groupDist.labels` (sport names)
- `groupDist.series` (group counts per sport)

---

### 1.2 Sarana & Prasarana Summaries (Lines 495-536)
**Current Implementation**: Static progress bars with hardcoded widths
```
Sarana:
  - Total Records: 100% width
  - Total Quantity: 75% width (hardcoded)

Prasarana:
  - Total Count: 85% width (hardcoded)
```

**Problems**:
- ❌ Hardcoded percentages don't reflect actual data relationships
- ❌ No insight into distribution (by type, by desa, by condition)
- ❌ Progress bars imply progress toward a goal (misleading)
- ❌ No comparison capability
- ❌ Ignores rich metadata (type, location, condition)

**Data Available**:
- `dashboardSummary?.totalEquipment` (records count)
- `dashboardSummary?.totalEquipmentQuantity` (physical items)
- `dashboardSummary?.totalPrasarana` (infrastructure count)
- Missing: breakdown by type, category, location

---

### 1.3 Prestasi Atlet (Achievement Trend) (Lines 569-602)
**Current Implementation**: Custom SVG line chart with kecamatan as x-axis
```
X-axis: Kecamatan names (truncated to 8 chars)
Y-axis: totalAchievement values
Points: Connected line chart
```

**Problems**:
- ❌ **Not a time-series**: X-axis is regional, not temporal (misleading use of line chart)
- ❌ Line implies continuity/progression (doesn't exist in regional data)
- ❌ Limited interactivity (no tooltips, no hover)
- ❌ Custom SVG calculation is fragile and hard to maintain
- ❌ Doesn't answer "which regions perform best?"
- ❌ Can't compare multiple years/trends over time

**Better Purpose**: This is a **ranking/comparison problem**, not a trend

---

## 2. REDESIGN RECOMMENDATIONS

### 2.1 ATHLETE & SPORTS GROUP VISUALIZATION
**Recommended: Stacked Bar Chart (Grouped Comparison)**

#### Why This Chart?
- ✅ Handles 10+ categories without readability loss
- ✅ Direct value comparison between athletes and groups
- ✅ Shows size relationships instantly
- ✅ Scalable and production-ready
- ✅ Supports interactive tooltips, click drill-down

#### Data Mapping
```
X-axis:    Sport names (cabangOlahraga.nama)
Y-axis:    Count (athletes + groups)
Series 1:  Athletes per sport (athleteDist.series)
Series 2:  Groups per sport (groupDist.series)
Color 1:   #3b82f6 (blue) - Athletes
Color 2:   #10b981 (green) - Groups
```

#### ApexCharts Config
```typescript
{
  chart: {
    type: 'bar',
    stacked: false,
    toolbar: { show: true },
    animations: { enabled: true }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '65%',
      borderRadius: 4,
      dataLabels: { position: 'top' }
    }
  },
  xaxis: {
    categories: athleteDist.labels, // sport names
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    title: { text: 'Jumlah' }
  },
  series: [
    { 
      name: 'Atlet',
      data: athleteDist.series,
      color: '#3b82f6'
    },
    {
      name: 'Kelompok',
      data: groupDist.series,
      color: '#10b981'
    }
  ],
  tooltip: {
    theme: 'light',
    y: { formatter: (val) => `${val} item` }
  },
  legend: { position: 'top' }
}
```

#### Key Insights This Enables
- Which sports have the most athletes?
- Which sports have the most groups?
- Is athlete count proportional to group count? (efficiency metric)
- Example: Sport X has 150 athletes but only 3 groups → high concentration risk

---

### 2.2 SARANA (EQUIPMENT) VISUALIZATION
**Recommended: Dual Metric Card + Distribution Breakdown**

#### Problem Addressed
- Current progress bars don't answer "where is equipment distributed?"
- No visibility into equipment types or locations

#### Solution Structure
```
PRIMARY METRIC CARD (Record Count):
  - Total Sarana Records: [number]
  - Avg Quantity per Record: [formula] = totalQuantity / totalRecords
  - Indicator: [color-coded trend]

SECONDARY VISUALIZATION (Mini Bar Chart - Distribution by Desa):
  Top 8 Desa/Kelurahan by equipment count
  (requires additional API endpoint or grouping logic)
```

#### Why This Works
- ✅ Shows relationship between records and quantity (efficiency metric)
- ✅ Reveals distribution patterns
- ✅ Simple, scannable card format
- ✅ Provides drill-down opportunity

#### Implementation
```typescript
// Instead of hardcoded progress bar:
const avgQuantityPerRecord = Math.round(
  (dashboardSummary?.totalEquipmentQuantity ?? 0) / 
  (dashboardSummary?.totalEquipment ?? 1)
);

// Card display:
<div className="grid grid-cols-2 gap-3">
  <MetricCard label="Total Sarana" value={totalEquipment} />
  <MetricCard label="Rata-rata Per Item" value={avgQuantityPerRecord} />
</div>

// Optional: Add bar chart for top locations
<BarChart
  data={equipmentByLocation}
  x="desaNama"
  y="count"
  height={200}
/>
```

---

### 2.3 PRASARANA (INFRASTRUCTURE) VISUALIZATION
**Recommended: Donut Chart + Category Breakdown (if type data available)**

#### Current Issue
- Single static progress bar hides complexity
- No insight into infrastructure types (fields, courts, halls, etc.)

#### Recommended Approach

**Option A (If type/category data available)**:
Use a **Donut Chart** showing prasarana breakdown by type
```
Center number: Total Prasarana count
Segments: Different infrastructure types with percentages
```

**Option B (If type data unavailable)**:
Use **Comparison Card Layout** showing:
```
Prasarana: [total count] → compared to facilities with good conditions
Utilization: [percentage] → based on sports groups using them
```

#### ApexCharts Donut Config (Option A)
```typescript
{
  chart: { type: 'donut', animations: { enabled: true } },
  labels: ['Lapangan', 'Gedung', 'Kolam', 'Lainnya'],
  series: [45, 25, 15, 15], // counts per type
  colors: ['#f97316', '#3b82f6', '#06b6d4', '#8b5cf6'],
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          name: { show: true, label: 'Prasarana Type' },
          value: { show: true, formatter: (val) => `${val} unit` },
          total: {
            show: true,
            label: 'Total Prasarana',
            formatter: () => `${totalPrasarana} unit`
          }
        }
      }
    }
  },
  tooltips: {
    y: { formatter: (val) => `${val} prasarana` }
  }
}
```

---

### 2.4 PRESTASI ATLET (ACHIEVEMENT) REDESIGN ⭐ CRITICAL CHANGE
**Current**: Line chart (WRONG for regional data)
**Recommended**: Horizontal Bar Chart (Ranking)

#### Why This Chart?
- ✅ Shows regional ranking clearly
- ✅ Supports >20 regions without crowding
- ✅ Values instantly comparable
- ✅ Space-efficient (can show all regions)
- ✅ Correct semantic use (ranking, not time-series)

#### Data Mapping
```
Y-axis:    Kecamatan names (sorted by achievement DESC)
X-axis:    totalAchievement values
Bar Color: Gradient based on value (green=high, orange=low)
Top 10:    Filter for dashboard space
```

#### Why NOT Line Chart?
```
❌ Line chart implies:
   - Time progression (we have regions, not years)
   - Continuous data (achievements are discrete by region)
   - Causal relationship (previous region doesn't cause next)

✅ Bar chart correctly represents:
   - Ranking/comparison
   - Discrete regional performance
   - Clear winners and laggards
```

#### ApexCharts Config
```typescript
{
  chart: { type: 'bar', stacked: false },
  plotOptions: {
    bar: {
      horizontal: true,
      columnWidth: '75%',
      borderRadius: 4,
      dataLabels: { position: 'right' }
    }
  },
  xaxis: {
    title: { text: 'Total Prestasi Atlet' },
    categories: kecamatanData
      .sort((a, b) => b.totalAchievement - a.totalAchievement)
      .slice(0, 12)
      .map(k => k.nama)
  },
  yaxis: { reversed: false },
  series: [{
    name: 'Prestasi Atlet',
    data: kecamatanData
      .sort((a, b) => b.totalAchievement - a.totalAchievement)
      .slice(0, 12)
      .map(k => k.totalAchievement)
  }],
  colors: ['#06b6d4'],
  dataLabels: { enabled: true, offsetX: 5 },
  tooltip: {
    theme: 'light',
    y: { formatter: (val) => `${val} prestasi` }
  }
}
```

#### Enhanced Version: If Year Data Exists
If `kecamatanData` includes historical years:
```
Switch to LINE chart only if:
- Data has: kecamatan x year x achievement
- Use: Chart type "line" with year on X-axis
- Multiple lines for top 5 kecamatan
```

---

## 3. ADVANCED INSIGHT CHART (NEW) ⭐ OPTIONAL

### 3.1 ATHLETE PERFORMANCE CORRELATION
**Chart Type**: Scatter Plot with Regression Line

#### Purpose
Show relationship between:
- X-axis: Number of sports groups in region
- Y-axis: Total achievements in region
- Size: Number of athletes

#### Insight
- Do regions with more groups produce more achievements?
- Is there optimal group density for performance?

#### ApexCharts Config
```typescript
{
  chart: { type: 'scatter', zoom: { enabled: true } },
  plotOptions: {
    scatter: {
      size: 8,
      dataLabels: { enabled: false }
    }
  },
  xaxis: {
    title: { text: 'Kelompok Olahraga (count)' },
    type: 'numeric'
  },
  yaxis: {
    title: { text: 'Total Prestasi Atlet' }
  },
  series: [{
    name: 'Kecamatan Performance',
    data: kecamatanData.map(k => ({
      x: k.totalSportsGroups,
      y: k.totalAchievement,
      size: Math.sqrt(k.totalAthletes) // bubble size
    }))
  }],
  tooltip: {
    theme: 'light',
    y: { formatter: (val) => `${val} prestasi` },
    x: { formatter: (val) => `${val} kelompok` }
  }
}
```

#### Insight Questions
- Is there a positive correlation?
- Are there outliers (high performer with few groups)?
- What's the optimal group count for achievements?

---

### 3.2 RESOURCE vs OUTPUT EFFICIENCY (ALTERNATIVE)
**Chart Type**: Dumbbell Chart (Two-point comparison)

#### Purpose
Compare:
- Sarana (equipment) distribution
- Prasarana (infrastructure) distribution
- Relative to athlete concentration

#### Why Dumbbell?
- ✅ Shows start-end comparison
- ✅ Clear gap visualization
- ✅ Compact, modern design

#### ApexCharts (Not native, use custom or library)
Alternative: Use **Styled Bar Chart**
```typescript
series: [
  {
    name: 'Sarana',
    data: kecamatanData.map(k => k.totalEquipment)
  },
  {
    name: 'Prasarana',
    data: kecamatanData.map(k => k.totalPrasarana)
  },
  {
    name: 'Atlet',
    data: kecamatanData.map(k => k.totalAthletes)
  }
]
```

---

## 4. IMPLEMENTATION ROADMAP

### Phase 1 (Immediate)
1. Replace two pie charts → **Grouped Bar Chart**
2. Replace Prestasi line chart → **Horizontal Bar Chart**
3. Update progress bars → **Dual metric cards**

### Phase 2 (Enhancement)
4. Add scatter plot for correlation analysis
5. Implement interactive drill-down from bars to region details
6. Add year-over-year toggle if historical data exists

### Phase 3 (Advanced)
7. Add geospatial visualization (already exists as DashboardMap)
8. Create drill-down: Bar → Region detail modal
9. Add export-to-report functionality

---

## 5. DATA REQUIREMENTS FOR OPTIMAL CHARTS

### Currently Available
✅ kecamatanData (region with totals)
✅ athleteDist & groupDist (sport-level distribution)
✅ dashboardSummary (aggregate metrics)
✅ kecamatanData.totalAchievement (regional performance)

### Needed for Advanced Features
❌ Equipment type breakdown (sarana tepat jenisnya)
❌ Infrastructure type breakdown (prasarana jenis lapangan/gedung/etc)
❌ Achievement by year (for trend analysis)
❌ Sport-level achievement breakdown
❌ Equipment condition/status data

### API Enhancement Suggestions
```typescript
// Current: /api/masterdata/athlete?sportId=X
// Enhanced: /api/dashboard/sarana-by-type?year=2025

// New endpoints needed:
/api/dashboard/equipment-distribution?groupBy=type|desa
/api/dashboard/infrastructure-distribution?groupBy=type|condition
/api/dashboard/achievement-trend?kecamatanId=1&years=[2023,2024,2025]
/api/dashboard/sport-performance?metric=athlete|achievement
```

---

## 6. PRODUCTION CHECKLIST

- [ ] Verify all chart receives real data (not mock)
- [ ] Test with edge cases (0 records, 1 category, 100+ categories)
- [ ] Add loading states for each chart component
- [ ] Implement error boundaries
- [ ] Add accessibility (ARIA labels, keyboard navigation)
- [ ] Test on mobile (responsive chart sizing)
- [ ] Performance: prevent re-render on parent state change
- [ ] Validation: ensure data types match (numbers in series, not strings)
- [ ] Tooltips: localized (Indonesian) number formatting
- [ ] Export: add "Export as PNG" for each chart
- [ ] Mobile: consider switching to table view on small screens

---

## 7. CODE EXAMPLE: REFACTORED SECTION

```tsx
// BEFORE: Two pie charts (problematic)
{athleteDist.series.length > 0 ? (
  <ReactApexChart
    type="pie"
    width={220}
    height={200}
    series={athleteDist.series}
    options={{ labels: athleteDist.labels, ... }}
  />
) : <span>Loading</span>}

// AFTER: Single grouped bar chart (scalable)
{athleteDist.series.length > 0 && groupDist.series.length > 0 ? (
  <ReactApexChart
    type="bar"
    width="100%"
    height={300}
    series={[
      { name: 'Atlet', data: athleteDist.series },
      { name: 'Kelompok', data: groupDist.series }
    ]}
    options={{
      chart: { stacked: false, toolbar: { show: true } },
      xaxis: { categories: athleteDist.labels },
      colors: ['#3b82f6', '#10b981'],
      ...
    }}
  />
) : <span>Loading</span>}
```

---

## Summary Table

| Section | Current | Recommended | Why |
|---------|---------|-------------|-----|
| Atlet & Kelompok | Pie × 2 | Grouped Bar | Scalable, comparable |
| Sarana | Progress bar | Dual cards + Bar | Shows distribution, not progress |
| Prasarana | Progress bar | Donut (if type avail) | Category insight |
| Prestasi | Line chart | H-Bar ranking | Correct semantic, ranking view |
| NEW | — | Scatter (correlation) | Advanced insight |

**Impact**: Transforms dashboard from **aesthetic-first** to **insight-first** with production-grade, scalable visualizations.
