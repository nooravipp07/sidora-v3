# SIDORA-V3 Refactored Import Patterns & Examples

## Quick Start Guide to Using the New Architecture

### 1. Import Type Definitions
```typescript
// OLD (deprecated, still works but don't use)
import { FilterOptions } from '@/lib/sports-performance/types';

// NEW ✅
import { FilterOptions } from '@/types/sports-performance';
import { AuthUser, LoginResponse } from '@/types/auth';
import { Institution, Athlete } from '@/types/institution';
```

### 2. Import UI Components
```typescript
// OLD (deprecated)
import PerformanceStatsCards from '@/lib/components/sports-performance/PerformanceStatsCards';
import ClubTable from '@/lib/components/sports/ClubTable';

// NEW ✅ (using barrel exports)
import { PerformanceStatsCards, PerformanceFilters, PerformanceTable } from '@/components/ui/sports-performance';
import { AthleteStatsCards, ClubSummaryCards, ClubTable } from '@/components/ui/sports';
import { CommunityStatsCards, CommunityFilters } from '@/components/ui/community-sports';
```

### 3. Import Public Page Components
```typescript
// OLD
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AgendaFilters from "../components/agenda/AgendaFilters";

// NEW ✅ (from layout files)
import { Navbar, Footer } from '@/components/public/navigation';
import { HeroSlider, StatisticsSection, NewsSection } from '@/components/public/sections';
import { AgendaFilters, AgendaTable } from '@/components/public/agenda';
import { NewsCard, HeadlineNews, Pagination } from '@/components/public/news';
import { GalleryCard, GalleryPagination } from '@/components/public/gallery';
import { InfrastructureTable, InfrastructureFilters } from '@/components/public/infrastructure';
```

### 4. Import from Auth Module
```typescript
// These still work (backward compatible via barrel export)
import { prisma, AuthUser, generateToken, verifyToken } from '@/lib/auth';
import { useAuth, useRole, useLogout } from '@/lib/auth/useAuth';
import { ProtectedRoute, RoleBasedAccess } from '@/lib/auth/ProtectedRoute';

// NEW ✅ (direct import for Prisma)
import { prisma } from '@/lib/prisma';
import type { AuthUser } from '@/types/auth';
```

### 5. Import Admin Components
```typescript
import { DataModal } from '@/components/admin';
```

---

## File Organization Examples

### Example 1: Creating a New Page with Components

**File:** `app/(public)/sports/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// NEW: Import types from centralized types directory
import type { FilterOptions } from '@/types/sports';
import { AthleteStats } from '@/types/sports';

// NEW: Import components from barrel exports
import { AthleteStatsCards, ClubTable } from '@/components/ui/sports';

// Keep importing data as-is (stays in lib/{feature}/data.ts)
import { getAthleteStats, getClubs, filterClubs } from '@/lib/sports/data';

export default function SportsPage() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const stats = getAthleteStats();
  const clubs = filterClubs(filters);

  return (
    <div className="space-y-6">
      <AthleteStatsCards stats={stats} />
      <ClubTable clubs={clubs} />
    </div>
  );
}
```

### Example 2: Creating a Service Class (Ready for Implementation)

**File:** `services/sports.service.ts` (Future Use)
```typescript
import { prisma } from '@/lib/prisma';
import type { Athlete, Club } from '@/types/sports';
import { athleteRepository } from '@/repositories/athlete.repository';

export class SportsService {
  async getAllAthletes(): Promise<Athlete[]> {
    return athleteRepository.find();
  }

  async getAthleteStats() {
    const totalAthletes = await athleteRepository.count();
    const activeAthletes = await athleteRepository.countActive();
    // ... more logic
    return { totalAthletes, activeAthletes };
  }
}

export const sportsService = new SportsService();
```

### Example 3: Creating a Repository Class (Ready for Implementation)

**File:** `repositories/athlete.repository.ts` (Future Use)
```typescript
import { prisma } from '@/lib/prisma';
import type { Athlete } from '@/types/sports';

export class AthleteRepository {
  async find(): Promise<Athlete[]> {
    return prisma.athlete.findMany();
  }

  async findById(id: string): Promise<Athlete | null> {
    return prisma.athlete.findUnique({ where: { id } });
  }

  async count(): Promise<number> {
    return prisma.athlete.count();
  }

  async countActive(): Promise<number> {
    return prisma.athlete.count({ where: { isActive: true } });
  }
}

export const athleteRepository = new AthleteRepository();
```

---

## Barrel Export Pattern

### What are Barrel Exports?
Barrel exports are `index.ts` files that re-export multiple components, making imports cleaner.

### Example: components/ui/sports/index.ts
```typescript
export { default as AthleteStatsCards } from '@/lib/components/sports/AthleteStatsCards';
export { default as AchievementStatistics } from '@/lib/components/sports/AchievementStatistics';
export { default as ClubSummaryCards } from '@/lib/components/sports/ClubSummaryCards';
export { default as ClubTable } from '@/lib/components/sports/ClubTable';
```

### Benefits
- **Cleaner imports:** Instead of importing from specific files, import from one index
- **Easy refactoring:** If you move a component, only update the barrel export
- **Better discovery:** See all available components in one file

---

## Migration Guide: Converting Old Code to New Structure

