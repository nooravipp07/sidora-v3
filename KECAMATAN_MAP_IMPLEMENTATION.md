# KecamatanMap - Real Data Implementation Guide

## 📋 Overview

Implementasi KecamatanMap component dengan data real dari database. Map menampilkan summary athlete grouped by kecamatan beserta medal counts, dengan filtering berdasarkan organization dari roleId user.

## 🎯 Requirements

- ✅ Display summary data grouped by kecamatan
- ✅ Show athlete counts (ATLET, PELATIH, WASIT)
- ✅ Show medal counts (EMAS, PERAK, PERUNGGU)
- ✅ Filter by organization (KONI = roleId 4, NPCI = roleId 5)
- ✅ Fetch data real dari database
- ✅ Keep existing UI/template style
- ✅ Integration through groupId (user organization)

## 📂 Files Modified/Created

### 1. **Component** → `components/admin/dashboard-lembaga/KecamatanMap.tsx`
```tsx
// Key Changes:
// - Added useAuth() hook to get user roleId
// - Added useEffect to fetch kecamatan data from API
// - Implements role-based filtering
// - Added loading & error states
// - Renders map with real data from API
```

### 2. **Service** → `services/kecamatan.service.ts`
```ts
// Added method:
async getSummary(organization?: string | null): Promise<
  Array<{
    kecamatan: string;
    latitude: string;
    longitude: string;
    totalAthletes: number;
    totalCoaches: number;
    totalReferees: number;
    emasCount: number;
    perakCount: number;
    perungguCount: number;
    totalAtlet: number;
    totalPelatih: number;
    totalWasit: number;
  }>
>
```

### 3. **API Endpoint** → `app/api/kecamatan/summary/route.ts`
```
GET /api/kecamatan/summary?organization=KONI|NPCI
```

### 4. **Seed Script** → `prisma/seed-athletes.ts`
Updated with achievements/medals data:
- KONI: 3 ATLET, 2 PELATIH, 1 WASIT + medals
- NPCI: 3 ATLET, 2 PELATIH, 1 WASIT + medals

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User Login (roleId 4 or 5)                                  │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ KecamatanMap loads                                           │
├─────────────────────────────────────────────────────────────┤
│ 1. useAuth() → Get user roleId                              │
│ 2. useEffect → Fetch /api/kecamatan/summary?org=...         │
│ 3. Map roleId → organization                                │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ API Endpoint (GET /api/kecamatan/summary)                   │
├─────────────────────────────────────────────────────────────┤
│ 1. Parse query: ?organization=KONI|NPCI                     │
│ 2. Call KecamatanService.getSummary(organization)           │
│ 3. Return JSON response                                     │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ KecamatanService.getSummary()                               │
├─────────────────────────────────────────────────────────────┤
│ 1. Get all kecamatan from database                           │
│ 2. For each kecamatan:                                      │
│    - Get desa (villages) in kecamatan                        │
│    - Get athletes in those desa (filtered by org if given)   │
│    - Count by category (ATLET, PELATIH, WASIT)              │
│    - Count achievements by medal type                       │
│ 3. Return array of kecamatan with summary                   │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Database Queries                                             │
├─────────────────────────────────────────────────────────────┤
│ 1. SELECT * FROM kecamatan                                  │
│ 2. SELECT id FROM desa_kelurahan WHERE kecamatan_id = ?     │
│ 3. SELECT * FROM athletes JOIN achievements                 │
│    WHERE desa_id IN (?) AND organization = ? AND deleted=0  │
│ 4. GROUP BY category, medal                                 │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Component Renders Map                                       │
├─────────────────────────────────────────────────────────────┤
│ - Initialize Leaflet map                                    │
│ - Add OSM tile layer                                        │
│ - Add circle markers for each kecamatan                     │
│ - Show popups with summary data                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Role-Based Filtering

```typescript
// In KecamatanMap.tsx
if (user?.roleId === 4) {
  organization = 'KONI';        // Only KONI data
} else if (user?.roleId === 5) {
  organization = 'NPCI';        // Only NPCI data
}
// Other roles → no filter (all organizations)
```

## 📊 Popup Data Structure

Map popup menampilkan:
```
┌─ Kecamatan Name ─────────────────┐
│                                  │
│ Atlet:        3                  │
│ Pelatih:      2                  │
│ Wasit/Juri:   1                  │
│ ────────────────────────────────│
│                                  │
│ Medali:                          │
│  Emas: 5   Perak: 3  Perunggu: 2│
│                                  │
└──────────────────────────────────┘
```

## 📝 Database Schema Dependencies

### Relationships
```
Kecamatan (1) ─── (M) DesaKelurahan
   ↓
   └─→ (M) Athlete
         └─→ (M) AthleteAchievement
```

