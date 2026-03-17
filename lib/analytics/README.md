# Visitor Analytics Implementation

## Pengertian
Fitur ini digunakan untuk menghitung dan melacak berapa banyak pengunjung (unique sessions) yang mengakses halaman-halaman depan website (public pages) seperti berita, galeri, agenda, dll.

## Arsitektur

### 1. Database Model (Prisma Schema)
- **Table**: `visitors`
- **Field**: 
  - `sessionId`: Identifikasi unik untuk setiap pengunjung
  - `page`: Path halaman yang dikunjungi (e.g., `/berita`, `/galeri`)
  - `ipAddress`: IP address pengunjung
  - `userAgent`: Browser dan device info
  - `deviceType`: Tipe device (desktop, mobile, tablet)
  - `visitedAt`: Waktu kunjungan

### 2. API Endpoint
- **POST** `/api/analytics/track-visitor`
  - Menerima data visitor dan menyimpannya ke database
  - Dipanggil dari client-side ketika halaman dimuat

### 3. Service Layer
- **AnalyticsService.getVisitorStats()** di `services/analytics.service.ts`
  - Menghitung statistik dari tabel `visitors`
  - Menghitung unique sessions per hari/bulan
  - Menghitung trend dan perbandingan dengan periode sebelumnya

### 4. Utility & Hooks
- **visitor-tracking.ts**: Fungsi untuk tracking visitor
- **useTrackPageView.ts**: Custom React hook untuk memudahkan tracking

## Cara Menggunakan

### Step 1: Setup Database
```bash
# Generate migration
npx prisma migrate dev --name add_visitor_model

# Atau gunakan db push jika sudah ada
npx prisma db push
```

### Step 2: Track Visitors di Halaman Depan
Gunakan hook `useTrackPageView` di halaman depan (public pages):

```tsx
// app/(public)/berita/page.tsx
'use client';

import { useTrackPageView } from '@/lib/analytics/useTrackPageView';

export default function NewsPage() {
  // Track this page view
  useTrackPageView('/berita');

  return (
    <div>
      {/* News content */}
    </div>
  );
}
```

### Step 3: Lihat Statistik di Dashboard
Halaman admin dashboard `/admin` akan otomatis menampilkan statistik pengunjung:
- Total pengunjung bulan ini
- Pengunjung hari ini
- Rata-rata pengunjung per hari
- Perbandingan dengan bulan sebelumnya
- Trend analytics

## Tips Implementasi

1. **Semua halaman publik harus track**
   - `/` (homepage)
   - `/berita` dan `/berita/[slug]`
   - `/galeri`
   - `/agenda`
   - `/olahraga-prestasi`
   - `/olahraga-masyarakat`
   - `/infrastruktur-keolahragaan`

2. **Session tracking**
   - Session ID disimpan di localStorage
   - Berlaku untuk satu browser/device
   - Tracking otomatis untuk pengunjung baru

3. **Performance**
   - Tracking dilakukan asynchronously
   - Tidak mengganggu performa halaman
   - Error tracking tidak akan memecah aplikasi

## Cara Menambahkan ke Page

```tsx
// Template untuk semua public pages
'use client';

import { useTrackPageView } from '@/lib/analytics/useTrackPageView';

export default function SomePage() {
  useTrackPageView('/path-to-page');

  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

## Debugging

Untuk melihat apakah tracking berfungsi:

1. **Console Browser**: Buka DevTools > Console
2. **Network Tab**: Lihat request ke `/api/analytics/track-visitor`
3. **Local Storage**: Check `visitor_session_id` di localStorage

## Next Steps

Bisa tambahkan:
- Analytics dashboard dengan chart (Traffic timeline, Popular pages)
- Geographic analytics (Lokasi pengunjung)
- Referrer tracking (Traffic source)
- Page performance metrics
