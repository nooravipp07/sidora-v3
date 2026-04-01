# Environment Variables Checklist untuk Production Upload Fix

## File: `.env.production`

Pastikan file `.env.production` di root project folder memiliki semua variabel ini:

```env
# ============================================
# 📁 CRITICAL: Upload Configuration
# ============================================
UPLOADS_DIR=/var/www/sidora-v3/public/uploads/berita
# ⚠️ IMPORTANT: Must be an absolute path yang writable!
# - Use this EXACTLY as shown (may change per VPS)
# - Directory must exist and have www-data:www-data ownership
# - Permissions: 755 (rwxr-xr-x)

# ============================================
# 🌐 Node.js & Application
# ============================================
NODE_ENV=production
# Force production mode (not development)

NEXT_PUBLIC_API_URL=https://sidorav3.cloud
# Replace with your actual domain

# ============================================
# 🗄️ Database
# ============================================
DATABASE_URL="mysql://user:password@hostname:3306/sidora_prod"
# Update with your production database credentials

# ============================================
# 🔐 JWT Authentication
# ============================================
JWT_SECRET=your-very-long-random-secret-min-32-chars-aB3xYz9mN2kL
# ⚠️ MUST be different dari development!
# Generate random: openssl rand -base64 32

JWT_EXPIRY=7d
# Token expiration time

# ============================================
# 📊 Optional: Logging & Monitoring
# ============================================
LOG_LEVEL=info
# Values: debug, info, warn, error

# SENTRY_DSN=https://xxxx@sentry.io/12345
# (Optional) Error tracking service

# ============================================
# 🔧 Optional: Upload Behavior
# ============================================
# MAX_FILE_SIZE=5242880  # 5MB in bytes
# UPLOAD_TIMEOUT=60      # seconds
```

## Verification Checklist

### ✅ Before Deployment

- [ ] `.env.production` file exists at project root
- [ ] `UPLOADS_DIR` is set to absolute path (not relative)
- [ ] Path exists and is writable by www-data
- [ ] `DATABASE_URL` points to production database
- [ ] `JWT_SECRET` is set and min 32 characters
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_API_URL` is correct domain
- [ ] All variables don't have typos

### ✅ Nginx Configuration

```bash
# File: /etc/nginx/sites-available/sidora-v3
```

Must include:
- [ ] `client_max_body_size 100M;`
- [ ] `client_body_timeout 300s;`
- [ ] `proxy_read_timeout 300s;`
- [ ] `proxy_send_timeout 300s;`
- [ ] API location passes to `:3000`
- [ ] Static `/uploads/` location mapped correctly

Verify:
```bash
sudo nginx -t  # Should say "syntax is ok"
sudo systemctl reload nginx
```

### ✅ File System

```bash
# Must exist and be writable
ls -la /var/www/sidora-v3/public/uploads/

# File ownership
ls -l /var/www/sidora-v3/public/uploads/berita/
# Should show: www-data:www-data

# File permissions
stat /var/www/sidora-v3/public/uploads/berita/
# Should be: 0755 (drwxr-xr-x)
```

### ✅ Application Build

```bash
cd /var/www/sidora-v3

# Build with production settings
npm run build
# Should see: "✓ Ready in Xxx ms"

# Restart PM2
pm2 restart sidora-v3

# Check logs
pm2 logs sidora-v3 --lines 100
```

### ✅ Test Upload

```bash
# Method 1: curl
curl -X POST \
  -F "file=@/path/to/test-image.jpg" \
  https://sidorav3.cloud/api/upload

# Expected response (JSON):
# {"url":"/uploads/berita/1712138400000-abc123.jpg","local":true}

# Method 2: Browser
# 1. Open https://sidorav3.cloud/admin
# 2. Upload image
# 3. Check browser console (F12) for response
# 4. Should get JSON response, NOT HTML error
```

## Debugging If Still Not Working

### Check 1: Middleware Issue
```bash
# middleware.ts should exclude /api
grep "(?!.*api" middleware.ts
# Should show: '/((?!_next/static|_next/image|favicon.ico|public|api).*)'
```

### Check 2: Upload Route Logs
```bash
# SSH to VPS, watch logs during upload
pm2 logs sidora-v3 --err --out

# In another window, upload file
# Look for [UPLOAD] prefix in logs
# Should see:
# [UPLOAD] Request received
# [UPLOAD] FormData parsed successfully
# [UPLOAD] Using upload directory: /var/www/sidora-v3/public/uploads/berita
# [UPLOAD] File saved to ...
```

### Check 3: File Permissions
```bash
# Check if www-data can write
sudo -u www-data touch /var/www/sidora-v3/public/uploads/berita/test.txt
# Should succeed

# Check if file was created
ls -la /var/www/sidora-v3/public/uploads/berita/test.txt
# Should show: -rw-r--r-- www-data www-data
```

### Check 4: Nginx Logs
```bash
# Watch nginx errors during upload
sudo tail -f /var/log/nginx/error.log

# Saat upload, cek apakah ada error:
# - upstream timed out
# - 413 Payload Too Large
# - upstream connection closed
```

### Check 5: Response Headers
```bash
# Test dengan curl verbose
curl -X POST \
  -F "file=@test.jpg" \
  https://sidorav3.cloud/api/upload \
  -v 2>&1 | grep "< HTTP"

# Should show: < HTTP/1.1 201 Created
# NOT: < HTTP/1.1 413 Payload Too Large
# NOT: < HTTP/1.1 502 Bad Gateway
```

## Environment Variable Documentation

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `UPLOADS_DIR` | `/var/www/sidora-v3/public/uploads/berita` | ✅ YES | Absolute path only |
| `NODE_ENV` | `production` | ✅ YES | Forces production mode |
| `DATABASE_URL` | `mysql://...` | ✅ YES | Production database |
| `JWT_SECRET` | Random 32+ chars | ✅ YES | Generate with openssl rand -base64 32 |
| `JWT_EXPIRY` | `7d` | ⚠️ Optional | Default: 7 days |
| `NEXT_PUBLIC_API_URL` | `https://sidorav3.cloud` | ✅ YES | Your domain |
| `LOG_LEVEL` | `info` | ⚠️ Optional | For debugging |

---

## Generate Strong JWT_SECRET

```bash
# Run this command to generate random secret
openssl rand -base64 32

# Output example:
# G9mK3xL/pQr8sT+uVwXyZaBbCdEfGhIj+k==

# Copy this to UPLOADS_DIR in .env.production
JWT_SECRET=G9mK3xL/pQr8sT+uVwXyZaBbCdEfGhIj+k==
```

---

## Checklist Summary

After completing all steps above, you should have:

- ✅ `.env.production` file dengan UPLOADS_DIR yang correct
- ✅ Upload directory exists dengan proper permissions
- ✅ Nginx config dengan `client_max_body_size 100M`
- ✅ middleware.ts exclude `/api` routes
- ✅ Application rebuilt dengan `npm run build`
- ✅ PM2 restarted dengan `pm2 restart sidora-v3`
- ✅ Test upload returns JSON (not HTML error)

Then error "Unexpected token '<'" should be **FIXED**! 🎉