### Athlete Table
- `id` - Primary key
- `category` - ATLET | PELATIH | WASIT
- `organization` - KONI | NPCI | etc
- `desaKelurahanId` - Link to desa
- `deletedAt` - Soft delete flag

### AthleteAchievement Table
- `athleteId` - Foreign key to Athlete
- `medal` - EMAS | PERAK | PERUNGGU
- `achievementName` - Description
- `year` - Achievement year

## 🚀 Setup & Testing

### 1. Run Seed Script
```bash
# Populate test data with athletes and achievements
npx tsx prisma/seed-athletes.ts
```

This creates:
- **KONI**: 3 athletes + 6 achievement records (medals)
- **NPCI**: 3 athletes + 4 achievement records (medals)

### 2. Update User Roles (Optional)
If you need roleId 4 and 5:
```bash
# Edit prisma/seed.ts to add:
const koniRole = await prisma.role.create({
  data: { name: 'koni', description: 'KONI Admin' }
});
const npciRole = await prisma.role.create({
  data: { name: 'npci', description: 'NPCI Admin' }
});
```

### 3. Start Dev Server
```bash
npm run dev
```

### 4. Test Navigation
1. Login as admin
2. Go to `/admin/dashboard-lembaga`
3. Map should load with markers
4. Hover over markers to see popups
5. Check medals display

## 🔍 Debugging

### Check Component Loading
```typescript
// Add console.log in component
console.log('User:', user);
console.log('Kecamatan data:', kecamatanData);
console.log('Loading:', loading);
```

### Check API Response
DevTools → Network tab → `/api/kecamatan/summary`
```json
{
  "success": true,
  "data": [
    {
      "kecamatan": "ARIASARI",
      "latitude": "0",
      "longitude": "0",
      "totalAthletes": 3,
      "totalAtlet": 2,
      "totalPelatih": 1,
      "totalWasit": 0,
      "emasCount": 2,
      "perakCount": 1,
      "perungguCount": 0
    }
    // ... more kecamatan
  ]
}
```

### Check Database
```bash
# Direct SQL query
SELECT 
  dk.kecamatan_id,
  COUNT(*) as total_athletes,
  SUM(CASE WHEN a.category='ATLET' THEN 1 ELSE 0 END) as atlet_count,
  SUM(CASE WHEN a.category='PELATIH' THEN 1 ELSE 0 END) as pelatih_count,
  SUM(CASE WHEN a.category='WASIT' THEN 1 ELSE 0 END) as wasit_count,
  SUM(CASE WHEN aa.medal='EMAS' THEN 1 ELSE 0 END) as emas_count
FROM athletes a
JOIN desa_kelurahan dk ON a.desa_kelurahan_id = dk.id
LEFT JOIN athlete_achievements aa ON a.id = aa.athlete_id
WHERE a.deleted_at IS NULL
GROUP BY dk.kecamatan_id;
```

## 📋 Performance Considerations

### Current Implementation
- Fetches all kecamatan in one query
- For each kecamatan, fetches athletes via Prisma
- Total queries: 1 (kecamatan) + N (athletes per kecamatan)

### Optimization Options (if needed)
1. **Add Database Index** on `(organization, desaKelurahanId, deletedAt)`
2. **Implement Caching** - Cache API response for 5 minutes
3. **Use SQL JOIN** instead of N+1 queries
4. **Pagination** - Load kecamatan on demand

### Current Behavior
- Filters: organization (if provided)
- Excludes: soft-deleted athletes (deletedAt IS NOT NULL)
- Returns: only kecamatan with athlete data

## 🐛 Known Issues & Fixes

### Issue: Latitude/Longitude Always "0"
Currently hardcoded as fallback. To fix:
1. Add latitude/longitude to Kecamatan table
2. Update seed to include coordinates
3. Use actual coordinates in popup

### Issue: Map Not Rendering
Check:
1. Container div exists (#kecamatan-map-container)
2. Leaflet CSS loaded
3. Browser console for errors
4. Component mounted before data fetch

## ✅ Checklist

- [x] API endpoint created
- [x] Service method added
- [x] Component updated with useAuth
- [x] Data fetching implemented
- [x] Loading state added
- [x] Error handling implemented
- [x] Seed script updated with achievements
- [x] Filtering by organization implemented
- [x] Map rendering preserved
- [x] Template style maintained
- [ ] Add latitude/longitude coordinates
- [ ] Add caching for performance
- [ ] Add pagination if data grows

## 🔗 Related Files

- `lib/auth/useAuthh.ts` - Auth hook
- `services/athlete.service.ts` - Athlete summary method
- `services/kecamatan.service.ts` - Kecamatan summary method
- `prisma/schema.prisma` - Database schema
- `app/(admin)/admin/dashboard-lembaga/page.tsx` - Page using component
