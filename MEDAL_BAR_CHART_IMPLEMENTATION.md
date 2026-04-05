# MedalBarChart - Real Data Implementation Guide

## 📋 Overview

Implementasi MedalBarChart component dengan data real dari database. Component menampilkan total medal counts (Emas, Perak, Perunggu) dengan filtering berdasarkan organization dari roleId user.

## 🎯 Requirements

- ✅ Display total medal counts by type (Emas, Perak, Perunggu)
- ✅ Filter by organization (KONI = roleId 4, NPCI = roleId 5)
- ✅ Fetch data real dari database (athlete achievements)
- ✅ Support year filtering
- ✅ Include loading and error states
- ✅ Keep existing UI/template style

## 📂 Files Modified/Created

### 1. **Component** → `components/admin/dashboard-lembaga/MedalBarChart.tsx`
```tsx
// Key Changes:
// - Removed mock data imports
// - Added useAuth() hook to get user roleId
// - Added useEffect to fetch medal data from API
// - Implements role-based filtering
// - Added loading skeleton UI
// - Added error handling
// - Year filter still available
```

### 2. **Service** → `services/dashboard.service.ts`
```ts
// Added method:
async getMedalSummary(
  organization?: string | null,
  year?: number
): Promise<{
  emasCount: number;
  perakCount: number;
  perungguCount: number;
  totalMedals: number;
}>
```

### 3. **API Endpoint** → `app/api/medal/summary/route.ts`
```
GET /api/medal/summary?organization=KONI|NPCI&year=2024
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User Login (roleId 4 or 5, or other)                        │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ MedalBarChart Component                                     │
├─────────────────────────────────────────────────────────────┤
│ 1. useAuth() → Get user roleId                              │
│ 2. User selects year (or uses current)                      │
│ 3. useEffect → Fetch /api/medal/summary?org=...&year=...    │
│ 4. Map roleId → organization                                │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ API Endpoint (GET /api/medal/summary)                       │
├─────────────────────────────────────────────────────────────┤
│ 1. Parse query: ?organization=KONI|NPCI&year=2024           │
│ 2. Call DashboardService.getMedalSummary(org, year)         │
│ 3. Return JSON response                                     │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ DashboardService.getMedalSummary()                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Build where clause (deletedAt=null, org=?, year=?)       │
│ 2. Query athlete achievements from database                 │
│ 3. Count by medal type (EMAS, PERAK, PERUNGGU)              │
│ 4. Return summary object with counts                        │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ Database Query                                              │
├─────────────────────────────────────────────────────────────┤
│ SELECT * FROM athlete_achievements                          │
│ WHERE athlete.deleted_at IS NULL                            │
│ AND athlete.organization = ? (if provided)                  │
│ AND year = ?                                                │
│ GROUP BY medal                                              │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ Component Renders Challenge Cards                           │
├─────────────────────────────────────────────────────────────┤
│ - Emas count card                                           │
│ - Perak count card                                          │
│ - Perunggu count card                                       │
│ - Total medals summary                                      │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Role-Based Filtering

```typescript
// In MedalBarChart.tsx
if (user?.roleId === 4) {
  organization = 'KONI';        // Only KONI medals
} else if (user?.roleId === 5) {
  organization = 'NPCI';        // Only NPCI medals
}
// Other roles → no filter (all organizations)
```

## 📊 Database Schema Dependencies

### AthleteAchievement Table
```
- id (Int, Primary Key)
- athleteId (Int, Foreign Key → Athlete)
- achievementName (String)
- category (String)
- medal (String)          ← EMAS | PERAK | PERUNGGU
- year (Int)              ← Achievement year
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Athlete Table (for filtering)
```
- id (Int, Primary Key)
- organization (String)   ← KONI | NPCI | etc
- deletedAt (DateTime)    ← Soft delete flag
```

## 🔗 Relationships

```
Athlete (1) ─── (M) AthleteAchievement
  ↓
organization (for filtering)
deletedAt (for filtering)
```

