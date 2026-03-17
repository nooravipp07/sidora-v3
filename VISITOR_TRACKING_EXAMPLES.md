# Contoh Implementasi Visitor Tracking

## Untuk Halaman Berita (News)

### File: `app/(public)/berita/page.tsx`

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';
import NewsCard from '@/components/public/news/NewsCard';

export default function NewsPage() {
  // Track this page visit
  useTrackPageView('/berita');

  // ... rest of component
  return (
    <div>
      {/* Your news content */}
    </div>
  );
}
```

## Untuk Halaman Artikel Detail

### File: `app/(public)/berita/[slug]/page.tsx`

```tsx
'use client';

import React from 'react';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  // Track dengan path yang lebih specific
  useTrackPageView(`/berita/${params.slug}`);

  // ... rest of component
  return (
    <div>
      {/* Article content */}
    </div>
  );
}
```

## Untuk Halaman Galeri

### File: `app/(public)/galeri/page.tsx`

```tsx
'use client';

import React from 'react';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';

export default function GalleryPage() {
  useTrackPageView('/galeri');

  // ... rest of component
}
```

## Untuk Halaman Agenda

### File: `app/(public)/agenda/page.tsx`

```tsx
'use client';

import React from 'react';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';

export default function AgendaPage() {
  useTrackPageView('/agenda');

  // ... rest of component
}
```

## Untuk Halaman Olahraga Prestasi

### File: `app/(public)/olahraga-prestasi/page.tsx`

```tsx
'use client';

import React from 'react';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';

export default function SportsPerformancePage() {
  useTrackPageView('/olahraga-prestasi');

  // ... rest of component
}
```

## Untuk Halaman Olahraga Masyarakat

### File: `app/(public)/olahraga-masyarakat/page.tsx`

```tsx
'use client';

import React from 'react';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';

export default function CommunitySportsPage() {
  useTrackPageView('/olahraga-masyarakat');

  // ... rest of component
}
```

## Untuk Halaman Infrastruktur Keolahragaan

### File: `app/(public)/infrastruktur-keolahragaan/page.tsx`

```tsx
'use client';

import React from 'react';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';

export default function SportsInfrastructurePage() {
  useTrackPageView('/infrastruktur-keolahragaan');

  // ... rest of component
}
```

## Tips Penting

1. **Selalu gunakan `'use client'`** - Tracking hanya bisa di client component
2. **Panggil hook di top level** - Jangan dalam conditional atau loop
3. **Gunakan path yang jelas** - `/berita` bukan `/page` 
4. **Untuk dynamic routes** - Include params dalam path: `/berita/slug-name`

## Checklist Implementasi

- [ ] Migrate database (`npx prisma migrate dev`)
- [ ] Tambahkan tracking ke homepage (`/`)
- [ ] Tambahkan tracking ke `/berita`
- [ ] Tambahkan tracking ke `/galeri`
- [ ] Tambahkan tracking ke `/agenda`
- [ ] Tambahkan tracking ke `/olahraga-prestasi`
- [ ] Tambahkan tracking ke `/olahraga-masyarakat`
- [ ] Tambahkan tracking ke `/infrastruktur-keolahragaan`
- [ ] Test di browser console
- [ ] Lihat statistik di admin dashboard

## Testing Tracking

Setelah implementasi, test dengan:

```javascript
// Di browser console
localStorage.getItem('visitor_session_id')  // Check session ID
// Harusnya akan melihat POST request ke /api/analytics/track-visitor
```

Atau buka Network tab → Filter `track-visitor` → Refresh halaman → Lihat request masuk
