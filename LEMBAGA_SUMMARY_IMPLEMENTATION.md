# LembagaSummaryCards - Real Data Implementation Guide

## 📋 Overview

Implementasi `LembagaSummaryCards` component dengan data real dari database. Component menampilkan summary athlete yang dikelompokkan berdasarkan kategori (ATLET, PELATIH, WASIT) dan di-filter berdasarkan roleId user.

## 🎯 Requirements

- ✅ Display summary data grouped by athlete category
- ✅ Filter by organization (KONI = roleId 4, NPCI = roleId 5)
- ✅ Fetch data real dari database
- ✅ Support role-based filtering
- ✅ Include loading and error states

## 📂 Files Modified/Created

### 1. **Component** → `components/admin/dashboard-lembaga/LembagaSummaryCards.tsx`
```tsx
// Key Changes:
// - Removed InstitutionSummary props
// - Added useAuth() hook for user data
// - Added useEffect to fetch athlete summary
// - Implements role-based filtering (roleId 4→KONI, roleId 5→NPCI)
// - Added loading skeleton UI
// - Added error handling
```

### 2. **Page Component** → `app/(admin)/admin/dashboard-lembaga/page.tsx`
```tsx
// Changed from passing props:
// - LembagaSummaryCards summary={institutionSummary} />
// + LembagaSummaryCards />
```

### 3. **API Endpoint** → `app/api/athlete/summary/route.ts`
```
GET /api/athlete/summary?organization=KONI|NPCI
```
- Accepts optional `organization` query parameter
- Returns athlete count by category

### 4. **Service** → `services/athlete.service.ts`
```ts
async getSummary(organization?: string | null): Promise<{
  totalAtlet: number;
  totalPelatih: number;
  totalWasit: number;
  total: number;
}>
```

### 5. **Seed Script** → `prisma/seed-athletes.ts`
- Test data dengan 12 athletes (6 KONI, 6 NPCI)
- Includes: Atlet, Pelatih, Wasit untuk setiap organization

## 🔄 Implementation Details

### Component Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ LembagaSummaryCards (Client Component)                      │
├─────────────────────────────────────────────────────────────┤
│ 1. useAuth() → Get user data (roleId, name)                 │
│ 2. Map roleId to organization:                              │
│    - roleId 4 → 'KONI'                                      │
│    - roleId 5 → 'NPCI'                                      │
│    - other → null (all data)                                │
│ 3. useEffect → Fetch /api/athlete/summary?org=...           │
│ 4. Display loading skeleton while fetching                  │
│ 5. Display error if fetch fails                             │
│ 6. Display summary cards with actual counts                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ API Endpoint (GET /api/athlete/summary)                     │
├─────────────────────────────────────────────────────────────┤
│ 1. Parse query param: ?organization=...                     │
│ 2. Call AthleteService.getSummary(organization)             │
│ 3. Return JSON response                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ AthleteService.getSummary()                                 │
├─────────────────────────────────────────────────────────────┤
│ 1. Build where clause (deletedAt = null)                    │
│ 2. Filter by organization if provided                       │
│ 3. Query athletes with Prisma                               │
│ 4. Count by category (ATLET, PELATIH, WASIT)                │
│ 5. Return summary object                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Database Query                                              │
├─────────────────────────────────────────────────────────────┤
│ SELECT id, category FROM athletes                           │
│ WHERE deletedAt IS NULL                                    │
│ AND (organization = ? OR organization NOT SPECIFIED)        │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Role-Based Filtering Logic

```typescript
// In LembagaSummaryCards.tsx
if (user?.roleId === 4) {
  organization = 'KONI';        // Filter untuk KONI
} else if (user?.roleId === 5) {
  organization = 'NPCI';        // Filter untuk NPCI
}
// Jika role lain → organization = null (semua data)
```

## 📊 Database Schema

### Athlete Table
```
- id (Int, Primary Key)
- nationalId (String, Unique)
- fullName (String)
- birthPlace (String)
- birthDate (DateTime)
- gender (String)
- desaKelurahanId (Int, Foreign Key)
- fullAddress (String)
- organization (String) ← KONI | NPCI | etc
- category (String)     ← ATLET | PELATIH | WASIT
- sportId (Int)
- photoUrl (String)
- createdAt (DateTime)
- updatedAt (DateTime)
- deletedAt (DateTime)  ← Soft delete flag
- status (String)       ← aktif | not aktif
```

