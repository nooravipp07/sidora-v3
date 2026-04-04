# 🚀 Quick Deploy Guide - Hero Image Display Fix

## Files Changed (3 files)
1. ✅ `next.config.mjs` - Set `unoptimized: true`
2. ✅ `components/public/sections/HeroSlider.tsx` - Add URL normalization + logging
3. ✅ `app/(admin)/admin/hero-section/page.tsx` - Add `unoptimized={true}` to Image components

## Deploy Steps (SSH ke VPS)

```bash
# 1. Pull latest code
cd /var/www/sidora-v3
git pull origin main

# 2. Rebuild
npm run build

# 3. Restart
pm2 restart sidora-v3

# 4. Monitor (20 seconds)
pm2 logs sidora-v3 | head -30
```

## Instant Verification

### ✅ Admin Works?
```
1. Open: https://sidorav3.cloud/admin/hero-section
2. Upload image
3. Table should show thumbnail ✓
4. Console (F12) should show no errors ✓
```

### ✅ Public Works?
```
1. Open: https://sidorav3.cloud/
2. Hero slider should have background image ✓
3. Arrows & dots should be visible ✓
4. Auto-rotate every 5 seconds ✓
```

### ✅ Server Works?
```bash
pm2 logs sidora-v3 | grep -i "hero"
# Should show: [HeroSlider] Rendering slide X, image: /uploads/hero/...
# Should NOT show any errors
```

## If Not Working

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
pm2 restart sidora-v3

# Check file exists
ls /var/www/sidora-v3/public/uploads/hero/

# Test direct access
curl -I https://sidorav3.cloud/uploads/hero/hero-*.jpg
```

---

## Key Changes Summary

### Before (Broken)
```javascript
// next.config.mjs
unoptimized: process.env.NODE_ENV === 'development' ? true : false,
// ❌ Production = false → Image component optimizes relative path
```

### After (Fixed)
```javascript
// next.config.mjs
unoptimized: true,
// ✅ Always enabled → Works everywhere
```

### Before (No Normalization)
```typescript
// HeroSlider.tsx
const transformedSlides = data.data.map((item: any) => ({
  image: item.bannerImageUrl,  // Could be "/uploads/..." or "uploads/..." (inconsistent)
}));
```

### After (Normalized)
```typescript
// HeroSlider.tsx
const normalizeImageUrl = (url?: string): string => {
  if (url.startsWith('/')) return url;
  return `/${url}`;
};

const transformedSlides = data.data.map((item: any) => ({
  image: normalizeImageUrl(item.bannerImageUrl),  // Always "/uploads/..."
}));
```

### Before (No unoptimized Flag)
```typescript
// Admin page
<Image src={config.bannerImageUrl} fill />
// ❌ Image component tries to optimize → fails with relative path
```

### After (Fixed)
```typescript
// Admin page
<Image src={config.bannerImageUrl} fill unoptimized={true} />
// ✅ Image component skips optimization → works with relative path
```
