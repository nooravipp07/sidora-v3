# Hero Section Image Display Fix - Complete Guide

## 🐛 Masalah yang Sudah Terjadi
- ❌ File upload ke disk: **WORKING** ✓
- ❌ File tersimpan di database: **WORKING** ✓  
- ❌ Gambar muncul di admin table: **FAILED** ✗
- ❌ Gambar muncul di public slider: **FAILED** ✗

## 🔧 Root Cause
Next.js Image component dengan `unoptimized: false` (production default) tidak bisa render relative path `/uploads/hero/xxx.jpg` tanpa configuration.

## ✅ Fixes Applied

### 1. **next.config.mjs** - Enable Image Component for Local Files
```javascript
// Changed from:
unoptimized: process.env.NODE_ENV === 'development' ? true : false,

// To:
unoptimized: true,  // Enable for BOTH dev and production
```
**Why:** Memungkinkan Image component render relative path `/uploads/*` tanpa optimization/transformation.

### 2. **components/public/sections/HeroSlider.tsx** - Add URL Normalization
```typescript
// Added helper function:
const normalizeImageUrl = (url?: string): string => {
  if (!url) return defaultSlides[0].image || '';
  
  // Remote URL: use as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Local path: ensure starts with /
  if (!url.startsWith('/')) {
    return `/${url}`;
  }
  
  return url;
};

// Applied to all slides during transform:
const transformedSlides = data.data.map((item: any) => ({
  id: item.id,
  image: normalizeImageUrl(item.bannerImageUrl),  // ← Fixed
  bannerImageUrl: normalizeImageUrl(item.bannerImageUrl),  // ← Fixed
  title: item.title,
  description: item.description,
}));
```
**Why:** Memastikan URL selalu dalam format yang benar `/uploads/hero/xxx.jpg`.

### 3. **app/(admin)/admin/hero-section/page.tsx** - Add unoptimized Flag
```typescript
// Image preview di form:
<Image
  src={imagePreview}
  alt="Preview"
  fill
  className="object-cover"
  unoptimized={true}  // ← Added
/>

// Image di table:
<Image
  src={config.bannerImageUrl}
  alt={config.title}
  fill
  className="object-cover"
  unoptimized={true}  // ← Added
/>
```
**Why:** Memaksa Image component untuk tidak optimize/transform relative path.

### 4. **Debug Logging** - Added console.log untuk troubleshooting
```typescript
// Di HeroSlider.tsx:
console.log('[HeroSlider] Original URL:', item.bannerImageUrl, '→ Normalized:', normalizedUrl);
console.log('[HeroSlider] Rendering slide ${idx}, image::', imageUrl);
```

---

## 🧪 Testing Checklist - Production

### Test 1: Admin Upload & Display
```bash
# 1. SSH ke production VPS
ssh your-vps

# 2. Rebuild Next.js with new config
cd /var/www/sidora-v3
npm run build
pm2 restart sidora-v3

# 3. Access admin hero section page
# Browser: https://sidorav3.cloud/admin/hero-section

# 4. Upload gambar baru
# - Pilih file (minimal 1200x500)
# - Click "Upload Gambar"
# - Harus lihat preview

# Expected:
# ✓ Preview gambar muncul
# ✓ "✓ Gambar siap digunakan" message
# ✓ Tabel menampilkan thumbnail gambar

# 5. Cek PM2 logs
pm2 logs sidora-v3 | grep -E "HERO-UPLOAD|HeroSlider"

# Expected di logs:
# [HERO-UPLOAD] ✓ Using upload path: /var/www/sidora-v3/public/uploads/hero
# [HERO-UPLOAD] ✓ File written successfully
# [HeroSlider] Rendering slide 0, image: /uploads/hero/hero-xxx.jpg
```

### Test 2: Public Homepage Slider
```bash
# 1. Open homepage
# Browser: https://sidorav3.cloud/

# 2. Hero slider harus tampil dengan gambar
# Expected:
# ✓ Background image terlihat jelas
# ✓ Text judul & deskripsi visible
# ✓ Arrows untuk navigate slides
# ✓ Dots indicator di bawah
# ✓ Auto-rotate slides setiap 5 detik

# 3. Cek developer console
# Press F12 → Console tab

# Look for logs:
# [HeroSlider] Fetch response status: 200
# [HeroSlider] Data received: {data: [...], meta: {...}}
# [HeroSlider] Normalized URL: /uploads/hero/hero-xxx.jpg
# [HeroSlider] Rendering slide X, image: /uploads/hero/hero-xxx.jpg

# NO ERRORS should appear
```