## 🚀 Setup & Testing

### 1. Ensure Seed Data Exists
```bash
# Run seed script to populate test data
npx tsx prisma/seed-athletes.ts
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Test in Browser
1. Login as admin (or with roleId 4/5)
2. Navigate to `/admin/dashboard-lembaga`
3. Medal card should display medal counts
4. Change year selector to see different data
5. Check Network tab to see API response

## 📈 Testing Scenarios

### Scenario 1: KONI User (roleId 4)
```
Expected API Call: /api/medal/summary?organization=KONI&year=2026
Expected Display (from seed data):
  - Emas: 3
  - Perak: 0
  - Perunggu: 0
  - Total: 3
```

### Scenario 2: NPCI User (roleId 5)
```
Expected API Call: /api/medal/summary?organization=NPCI&year=2026
Expected Display (from seed data):
  - Emas: 2
  - Perak: 0
  - Perunggu: 2
  - Total: 4
```

### Scenario 3: Admin User (roleId 1 or 2)
```
Expected API Call: /api/medal/summary?year=2026
Expected Display (from seed data):
  - Emas: 5
  - Perak: 0
  - Perunggu: 2
  - Total: 7
```

## 🏛 UI Sections

### Header Section
```
┌─────────────────┬────────────┐
│ Perolehan Medali│ Year select│
│ Subtitle        │  2026 ▼    │
└─────────────────┴────────────┘
```

### Medal Cards (3 columns)
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ ■ Emas   │  │ ■ Perak  │  │ ■Perunggu│
│          │  │          │  │          │
│    5     │  │    0     │  │    2     │
└──────────┘  └──────────┘  └──────────┘
```

### Total Summary
```
┌────────────────────────────────┐
│ Total Medali          7        │
└────────────────────────────────┘
```

## 🐛 Debugging

### Check Component Loading
```typescript
// Add console.log in component
console.log('User:', user);
console.log('Selected year:', selectedYear);
console.log('Medal summary:', medalSummary);
console.log('Loading:', loading);
```

### Check API Response
DevTools → Network tab → `/api/medal/summary`
```json
{
  "success": true,
  "data": {
    "emasCount": 5,
    "perakCount": 0,
    "perungguCount": 2,
    "totalMedals": 7
  }
}
```

### Check Database
```bash
# Direct SQL query
SELECT 
  medal,
  COUNT(*) as count
FROM athlete_achievements
WHERE YEAR(created_at) = 2026
GROUP BY medal;
```

## 📝 Medal Value Format

The database can store medals in different formats:
- **Uppercase**: EMAS, PERAK, PERUNGGU
- **Mixed case**: Emas, Perak, Perunggu

The API normalizes to uppercase before counting:
```typescript
const medal = achievement.medal?.toUpperCase();
if (medal === 'EMAS') emasCount++;
```

## ⚡ Performance Notes

### Current Behavior
- Loads medal data on component mount
- Refetches when year changes
- No caching

### For Production (Optional)
1. **Add caching** - Cache API response for 1 hour
2. **Add indexing** - Index `(deleted_at, organization, year)` on athlete_achievements
3. **Aggregate table** - For large datasets, consider pre-aggregated medal counts

## ✅ Checklist

- [x] API endpoint created
- [x] Service method added
- [x] Component updated with useAuth
- [x] Data fetching implemented
- [x] Loading state added
- [x] Error handling implemented
- [x] Filtering by organization implemented
- [x] Year filtering maintained
- [x] UI/template preserved
- [x] Seed data includes achievements
- [ ] Add pagination (if many medals)
- [ ] Add caching for performance
- [ ] Deploy to production

## 🔗 Related Files

- `lib/auth/useAuthh.ts` - Auth hook
- `services/dashboard.service.ts` - Medal summary method
- `prisma/schema.prisma` - Database schema
- `prisma/seed-athletes.ts` - Seed data with achievements
- `app/(admin)/admin/dashboard-lembaga/page.tsx` - Page using component
