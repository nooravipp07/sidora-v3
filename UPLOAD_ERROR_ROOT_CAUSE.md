# Root Cause: Upload Error "Unexpected token '<'" di Production VPS

## 🔴 Penyebab Utama Error

### **Issue #1: Middleware Intercept API Request ⚠️ MOST LIKELY**

Di `middleware.ts`, matcher config:
```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

**Masalah:**
- Middleware intercept **SEMUA routes** termasuk `/api/upload`
- Middleware cek token tapi tidak properly handle API errors
- Jika ada error di middleware, return HTML error page bukan JSON
- Client try `JSON.parse(htmlErrorPage)` → "Unexpected token '<'"

**Proof:**
```
Local Dev: 
  - Next.js dev server handle middleware dengan baik
  - Error masih return JSON

Production:
  - Nginx reverse proxy + middleware conflict
  - Error dari middleware/nginx return HTML 500/502 page
  - Client parse HTML as JSON → ERROR
```

---

### **Issue #2: Upload Directory Path Invalid**

Di `app/api/upload/route.ts`:
```typescript
const paths = [
  process.env.UPLOADS_DIR,           // ❌ ENV VAR TIDAK SET
  '/app/public/uploads/berita',      // ❌ Path berbeda per platform
  join(process.cwd(), 'public', 'uploads', 'berita'),  // ⚠️ Bisa tidak writable
  '/tmp/uploads/berita',             // ❌ EPHEMERAL (hilang saat restart)
].filter(Boolean) as string[];
```

**Masalah:**
- Jika `UPLOADS_DIR` env var tidak set, path paths invalid
- `/tmp` di VPS akan empty setelah reboot
- Permission denied untuk write ke /app/public (bisa need sudo)

---

### **Issue #3: Nginx Configuration Missing**

Di production VPS dengan Nginx reverse proxy:

**Masalah:**
- `client_max_body_size` tidak diset (default 1MB)
- Request timeout terlalu kecil
- Upload file lebih dari 1MB → Nginx reject dengan HTML 413 error

**Error Flow:**
```
Client upload 5MB file
  ↓
Nginx check size: 5MB > 1MB (default)
  ↓
Nginx return HTML 413 (Payload Too Large)
  ↓
Client expect JSON, get HTML
  ↓
JSON.parse() fail → "Unexpected token '<'"
```

---

### **Issue #4: Permission Denied**

**Masalah:**
- VPS user (www-data, nobody) tidak punya permission write ke `/public/uploads`
- Proses Next.js tidak bisa create directory
- Error tapi return HTML instead of JSON

---

## ✅ Quick Fix Checklist untuk VPS

### Step 1: Fix Middleware (CRITICAL)
```typescript
// middleware.ts - exclude API routes
export const config = {
  matcher: [
    // Exclude API routes dari middleware
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
```

### Step 2: Set Environment Variable
```bash
# SSH ke VPS
nano /etc/environment  # or ~/.bashrc

# Add:
export UPLOADS_DIR="/var/www/sidora-v3/public/uploads"

# atau di `.env.production`:
UPLOADS_DIR=/var/www/sidora-v3/public/uploads
```

### Step 3: Fix Nginx Configuration
```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/sidora-v3

# Add di server block:
client_max_body_size 100M;
client_body_timeout 300s;
proxy_read_timeout 300s;
proxy_send_timeout 300s;

# Test
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

### Step 4: Fix Upload Directory Permission
```bash
# Create directory dengan proper permissions
sudo mkdir -p /var/www/sidora-v3/public/uploads/berita
sudo mkdir -p /var/www/sidora-v3/public/uploads/hero

# Set ownership (ganti www-data jika perlu)
sudo chown -R www-data:www-data /var/www/sidora-v3/public/uploads
sudo chmod -R 755 /var/www/sidora-v3/public/uploads

# Verify writable
sudo -u www-data touch /var/www/sidora-v3/public/uploads/test.txt
```

### Step 5: Rebuild dan Restart
```bash
# SSH ke VPS
cd /var/www/sidora-v3

# Build
npm run build

# Restart dengan PM2
pm2 restart sidora-v3

# Check logs
pm2 logs sidora-v3 --lines 50
```

---

## 🔍 Debugging Checklist

### Cek mana yang error:

1. **Check Nginx config:**
   ```bash
   sudo nginx -t
   ```

2. **Check upload directory:**
   ```bash
   ls -la /var/www/sidora-v3/public/uploads/
   ```

3. **Check PM2 logs (saat upload):**
   ```bash
   pm2 logs sidora-v3
   # Cari [UPLOAD] prefix
   # Lihat error message yang detail
   ```

4. **Check Nginx error logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   # Saat upload, cari error terbaru
   ```

5. **Test upload dari local:**
   ```bash
   curl -X POST \
     -F "file=@/path/to/image.jpg" \
     https://sidorav3.cloud/api/upload
   ```

---

## 📊 Comparison: Local Dev vs Production

| Aspect | Local Dev | Production |
|--------|-----------|-----------|
| **Middleware** | Properly handles errors | ❌ May return HTML error |
| **Upload dir** | `./public/uploads/` (writable) | ❌ May not exist or writable |
| **File size limit** | Unlimited (dev) | ❌ Nginx default 1MB |
| **Permissions** | User's files | ❌ Need www-data ownership |
| **Restart persistence** | `/public` is permanent | ❌ `/tmp` is ephemeral |

---

## 🎯 Most Likely Culprit: Middleware + Nginx

Urutan probable cause:
1. **80%** - Middleware intercept + Nginx return HTML error
2. **15%** - Nginx `client_max_body_size` too small
3. **5%** - Permission denied atau invalid path

---

## Testing After Fix

1. Test upload file 2MB:
   ```bash
   curl -X POST \
     -F "file=@/path/to/2mb-image.jpg" \
     https://sidorav3.cloud/api/upload \
     -v  # verbose untuk lihat headers
   ```

2. Should return JSON:
   ```json
   {
     "url": "/uploads/berita/1712138400000-abc123.jpg",
     "local": true
   }
   ```

3. Verify file exists:
   ```bash
   ls -la /var/www/sidora-v3/public/uploads/berita/
   ```
