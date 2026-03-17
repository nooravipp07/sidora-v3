# 📊 Visitor Statistics System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    VISITOR TRACKING SYSTEM                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   PUBLIC PAGES       │         │  CLIENT-SIDE         │
│  (User Access)       │─────→   │  (useTrackPageView)  │
│                      │         │                      │
│ - Homepage       /   │         │ - Generate sessionId │
│ - Berita         /   │         │ - Detect device      │
│ - Galeri         /   │         │ - Get referrer       │
│ - Agenda         /   │         └──────────────────────┘
│ - Olahraga..     /   │                    │
│ - Infrastruktur  /   │                    │
└──────────────────────┘                    ↓
                            ┌──────────────────────────────┐
                            │   API ENDPOINT               │
                            │ /api/analytics/track-visitor │
                            │   (POST)                     │
                            └──────────────────────────────┘
                                        │
                                        ↓
                            ┌──────────────────────┐
                            │   DATABASE           │
                            │   (Visitor Table)    │
                            │                      │
                            │ - sessionId          │
                            │ - ipAddress          │
                            │ - userAgent          │
                            │ - deviceType         │
                            │ - page               │
                            │ - visitedAt          │
                            └──────────────────────┘
                                        │
                                        ↓
                            ┌──────────────────────┐
                            │   ANALYTICS SERVICE  │
                            │ AnalyticsService     │
                            │                      │
                            │ - Count unique       │
                            │   sessions           │
                            │ - Calculate trend    │
                            │ - Compare periods    │
                            └──────────────────────┘
                                        │
                                        ↓
                            ┌──────────────────────┐
                            │   API STATISTICS     │
                            │ /api/analytics/      │
                            │  visitors (GET)      │
                            └──────────────────────┘
                                        │
                                        ↓
                            ┌──────────────────────┐
                            │   ADMIN DASHBOARD    │
                            │                      │
                            │ Statistik Pengunjung │
                            │ - Total bulan ini    │
                            │ - Hari ini           │
                            │ - Rata-rata/hari    │
                            │ - Trend (%)          │
                            └──────────────────────┘
```

## 📁 File Structure

```
Project Root/
│
├── prisma/
│   └── schema.prisma                    ← Model Visitor ditambahkan
│
├── app/api/analytics/
│   ├── visitors/
│   │   └── route.ts                     ← GET endpoint for stats
│   └── track-visitor/
│       └── route.ts                     ← POST endpoint for tracking
│
├── services/
│   └── analytics.service.ts             ← Business logic untuk statistik
│
├── lib/analytics/
│   ├── visitor-tracking.ts              ← Utility functions
│   ├── useTrackPageView.ts              ← React hook
│   └── README.md                        ← Dokumentasi
│
├── app/(public)/
│   ├── page.tsx                         ← Homepage with tracking
│   ├── berita/page.tsx                  ← Perlu ditambah tracking
│   ├── galeri/page.tsx                  ← Perlu ditambah tracking
│   └── ... (other pages)
│
├── VISITOR_STATISTICS_IMPLEMENTATION.md ← Summary & setup guide
└── VISITOR_TRACKING_EXAMPLES.md         ← Code examples
```

## 🔄 Data Flow

### 1. User mengakses halaman publik
```tsx
// app/(public)/berita/page.tsx
'use client';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';

export default function BeritaPage() {
  useTrackPageView('/berita');  // ← Hook dipanggil saat component mount
  return <div>News content</div>;
}
```

### 2. Hook melakukan tracking
```typescript
// lib/analytics/useTrackPageView.ts
useEffect(() => {
  trackVisitor({ page });  // ← Kirim ke API
}, [page]);
```

### 3. API menerima dan simpan data
```typescript
// app/api/analytics/track-visitor/route.ts
POST /api/analytics/track-visitor
{
  "sessionId": "session_1234567890_abc",
  "page": "/berita",
  "referrer": "google.com",
  "deviceType": "desktop"
}
↓
Save ke database: visitors table
```

### 4. Service menghitung statistik
```typescript
// services/analytics.service.ts
SELECT DISTINCT sessionId FROM visitors 
WHERE visitedAt >= monthStart

→ Count unique sessions → Calculate average/day → Compare with previous month
```

### 5. Dashboard menampilkan hasil
```
GET /api/analytics/visitors
↓
Return JSON dengan statistik
↓
Dashboard component render cards dengan data
```

## 📊 Statistik yang Dihasilkan

```json
{
  "totalVisitors": 18750,              // unique sessions bulan ini
  "previousPeriodVisitors": 16200,     // bulan lalu
  "todayVisitors": 847,                // unique sessions hari ini
  "averageDailyVisitors": 625,         // rata-rata per hari
  "trend": {
    "difference": 2550,                // naik/turun dari bulan lalu
    "percentage": 15.7,                // persen perubahan
    "isPositive": true                 // trend naik atau turun
  },
  "lastUpdated": "14:32",              // waktu update
  "period": {
    "current": "2026-03",              // periode sekarang
    "previous": "2026-02"              // periode lalu
  }
}
```

## 🎯 Key Features

✅ **Unique Session Tracking**
- Setiap device/browser = 1 session ID
- Session ID disimpan di localStorage
- Pengunjung yang sama tidak dihitung 2x dalam hari yang sama device

✅ **Lightweight & Non-blocking**
- Tracking async (tidak mengganggu halaman)
- Error tracking tidak crash aplikasi
- Bisa dijalankan di background

✅ **Device Detection**
- Mobile, Tablet, Desktop classification
- User Agent parsing untuk analytics

✅ **Traffic Analysis Ready**
- IP tracking untuk geo-analytics (future)
- Referrer tracking untuk source analysis
- Page path untuk popular pages analytics

✅ **Admin Dashboard Integration**
- Otomatis render statistik
- Real-time data (refresh setiap menit)
- Monthly comparison & trend analysis

## 🚀 Implementation Checklist

- [x] Create Visitor model di Prisma schema
- [x] Create tracking API endpoint
- [x] Create analytics service
- [x] Create utility functions
- [x] Create React hook
- [x] Add tracking ke homepage
- [ ] Migrate database
- [ ] Add tracking ke semua public pages
- [ ] Test tracking functionality
- [ ] Verify statistics di dashboard

## 📝 Next Steps

1. **Database Migration**
   ```bash
   npx prisma migrate dev --name add_visitor_analytics
   ```

2. **Add Tracking to All Public Pages**
   - Copy-paste `useTrackPageView(path)` ke setiap public page

3. **Test & Verify**
   - Buka halaman publik
   - Check Network tab → track-visitor request
   - Refresh admin dashboard

4. **Optimize (Optional)**
   - Add popular pages analytics
   - Add traffic source tracking
   - Add geographic analytics
   - Add custom events tracking

## 🔐 Security Notes

- ✅ API endpoint validate input
- ✅ sessionId generated di client-side (unpredictable)
- ✅ No sensitive data stored
- ✅ IP stored tapi encrypted (future improvement)
- ✅ Can add rate limiting untuk POST endpoint

## 📈 Performance Impact

- **Database**: 1 row per page view (minimal)
- **Network**: ~100 bytes POST request (minimal)
- **Client**: localStorage lookup + async request (negligible)
- **Dashboard Query**: Distinct count (optimized dengan index)