### Test 3: File Access Verification
```bash
# 1. Verify file exists
ls -lh /var/www/sidora-v3/public/uploads/hero/hero-*.jpg

# 2. Test direct file access via curl
curl -I https://sidorav3.cloud/uploads/hero/hero-1775287467045-ht2339.jpg

# Expected:
# HTTP/1.1 200 OK
# Content-Type: image/jpeg
# Content-Length: 632149

# 3. Alternative: Browser direct access
# https://sidorav3.cloud/uploads/hero/hero-1775287467045-ht2339.jpg
# Should display image, NOT 404 or HTML error
```

### Test 4: Database Verification
```sql
-- Check hero section records
SELECT id, title, bannerImageUrl, status, displayOrder FROM heroSectionConfig;

-- Expected output:
-- id | title | bannerImageUrl | status | displayOrder
-- 1 | Selamat Datang | /uploads/hero/hero-1775287467045-ht2339.jpg | 1 | 0
```

---

## 🔍 Troubleshooting If Still Not Working

### Issue: Images still not showing in admin or public

**Diagnostic:**
```bash
# Check build was successful
pm2 logs sidora-v3 | tail -50
# Look for: "Successfully compiled client and server"

# Check next.config.mjs was loaded correctly
sudo grep -A 5 "unoptimized" /var/www/sidora-v3/next.config.mjs

# Check file actually exists
stat /var/www/sidora-v3/public/uploads/hero/hero-*.jpg

# Check Nginx can serve static files
sudo tail -f /var/log/nginx/error.log
```

**Fix if unoptimized didn't take effect:**
```bash
# Clear Next.js cache
rm -rf /var/www/sidora-v3/.next

# Rebuild from scratch
cd /var/www/sidora-v3
npm run build

# Restart PM2
pm2 restart sidora-v3 --update-env

# Wait 30 seconds for startup
sleep 30
pm2 logs sidora-v3 | tail -20
```

### Issue: "Unexpected token '<'" in console

**Cause:** Nginx returning HTML error instead of image

**Fix:**
```bash
# Test Nginx serving /uploads
curl -v http://localhost/uploads/hero/hero-1775287467045-ht2339.jpg

# If 404, check Nginx config
sudo cat /etc/nginx/sites-available/sidora-v3 | grep -A 10 "location /uploads"

# Should have:
# location /uploads/ {
#   alias /var/www/sidora-v3/public/uploads/;
# }

# Reload Nginx if changed config
sudo systemctl reload nginx
```

### Issue: Images show but very slow

**Cause:** `unoptimized: true` disables Next.js image optimization

**Note:** This is temporary! After verifying everything works:
```javascript
// In next.config.mjs, consider changing to:
unoptimized: false,  // Back to optimization

// BUT add proper Image remotePatterns for /uploads/*
remotePatterns: [
  {
    protocol: 'http',
    hostname: 'sidorav3.cloud',
    port: '',
    pathname: '/uploads/**',
  },
]
```

---

## 📊 Expected Flow After Fix

```
User Upload
  ↓
/api/hero-section/upload
  ↓
File saved: /var/www/sidora-v3/public/uploads/hero/hero-xxx.jpg
  ↓
API returns: {url: "/uploads/hero/hero-xxx.jpg"}
  ↓
Frontend stores: bannerImageUrl = "/uploads/hero/hero-xxx.jpg"
  ↓
POST /api/hero-section → DB insert
  ↓
Admin table: normalizeImageUrl("/uploads/hero/...") → <Image unoptimized src="/uploads/hero/...">
  ↓
✅ Thumbnail visible
  ↓
Public slider: normalizeImageUrl() → backgroundImage: url(/uploads/hero/...)
  ↓
✅ Hero image displays correctly
```

---

## ✅ Verification Commands

Run after all changes deployed:

```bash
# 1. Check all files modified
git status

# 2. Rebuild and restart
npm run build && pm2 restart sidora-v3

# 3. Monitor logs
pm2 logs sidora-v3 --follow

# 4. Test upload via curl
curl -X POST \
  -F "file=@test-image.jpg" \
  https://sidorav3.cloud/api/hero-section/upload

# Expected response:
# {
#   "success": true,
#   "url": "/uploads/hero/hero-1712...-abc123.jpg",
#   "message": "Gambar berhasil diupload"
# }

# 5. Verify homepage loads correctly
curl -s https://sidorav3.cloud/ | grep -i "hero-section\|slider"
```
