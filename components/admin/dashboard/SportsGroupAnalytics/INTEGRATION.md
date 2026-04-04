/**
 * Integration Guide
 * How to integrate SportsGroup Analytics Dashboard into your admin pages
 */

# Integration Guide

## Option 1: Add to Existing Admin Dashboard Page

### Step 1: Import the Dashboard Component

In your admin page (e.g., `app/(admin)/admin/page.tsx`):

```typescript
import {
  Dashboard as SportsGroupDashboard
} from '@/components/admin/dashboard/SportsGroupAnalytics';

// Or import individual components
import {
  RegionalGroupChart,
  VerificationStatusChart,
  GrowthTrendChart,
  MemberDistributionChart,
} from '@/components/admin/dashboard/SportsGroupAnalytics';
```

### Step 2: Add to Your Page

#### Option A: Use Complete Dashboard

```typescript
export default function AdminPage() {
  return (
    <div>
      {/* Your existing admin content */}
      <SportsGroupDashboard />
    </div>
  );
}
```

#### Option B: Include Individual Charts

```typescript
'use client';

import { useState, useEffect } from 'react';
import {
  RegionalGroupChart,
  VerificationStatusChart,
  GrowthTrendChart,
  MemberDistributionChart,
  SportsGroup,
} from '@/components/admin/dashboard/SportsGroupAnalytics';

export default function AdminPage() {
  const [groups, setGroups] = useState<SportsGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sports-groups');
      const data = await response.json();
      setGroups(data);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Your existing dashboard sections */}

      {/* Sports Group Analytics Section */}
      <section className="py-8 border-t">
        <h2 className="text-2xl font-bold mb-6">
          Analitik Kelompok Olahraga
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <RegionalGroupChart data={groups} isLoading={isLoading} />
          <VerificationStatusChart data={groups} isLoading={isLoading} />
        </div>

        <div className="mt-8">
          <GrowthTrendChart data={groups} isLoading={isLoading} />
        </div>

        <div className="mt-8">
          <MemberDistributionChart
            data={groups}
            isLoading={isLoading}
            highlightOutliers={true}
          />
        </div>
      </section>
    </div>
  );
}
```

## Option 2: Create Dedicated SportsGroup Analytics Page

### Step 1: Create New Route

Create file: `app/(admin)/admin/sports-groups-analytics/page.tsx`

```typescript
'use client';

import { Suspense } from 'react';
import SportsGroupDashboard from '@/components/admin/dashboard/SportsGroupAnalytics';

export default function SportsGroupsAnalyticsPage() {
  return (
    <Suspense fallback={<LoadingDashboard />}>
      <SportsGroupDashboard />
    </Suspense>
  );
}

function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Memuat dashboard...</div>
    </div>
  );
}
```

### Step 2: Add Navigation Link

In your admin sidebar/navigation:

```typescript
// components/admin/Sidebar.tsx or similar
const navItems = [
  // ... existing items
  {
    label: 'Analitik Kelompok',
    href: '/admin/sports-groups-analytics',
    icon: 'ChartIcon',
  },
];
```

## Option 3: Server-Side Data Integration

### Step 1: Create Data Fetching Function

```typescript
// lib/sports-group/fetch.ts
import { prisma } from '@/lib/prisma';

export async function fetchSportsGroups() {
  return await prisma.sportsGroup.findMany({
    include: {
      desaKelurahan: {
        select: { id: true, name: true }
      }
    }
  });
}

export async function fetchRegionMapping() {
  const regions = await prisma.desaKelurahan.findMany({
    select: { id: true, name: true }
  });
  return new Map(regions.map(r => [r.id, r.name]));
}
```

### Step 2: Use in Server Component

```typescript
// app/(admin)/admin/sports-groups/page.tsx
import { Suspense } from 'react';
import {
  RegionalGroupChart,
  VerificationStatusChart,
  GrowthTrendChart,
  MemberDistributionChart,
} from '@/components/admin/dashboard/SportsGroupAnalytics';
import { fetchSportsGroups, fetchRegionMapping } from '@/lib/sports-group/fetch';

async function SportsGroupCharts() {
  const groups = await fetchSportsGroups();
  const regionMap = await fetchRegionMapping();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RegionalGroupChart data={groups} regionMap={regionMap} />
        <VerificationStatusChart data={groups} />
      </div>
      <GrowthTrendChart data={groups} />
      <MemberDistributionChart data={groups} highlightOutliers={true} />
    </div>
  );
}

export default function SportsGroupsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analitik Kelompok Olahraga</h1>
      <Suspense fallback={<LoadingCharts />}>
        <SportsGroupCharts />
      </Suspense>
    </div>
  );
}

function LoadingCharts() {
  return (
    <div className="space-y-8">
      <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}
```

## Option 4: With Real-Time Updates

### Step 1: Create API Endpoint

