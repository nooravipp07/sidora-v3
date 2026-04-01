# Fix: "Unexpected token '<'" Upload Error di Production

## Problem
Saat upload gambar di production VPS, mendapat error:
```
Gagal mengupload gambar: Unexpected token '<', "<html>
<h"... is not valid JSON
```

Ini berarti API endpoint `/api/upload` mengembalikan **HTML error page** bukan JSON response.

## Root Causes

### 1. FormData Parsing Error di Production
- Runtime error saat parsing FormData yang tidak di-catch dengan baik
- Server mengembalikan 500 error dalam bentuk HTML

### 2. API Route tidak Accessible
- Middleware atau nginx routing configuration yang salah
- Path `/api/upload` tidak ter-resolve dengan benar

### 3. File System Permission
- Tidak bisa write ke upload directory
- Fallback mechanism juga gagal

## Solution yang Sudah Diimplementasikan

### ✅ A. Enhanced Error Handling di API Routes
File: `app/api/upload/route.ts` dan `app/api/hero-section/upload/route.ts`

**Perubahan:**
1. Added `export const dynamic = 'force-dynamic'` untuk prevent caching issues
2. Added `export const maxDuration = 60` untuk allow longer upload time
3. Better error logging dengan prefix `[UPLOAD]` dan `[HERO-UPLOAD]`
4. Comprehensive try-catch di FormData parsing
5. Detailed error messages dengan context debug info

**Contoh response error yang jelas:**
```json
{
  "error": "Invalid request format. Expected multipart/form-data",
  "details": "actual error message"
}
```

### ✅ B. Better Client-Side Error Handling
File: `components/admin/form/ImageUpload.tsx` dan `components/admin/form/AthleteForm.tsx`

**Perubahan:**
1. Check response status SEBELUM parsing JSON
2. Differentiate antara JSON vs HTML error responses
3. Safe JSON parsing dengan try-catch
4. Show specific error messages ke user
5. Log non-JSON responses untuk debugging

**Contoh:**
```typescript
const contentType = response.headers.get('content-type');
if (contentType && contentType.includes('application/json')) {
  // Parse JSON error
  const errorData = await response.json();
} else {
  // Handle HTML error page
  console.error('Non-JSON error response:', text);
  errorMessage = `Upload gagal (${response.status}). Server tidak merespons dengan benar.`;
}
```

## Debugging Steps untuk Production

### Step 1: Check API Accessibility
```bash
# SSH ke VPS dan test endpoint
curl -X POST http://localhost:3000/api/upload -H "Content-Type: application/json" 

# Expected: 400 (no file provided) bukan HTML error
```

### Step 2: Check Server Logs
```bash
# View Next.js production logs
pm2 logs sidora-v3
# atau
docker logs your-container-name
```

**Cari line dengan:**
- `[UPLOAD]` - upload API logs
- `[HERO-UPLOAD]` - hero upload logs
- Error traces yang menunjukkan error type

### Step 3: Environment Variables Check
Pastikan di production `.env.production` atau `.env.local` set:

```bash
NODE_ENV=production
UPLOADS_DIR=/app/public/uploads
# atau sesuai path VPS Anda
```

### Step 4: File System Permissions
```bash
# Check upload directory permissions
ls -la /app/public/uploads
# output: drwxrwxrwx or drwxr-xr-x (readable/writable)

# If permission denied, fix it
chmod 755 /app/public/uploads
chmod 755 /app/public
```

### Step 5: Rebuild dan Restart
```bash
# Rebuild Next.js untuk production
npm run build

# Restart application
pm2 restart sidora-v3
# atau
docker restart your-container-name

# Wait 10 seconds untuk application startup
sleep 10

# Test upload API lagi
```

## Verification Checklist

- [ ] API logs menunjukkan `[UPLOAD] Request received`
- [ ] FormData parsing berhasil: `[UPLOAD] FormData parsed successfully`
- [ ] File path ditemukan: `[UPLOAD] Using upload path: /app/public/uploads`
- [ ] File saved: `[UPLOAD] File saved to /app/public/uploads/...`
- [ ] Response JSON valid: `[UPLOAD] Local storage successful`

## If Error Persists

### Scenario 1: `[UPLOAD] No writable upload directory found`
**Solusi:** Set environment variable `UPLOADS_DIR` ke path yang writable
```bash
export UPLOADS_DIR=/var/www/uploads
# atau path lain yang Anda punya permission untuk write
```

### Scenario 2: Error di `formData.get('file')`
**Solusi:** Ini bukan masalah ImageUpload component, tapi di server-side payload parsing
- Check nginx request body size limit
- Check Next.js body parser configuration

### Scenario 3: Non-JSON response masih terjadi
**Solusi:** Enable verbose logging
```typescript
// App/api/upload/route.ts - add at top
if (process.env.DEBUG_UPLOAD === 'true') {
  console.log('[UPLOAD-DEBUG] Full request:', {
    method: request.method,
    headers: Object.fromEntries(request.headers),
  });
}
```

Set environment variable:
```bash
export DEBUG_UPLOAD=true
```

## Production Deployment Checklist

- [ ] Next.js build successful: `npm run build` (no errors)
- [ ] Upload directory exists dan writable
- [ ] Environment variables set correctly
- [ ] Application restarted after deployment
- [ ] Test upload di fresh incognito browser
- [ ] Check server logs for `[UPLOAD]` messages
- [ ] Verify file system tidak full: `df -h`
- [ ] Check file size limit di nginx: `client_max_body_size 100M;`

## Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [FormData MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Nginx File Upload Configuration](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