### Step 1: Update Type Imports
```typescript
// BEFORE
import { FilterOptions } from '@/lib/community-sports/types';

// AFTER
import { FilterOptions } from '@/types/community-sports';
```

### Step 2: Update Component Imports
```typescript
// BEFORE
import SummaryCards from '../components/infrastructure/SummaryCards';
import InfrastructureTable from '../components/infrastructure/InfrastructureTable';

// AFTER
import { SummaryCards, InfrastructureTable } from '@/components/public/infrastructure';
```

### Step 3: Update Prisma Imports (if needed)
```typescript
// BEFORE (still works)
import { prisma } from '@/lib/auth/prisma';
import { prisma } from '@/lib/auth';

// AFTER (new preferred way)
import { prisma } from '@/lib/prisma';
```

---

## Common Import Patterns by Domain

### Sports Domain
```typescript
import type { Athlete, Club, Achievement, AthleteStats } from '@/types/sports';
import { AthleteStatsCards, ClubTable, AchievementStatistics } from '@/components/ui/sports';
import { getAthletes, getClubs } from '@/lib/sports/data';
```

### Community Sports Domain
```typescript
import type { CommunitySportsPerson, CommunityStats, FilterOptions } from '@/types/community-sports';
import { CommunityStatsCards, CommunityFilters, CommunityTable } from '@/components/ui/community-sports';
import { getCommunityData, filterCommunities } from '@/lib/community-sports/data';
```

### Performance Sports Domain
```typescript
import type { PerformancePerson, OrganizationStats } from '@/types/sports-performance';
import { PerformanceStatsCards, PerformanceFilters, PerformanceTable } from '@/components/ui/sports-performance';
import { getPerformanceData } from '@/lib/sports-performance/data';
```

### Institution Domain
```typescript
import type { Institution, Athlete as InstitutionAthlete, Medal } from '@/types/institution';
import { getInstitutions, getAthletes } from '@/lib/institution/data';
```

### Authentication
```typescript
import type { AuthUser, LoginRequest, AuthToken } from '@/types/auth';
import { useAuth, useRole, useLogout } from '@/lib/auth/useAuth';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { prisma } from '@/lib/prisma'; // or from '@/lib/auth'
```

---

## Directory Quick Reference

```
@/components/ui/                    → Reusable UI components
@/components/ui/sports/             → Sports components (athletes, clubs, achievements)
@/components/ui/community-sports/   → Community sports components
@/components/ui/sports-performance/ → Performance sports components

@/components/public/                → Public page components
@/components/public/navigation/     → Navbar, Footer
@/components/public/sections/       → Home page sections (Hero, Stats, Agenda, etc.)
@/components/public/agenda/         → Event-related components
@/components/public/news/           → News article components
@/components/public/gallery/        → Photo gallery components
@/components/public/infrastructure/ → Sports facility components

@/components/admin/                 → Admin page components (DataModal, etc.)

@/types/                            → Type definitions (centralized)
@/types/sports.ts                   → Sports types
@/types/community-sports.ts         → Community sports types
@/types/sports-performance.ts       → Performance sports types
@/types/institution.ts              → Institution types
@/types/auth.ts                     → Authentication types
@/types/district.ts                 → District types
@/types/agenda.ts                   → Event types
@/types/gallery.ts                  → Gallery types
@/types/news.ts                     → News types
@/types/infrastructure.ts           → Infrastructure types

@/lib/prisma.ts                     → Database client (centralized)
@/lib/auth/                         → Authentication utilities
@/lib/{feature}/data.ts             → Mock/feature data (unchanged)

@/services/                         → Business logic layer (ready for use)
@/repositories/                     → Data access patterns (ready for use)
@/middleware/                       → Centralized middleware (ready for use)
@/utils/                            → Helper functions (ready for use)
```

---

## What Hasn't Changed

These locations remain unchanged and still work as before:
- `lib/auth/jwt.ts` - JWT utilities
- `lib/auth/bcrypt.ts` - Password hashing
- `lib/auth/useAuth.tsx` - React hooks
- `lib/auth/ProtectedRoute.tsx` - Route protection
- `lib/{feature}/data.ts` - Mock/feature data files
- `app/api/*` - API routes
- `middleware.ts` - Root middleware
- `prisma/schema.prisma` - Database schema

---

## Best Practices Going Forward

1. **Always import types from `@/types/{domain}`** - Never from lib/*/types
2. **Use barrel exports for components** - Import from `@/components/{domain}/{feature}`
3. **Use `@/lib/prisma` for database client** - Not from lib/auth
4. **Keep feature data in lib** - `lib/{feature}/data.ts` remains unchanged
5. **Service/Repository pattern ready** - Start implementing in `services/` and `repositories/`

---

## Questions & Troubleshooting

**Q: My old imports still work, what's changed?**
A: Backward compatibility is maintained through barrel exports. However, use the new patterns for consistency.

**Q: Where do I put new UI components?**
A: In `components/ui/{domain}/Component.tsx` and export from `index.ts`

**Q: Where do business logic go?**
A: Create services in `services/{feature}.service.ts` (ready for implementation)

**Q: Where do database queries go?**
A: Create repositories in `repositories/{feature}.repository.ts` (ready for implementation)

**Q: Can I still use the old file structure?**
A: Yes, but prefer the new structure for new code.