```typescript
// app/api/sports-groups/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const groups = await prisma.sportsGroup.findMany({
      include: {
        desaKelurahan: {
          select: { id: true, name: true }
        }
      }
    });

    // Transform to expected format
    const transformed = groups.map(g => ({
      id: g.id,
      desaKelurahanId: g.desaKelurahanId,
      groupName: g.groupName,
      leaderName: g.leaderName,
      memberCount: g.memberCount,
      isVerified: g.isVerified,
      decreeNumber: g.decreeNumber,
      secretariatAddress: g.secretariatAddress,
      createdAt: g.createdAt,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}
```

### Step 2: Use with useSWR or useQuery

```typescript
'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  RegionalGroupChart,
  SportsGroup,
} from '@/components/admin/dashboard/SportsGroupAnalytics';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function SportsGroupDashboard() {
  const { data: groups, isLoading, error } = useSWR<SportsGroup[]>(
    '/api/sports-groups',
    fetcher,
    { revalidateOnFocus: false }
  );

  if (error) return <div>Failed to load</div>;
  if (!groups) return <div>Loading...</div>;

  return <RegionalGroupChart data={groups} />;
}
```

## Option 5: With Filtering & Pagination

### Step 1: Create Filtered API

```typescript
// app/api/sports-groups/filtered/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const verified = searchParams.get('verified');
  const regionId = searchParams.get('regionId');
  const skip = parseInt(searchParams.get('skip') || '0');
  const take = parseInt(searchParams.get('take') || '100');

  const where: any = {};
  if (verified !== null) {
    where.isVerified = verified === 'true';
  }
  if (regionId) {
    where.desaKelurahanId = parseInt(regionId);
  }

  const groups = await prisma.sportsGroup.findMany({
    where,
    skip,
    take,
  });

  const total = await prisma.sportsGroup.count({ where });

  return NextResponse.json({ groups, total });
}
```

### Step 2: Use with Filters

```typescript
'use client';

import { useState, useQuery } from 'swr';
import {
  RegionalGroupChart,
  SportsGroup,
} from '@/components/admin/dashboard/SportsGroupAnalytics';

export default function FilteredDashboard() {
  const [filter, setFilter] = useState('all');

  const query = new URLSearchParams({
    verified: filter === 'verified' ? 'true' : filter === 'unverified' ? 'false' : '',
  }).toString();

  const { data: response, isLoading } = useSWR(
    `/api/sports-groups/filtered?${query}`,
    fetcher
  );

  const groups = response?.groups || [];

  return (
    <div>
      {/* Filter buttons */}
      <div className="mb-6 flex gap-2">
        {['all', 'verified', 'unverified'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? 'active' : ''}
          >
            {f === 'all' ? 'Semua' : f === 'verified' ? 'Terverifikasi' : 'Belum'}
          </button>
        ))}
      </div>

      {/* Charts */}
      <RegionalGroupChart data={groups} isLoading={isLoading} />
    </div>
  );
}
```

## Step-by-Step Integration Checklist

- [ ] Copy all component files to` components/admin/dashboard/SportsGroupAnalytics/`
- [ ] Ensure `apexcharts` and `react-apexcharts` are installed
- [ ] Choose integration option (1-5) above
- [ ] Create/update your page component
- [ ] Set up data fetching (API or direct database)
- [ ] Test charts with mock data
- [ ] Replace mock data with real data
- [ ] Add error handling
- [ ] Implement loading states
- [ ] Style to match your dashboard
- [ ] Add navigation links if needed
- [ ] Test on mobile devices

## Database Schema

Ensure your Prisma schema includes:

```prisma
model SportsGroup {
  id                  Int     @id @default(autoincrement())
  desaKelurahanId     Int
  groupName           String
  leaderName          String?
  memberCount         Int
  isVerified          Boolean @default(false)
  decreeNumber        String?
  secretariatAddress  String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  desaKelurahan       DesaKelurahan @relation(fields: [desaKelurahanId], references: [id])

  @@index([desaKelurahanId])
  @@index([isVerified])
  @@index([createdAt])
}

model DesaKelurahan {
  id          Int     @id @default(autoincrement())
  name        String
  kecamatanId Int
  // ... other fields

  sportsGroups SportsGroup[]

  @@index([kecamatanId])
}
```

## Common Issues & Solutions

### Charts not showing data
- Verify data structure matches `SportsGroup` interface
- Check browser console for errors
- Ensure `'use client'` directive in component

### Slow performance
- Reduce data points with `limit` prop
- Use `useMemo` for data filtering
- Implement pagination for large datasets

### Styling issues
- Verify Tailwind CSS is configured
- Check dark mode configuration
- Inspect with browser DevTools

### API errors
- Check API endpoint returns correct format
- Verify CORS if calling from different domain
- Add error logging and boundaries

## Email/Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive: Mobile, Tablet, Desktop
- Performance: Optimized for datasets up to 10,000 groups

## Next Steps

1. **Caching**: Add Redis caching for frequently accessed data
2. **Exports**: Add button to export charts as PDF/PNG
3. **Scheduling**: Set up automated report generation
4. **Alerts**: Add real-time alerts for important metrics
5. **Customization**: Create admin panel for chart customization
