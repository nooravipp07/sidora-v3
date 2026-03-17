# Visitor Statistics Implementation Summary

## ✅ Komponen yang Sudah Dibuat

### 1. **Database Schema** 
   - File: `prisma/schema.prisma`
   - Model baru: `Visitor` dengan fields:
     - sessionId (unique per visitor)
     - ipAddress, userAgent, deviceType
     - page (path halaman yang dikunjungi)
     - visitedAt (timestamp kunjungan)
     - referrer (source traffic)

### 2. **API Endpoint untuk Tracking**
   - File: `app/api/analytics/track-visitor/route.ts`
   - Method: POST
   - Fungsi: Menerima dan menyimpan data visitor ke database

### 3. **Analytics Service**
   - File: `services/analytics.service.ts`
   - Update: Kalkulasi statistik dari tabel `Visitor` bukan `LoginHistory`
   - Calculate: unique sessions, daily average, trend analysis

### 4. **Utility & Hooks**
   - `lib/analytics/visitor-tracking.ts` - Fungsi tracking
   - `lib/analytics/useTrackPageView.ts` - React hook untuk tracking otomatis
   - `lib/analytics/README.md` - Dokumentasi lengkap

### 5. **Contoh Implementasi**
   - `app/(public)/page.tsx` - Homepage sudah ditambahkan tracking

## 🚀 Next Steps untuk Implementasi

### Step 1: Migrate Database
```bash
# Buat migration baru
npx prisma migrate dev --name add_visitor_analytics

# Atau sync dengan database
npx prisma db push
```

### Step 2: Tambahkan Tracking ke Semua Public Pages
Tambahkan di halaman-halaman publik ini:

```tsx
// app/(public)/berita/page.tsx
'use client';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';

export default function BeritaPage() {
  useTrackPageView('/berita');
  // ... rest of component
}

// app/(public)/galeri/page.tsx
'use client';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';

export default function GaleriPage() {
  useTrackPageView('/galeri');
  // ... rest of component
}

// Dan seterusnya untuk halaman lain...
```

### Step 3: Verifikasi di Admin Dashboard
- Buka `/admin`
- Section "Statistik Pengunjung" akan menampilkan:
  - Total pengunjung bulan ini
  - Pengunjung hari ini
  - Rata-rata pengunjung per hari
  - Trend (naik/turun)
  - Perbandingan dengan bulan lalu

## 📊 Data yang Ditrack

```
Setiap kali pengunjung membuka halaman publik:
- Session ID (generated & stored di localStorage)
- IP Address (dari request header)
- User Agent (browser info)
- Device Type (desktop/mobile/tablet)
- Page Path (misal: /berita, /galeri)
- Referrer (dari mana user datang)
- Timestamp (kapan diakses)
```

## 🔄 Cara Kerja

1. **User mengakses halaman** → Hook `useTrackPageView()` trigger
2. **Generate/Get Session ID** → Disimpan di localStorage
3. **POST ke API** → `/api/analytics/track-visitor`
4. **Database record** → Disimpan di tabel `Visitor`
5. **Dashboard kalkulasi** → Service menghitung unique sessions
6. **Update statistik** → Tampil di admin dashboard setiap refresh

## 📝 Halaman yang Perlu Ditambahkan Tracking

Gunakan `useTrackPageView()` di:
- ✅ Homepage: `/` 
- ⏳ `/berita` dan `/berita/[slug]`
- ⏳ `/galeri`
- ⏳ `/agenda`
- ⏳ `/olahraga-prestasi`
- ⏳ `/olahraga-masyarakat`
- ⏳ `/infrastruktur-keolahragaan`

## 🎯 Keuntungan Implementasi Ini

- **Non-intrusive**: Tidak mengganggu UX
- **Async**: Tracking berjalan background
- **Persistent**: Session ID stored di localStorage
- **Accurate**: Count unique sessions per device
- **Scalable**: Bisa expand dengan metrics lainnya
- **Clean Architecture**: Logic terpisah di service

## 🐛 Testing

Untuk test apakah tracking berfungsi:

1. Buka halaman publik
2. Buka DevTools > Network tab
3. Filter: `track-visitor`
4. Lihat POST request berhasil (status 201)
5. Check localStorage: ada `visitor_session_id`

## 📚 File Reference

```
lib/analytics/
├── README.md                    # Dokumentasi lengkap
├── visitor-tracking.ts          # Utility functions
└── useTrackPageView.ts         # React hook

services/
└── analytics.service.ts         # Service untuk statistik

app/api/analytics/
├── visitors/route.ts            # Endpoint untuk GET stats
└── track-visitor/route.ts       # Endpoint untuk POST visitor data

prisma/
└── schema.prisma               # Database model
```