## 🚀 Setup & Testing

### 1. Seed Test Data
```bash
# Run seed script to populate test athletes
npx tsx prisma/seed-athletes.ts
```

### 2. Update User Roles (Optional)
If you need to test with roleId 4 and 5:
```bash
# Edit prisma/seed.ts to add:
const koniRole = await prisma.role.create({
  data: { name: 'koni', description: 'KONI Administrator' }
});

const npciRole = await prisma.role.create({
  data: { name: 'npci', description: 'NPCI Administrator' }
});

// Then create users with these roles
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test in Browser
1. Login dengan admin user
2. Navigate ke `/admin/dashboard-lembaga`
3. Verify summary cards display counts
4. Check Network tab to see API response

## 📈 Testing Scenarios

### Scenario 1: KONI User (roleId 4)
```
Expected API Call: /api/athlete/summary?organization=KONI
Expected Display: 
  - Total Atlet: 3
  - Total Pelatih: 2
  - Total Wasit: 1
```

### Scenario 2: NPCI User (roleId 5)
```
Expected API Call: /api/athlete/summary?organization=NPCI
Expected Display:
  - Total Atlet: 3
  - Total Pelatih: 2
  - Total Wasit: 1
```

### Scenario 3: Admin User (roleId 1 or 2)
```
Expected API Call: /api/athlete/summary
Expected Display:
  - Total Atlet: 6
  - Total Pelatih: 4
  - Total Wasit: 2
```

## 🎨 UI Components

### Summary Cards
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Total      │  │   Total      │  │   Total      │
│    Atlet     │  │   Pelatih    │  │ Wasit/Juri   │
│              │  │              │  │              │
│      3       │  │      2       │  │      1       │
│    👥       │  │    🏆       │  │    🛡️      │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Loading State
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ ■■■■■■■■     │  │ ■■■■■■■■     │  │ ■■■■■■■■     │
│              │  │              │  │              │
│ ■■■■         │  │ ■■■■         │  │ ■■■■         │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Error State
```
┌─────────────────────────────────────────────────────┐
│ Error: Failed to fetch data                         │
└─────────────────────────────────────────────────────┘
```

## 🐛 Debugging

### Check Component Props
```typescript
// Add console.log in component
console.log('User:', user);
console.log('Organization filter:', organization);
```

### Check API Response
```typescript
// Browser DevTools → Network → athlete/summary
// Check Headers, Parameters, Response
```

### Check Database
```bash
# Open Prisma Studio
npm run db:studio

# Query athletes directly
npx prisma studio
```

## 📝 Notes

1. **Category Values**: Pastikan athlete data menggunakan nilai exact:
   - 'ATLET' (bukan 'Atlet' atau 'athlete')
   - 'PELATIH' (bukan 'Pelatih' atau 'coach')
   - 'WASIT' (bukan 'Wasit' atau 'referee')

2. **Organization Values**: Match dengan seed data
   - 'KONI'
   - 'NPCI'

3. **Soft Delete**: Query sudah exclude `deletedAt IS NOT NULL`

4. **Performance**: Untuk data besar, pertimbangkan:
   - Add pagination
   - Add caching
   - Optimize database index

5. **Security**: Component sudah:
   - Require authenticated user (useAuth)
   - Filter by user's roleId
   - Include error handling

## ✅ Checklist

- [x] Component updated dengan useAuth hook
- [x] API endpoint created
- [x] Service method added
- [x] Loading state implemented
- [x] Error handling added
- [x] Seed data created
- [x] Role-based filtering implemented
- [x] Documentation written
- [ ] Test with actual database (WIP)
- [ ] Deploy to production

## 🔗 Related Files

- `lib/auth/useAuthh.ts` - Auth hook
- `repositories/athlete.repository.ts` - Database connector
- `types/athlete.ts` - Type definitions
- `prisma/schema.prisma` - Database schema
