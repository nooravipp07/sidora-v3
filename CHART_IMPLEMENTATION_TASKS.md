# Dashboard Charts - Implementation Checklist

Quick reference checklist for developers implementing the chart redesign.

---

## Pre-Implementation

- [ ] Read CHART_REDESIGN_EXECUTIVE_SUMMARY.md (5 mins)
- [ ] Skim IMPLEMENTATION_GUIDE_CHARTS.md (10 mins)
- [ ] Review current page.tsx lines 495-629 (the target section)
- [ ] Ensure ApexCharts is in package.json
- [ ] Create backup branch: `git checkout -b feature/chart-redesign`

---

## Step 1: Copy Components

- [ ] Copy `ChartComponents.tsx` from deliverables
- [ ] Create folder: `components/admin/dashboard/` (if not exists)
- [ ] Paste file at: `components/admin/dashboard/ChartComponents.tsx`
- [ ] Verify no import errors (check for missing dependencies)
- [ ] Run `npm run build` to check for TypeScript errors

---

## Step 2: Update Imports in page.tsx

In file: `app/(admin)/admin/page.tsx`

- [ ] Find top imports section (after existing imports)
- [ ] Add new import:
  ```typescript
  import {
    AthleteGroupBarChart,
    AchievementRankingChart,
    EquipmentMetrics,
    PrasaranaMetrics,
    PerformanceCorrelationChart,
  } from '@/components/admin/dashboard/ChartComponents';
  ```
- [ ] Verify no duplicate imports
- [ ] No import errors in console after save

---

## Step 3: Replace Athlete & Group Section (Lines ~530-567)

### Check
- [ ] Located section with title "ATLET & KELOMPOK OLAHRAGA"
- [ ] Found the two nested pie charts
- [ ] Located the surrounding `<article>` tags

### Replace
- [ ] Copy exact code from IMPLEMENTATION_GUIDE_CHARTS.md "Step 2 - AFTER"
- [ ] Remove entire old chart JSX (both pie charts)
- [ ] Paste new component call
- [ ] Verify closing tags match

### Verify
- [ ] Component receives correct props: `athleteDist`, `groupDist`, `dashboardSummary`, `isLoading`
- [ ] Comma placement correct after component
- [ ] File saves without errors

---

## Step 4: Replace Prestasi Atlet Section (Lines ~569-602)

### Check
- [ ] Located section with title "PRESTASI ATLET (Tren)"
- [ ] Found the custom SVG chart code (long polyline)
- [ ] Located surrounding `<article>` tags

### Update Icon
- [ ] Change icon from `<LineChart />` to `<BarChart3 />`
- [ ] Update title to: "PRESTASI ATLET (Peringkat Kecamatan)"

### Replace
- [ ] Copy code from IMPLEMENTATION_GUIDE_CHARTS.md "Step 4 - AFTER"
- [ ] Delete entire SVG section (all the custom calculation code)
- [ ] Paste new component
- [ ] Props: `kecamatanData`, `maxItems={12}`, `isLoading={isLoading}`

### Verify
- [ ] No more custom SVG code remains
- [ ] Component receives `kecamatanData` array
- [ ] File compiles without errors

---

## Step 5: Replace Sarana Section (Lines ~495-520)

### Check
- [ ] Located section with title "Sarana Summary"
- [ ] Found two div blocks with progress bars
- [ ] Identified hardcoded width values (100%, 75%)

### Replace
- [ ] Copy code from IMPLEMENTATION_GUIDE_CHARTS.md "Step 5 - AFTER"
- [ ] Delete old progress bar JSX
- [ ] Paste new component call
- [ ] Props: `totalRecords`, `totalQuantity`, `isLoading`

### Verify
- [ ] Three metric cards display instead of two progress bars
- [ ] Component receives correct data from `dashboardSummary`

---

## Step 6: Replace Prasarana Section (Lines ~521-536)

### Check
- [ ] Located section with title "Prasarana - Distribusi"
- [ ] Found single progress bar with hardcoded 85%

### Replace  
- [ ] Copy code from IMPLEMENTATION_GUIDE_CHARTS.md "Step 6 - AFTER"
- [ ] Delete old progress bar section
- [ ] Paste new component call
- [ ] Props: `totalCount`, `totalGroups`, `totalAthletes`, `isLoading`

### Verify
- [ ] Three metric cards show: Prasarana, Kelompok/Prasarana, Atlet/Prasarana
- [ ] Component receives correct data values

---

## Step 7: (OPTIONAL) Add Scatter Chart Section

Location: Before "Data Summary per Kecamatan" section (find `<h2>Data Summary per Kecamatan</h2>`)

- [ ] Add new `<section>` block (see IMPLEMENTATION_GUIDE_CHARTS.md "Step 5")
- [ ] Component props: `kecamatanData={kecamatanData}`, `isLoading={isLoading}`
- [ ] Verify section is self-contained

---

## Step 8: Test Rendering

In browser:

- [ ] Dashboard loads without errors
- [ ] All 4 main charts display (athlete, prestasi, sarana, prasarana)
- [ ] No console errors or warnings
- [ ] Charts are not blank (have data)
- [ ] Loading states disappear after data loads

---

## Step 9: Test Interactivity

For each chart:

- [ ] **Athlete Bar Chart**: Hover over bars → Tooltip shows values
- [ ] **Athlete Bar Chart**: Toolbar appears (top right) with export/zoom
- [ ] **Prestasi Bar Chart**: Bars sorted descending (top performer first)
- [ ] **Prestasi Bar Chart**: Hover shows tooltip with region name + achievement count
- [ ] **All charts**: Responsive on resize (open DevTools, drag window)

---

## Step 10: Test Data Validation

Make sure charts handle edge cases:

- [ ] **0 records**: Shows "Tidak ada data" gracefully
- [ ] **1 category**: Chart displays (no errors)
- [ ] **10+ categories**: All visible, readable
- [ ] **Filter changes** (year, kecamatan): Charts update instantly
- [ ] **Null/undefined values**: Charts don't break

### To test:
1. Filter to region with no data
2. Change year to empty year
3. Check console (should see no errors)

---

## Step 11: Test Responsive Design

On mobile (or DevTools):

- [ ] 320px width (iPhone SE): Charts stack vertically
- [ ] 480px width: Readable axis labels
- [ ] 768px width: Optimal layout
- [ ] 1024px+ (desktop): Intended layout
- [ ] No horizontal scroll needed

---

## Step 12: Performance Check

In DevTools > Performance tab:

- [ ] Initial load: <1 second
- [ ] Interaction: Hover tooltip <100ms
- [ ] Filter change: Chart update <500ms
- [ ] Memory > Performance Monitor: CPU <20% during interaction
- [ ] No memory leak: Check Memory tab (snapshot before/after)

---

## Step 13: Code Review Self-Check

- [ ] All hardcoded widths/percentages removed
- [ ] No custom SVG calculations remaining
- [ ] Component props match data structure
- [ ] No console.log() statements left
- [ ] No temporary code/comments
- [ ] Imports are clean (no unused)
- [ ] TypeScript strict mode: 0 errors

---

## Step 14: Cross-Browser Testing

Test on:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Edge (latest)

Each browser:
- [ ] Charts render correctly
- [ ] Tooltips appear on hover
- [ ] No visual glitches

---

## Step 15: Merge & Deploy

- [ ] All tests passing
- [ ] No console errors
- [ ] Git diff reviewed (only chart changes)
- [ ] Commit message clear: "Refactor: replace dashboard charts with ApexCharts"
- [ ] Push to feature branch
- [ ] Create PR with this checklist in description
- [ ] Code review approval
- [ ] Merge to main
- [ ] Deploy to staging/production

---

## Troubleshooting Reference

### Issue: "Chart is blank"
- [ ] Check props passed (console log them)
- [ ] Verify data is not empty: `series.length > 0`
- [ ] Ensure series is array of NUMBERS: `typeof series[0] === 'number'`

### Issue: "Tooltip not showing"
- [ ] Add import: `import 'apexcharts/dist/apexcharts.css';` (if not in layout)
- [ ] Check browser DevTools > Elements (tooltip div might be hidden)

### Issue: "Chart takes up wrong space"
- [ ] Check width setting: should be `width="100%"`
- [ ] Check parent container: should have defined width (Tailwind grid)
- [ ] Remove any hardcoded `width={220}` from old code

### Issue: "Charts not updating on filter change"
- [ ] Check `useEffect` dependencies include filter state
- [ ] Verify `fetchDashboardData()` is called when filters change
- [ ] Component props should be bound to state variables

### Issue: "TypeScript errors"
- [ ] Check import paths (use @/components/...)
- [ ] Verify component signature matches prop types
- [ ] Run `npm run build` for full error list

---

## Rollback Plan (If needed)

If serious issues found:

```bash
# Quick rollback to previous state
git revert <commit-hash>

# Or switch branch
git checkout main

# Or restore specific file
git checkout HEAD~1 -- app/(admin)/admin/page.tsx
```

Rollback takes ~5 minutes.

---

## Sign-Off Checklist

Before marking complete:

- [ ] All visual tests passed
- [ ] All interaction tests passed
- [ ] All edge cases handled
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Code reviewed
- [ ] PR approved
- [ ] Ready to merge ✅

---

## Documentation Updates

After successfully deploying:

- [ ] Update relevant documentation files
- [ ] Add note to deployment notes
- [ ] Tag team on completion
- [ ] Archive old chart docs as reference

---

## Estimated Duration

- Setup & imports: 15 mins
- Athlete bar chart: 20 mins
- Prestasi chart: 20 mins
- Sarana/Prasarana: 30 mins
- Testing & fixes: 45 mins
- **Total: 2.5-4 hours** (depending on edge cases)

---

## Quick Links Reference

- 📖 **Executive Summary**: CHART_REDESIGN_EXECUTIVE_SUMMARY.md
- 🛠️ **Implementation Guide**: IMPLEMENTATION_GUIDE_CHARTS.md (with code)
- 🔍 **Quick Reference**: CHART_REDESIGN_QUICK_REFERENCE.md
- 🎨 **Strategy Document**: DASHBOARD_CHART_REDESIGN.md
- 💻 **Components**: components/admin/dashboard/ChartComponents.tsx

---

**Print this checklist and check items off as you complete them!**

Begin with: IMPLEMENTATION_GUIDE_CHARTS.md (Step 1: Import)
