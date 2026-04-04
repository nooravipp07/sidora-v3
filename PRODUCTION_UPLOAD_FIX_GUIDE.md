# 🔧 Production Hero Upload - Troubleshooting & Setup Guide

## Quick Diagnostic (SSH ke VPS)

```bash
# 1. Check if directories exist and writable
sudo ls -la /var/www/sidora-v3/public/uploads/

# Output yang diharapkan:
# drwxr-xr-x  4 www-data www-data 4096 Apr 4 10:00 .
# drwxr-xr-x  3 www-data www-data 4096 Apr 4 10:00 ..
# drwxr-xr-x  2 www-data www-data 4096 Apr 4 10:00 berita
# drwxr-xr-x  2 www-data www-data 4096 Apr 4 10:00 hero

# 2. Test write permission
sudo -u www-data touch /var/www/sidora-v3/public/uploads/hero/.test
echo "✓ Can write" || echo "✗ Cannot write - PERMISSION DENIED"

# 3. Check env variables
echo $UPLOADS_DIR
echo $UPLOAD_PATH
echo $NODE_ENV

# 4. Check PM2 logs
pm2 logs sidora-v3 --lines 50

# 5. Look for [HERO-UPLOAD] messages
pm2 logs sidora-v3 | grep HERO-UPLOAD
```

---

## ✅ Setup Checklist sebelum ke Production

### Step 1: Create Uploads Directory (SSH ke VPS)

```bash
# SSH ke VPS
ssh your-vps

# Create directories
sudo mkdir -p /var/www/sidora-v3/public/uploads/{hero,berita}

# Set ownership ke www-data (PM2 user)
sudo chown -R www-data:www-data /var/www/sidora-v3/public/uploads
sudo chmod -R 755 /var/www/sidora-v3/public/uploads

# Verify
ls -la /var/www/sidora-v3/public/uploads/
sudo -u www-data touch /var/www/sidora-v3/public/uploads/hero/.test && echo "✓ Writable"
```

### Step 2: Update .env.production (Yang sudah dilakukan)

```env
UPLOADS_DIR="/var/www/sidora-v3/public/uploads/hero"
UPLOAD_PATH="/var/www/sidora-v3/public/uploads/berita"
NODE_ENV="production"
```

### Step 3: Deploy Code Changes

```bash
# Pull latest code
cd /var/www/sidora-v3
git pull origin main

# Install dependencies
npm ci  # or npm install --production

# Rebuild
npm run build

# Restart PM2
pm2 restart sidora-v3

# Monitor logs
pm2 logs sidora-v3 --follow
```

### Step 4: Test Upload via cURL

```bash
# Create test image (1x1 pixel PNG)
echo -ne '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0a\x49\x44\x41\x54\x78\x9c\x63\x00\x01\x00\x00\x05\x00\x01\x0d\x0a\x2d\xb4\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82' > test.png

# Upload via API
curl -X POST \
  -F "file=@test.png" \
  http://localhost:3000/api/hero-section/upload

# Expected response:
# {
#   "success": true,
#   "url": "/uploads/hero/hero-1712...-abc123.png",
#   "message": "Gambar berhasil diupload"
# }

# Test file exists
curl http://localhost:3000/uploads/hero/hero-1712...-abc123.png
```

---

## ❌ Common Errors & Solutions

### Error 1: "The requested resource isn't a valid image"

**Cause:** File tidak ada di disk (localStorage failed)

**Fix:**
```bash
# 1. Check PM2 logs
pm2 logs sidora-v3 | grep -A 5 "HERO-UPLOAD"

# Look for:
# ✓ Using upload path: /var/www/sidora-v3/public/uploads/hero
# ✓ File written successfully
# vs
# ✗ Cannot use path...
# ✗ No writable upload directory found

# 2. Check permissions
ls -la /var/www/sidora-v3/public/uploads/hero/

# 3. Check if file exists
ls /var/www/sidora-v3/public/uploads/hero/hero-*.jpg

# 4. Verify disk space
df -h /var/www/sidora-v3/
```

### Error 2: "Unexpected token '<'" (HTML error response)

**Cause:** Nginx config issue atau middleware intercept

**Fix:**
```bash
# 1. Check middleware.ts - should not intercept /api/hero-section/upload
grep -n "api" /var/www/sidora-v3/middleware.ts

# 2. Check Nginx config
sudo nginx -t

# 3. Reload Nginx
sudo systemctl reload nginx

# 4. Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

### Error 3: "Request entity too large" (413)

**Cause:** client_max_body_size tidak di-set di Nginx

**Fix:**
```bash
# 1. Edit Nginx config
sudo nano /etc/nginx/sites-available/sidora-v3
# Add: client_max_body_size 100M;

# 2. Test
sudo nginx -t

# 3. Reload
sudo systemctl reload nginx
```

### Error 4: "Permission denied" saat write

**Cause:** Directory ownership salah atau permission terlalu ketat

**Fix:**
```bash
# 1. Check ownership
ls -la /var/www/sidora-v3/public/uploads/

# 2. Fix
sudo chown -R www-data:www-data /var/www/sidora-v3/public/uploads

# 3. Check permission - should be writable
sudo -u www-data touch /var/www/sidora-v3/public/uploads/hero/.test
sudo rm /var/www/sidora-v3/public/uploads/hero/.test
```

### Error 5: File appears di DB tapi tidak di disk

**Cause:** Upload logic saved to DB (fallback base64) tapi backend dideploy sebelum fix

**Fix:**
```bash
# 1. Data cleanup (opsional - manual atau script)
# Check database untuk entries dengan bannerImageUrl = "data:image/..."
# Jika ingin, bisa delete atau re-upload

# 2. Deploy fix code
cd /var/www/sidora-v3
git pull origin main
npm run build
pm2 restart sidora-v3

# 3. Re-upload images dengan form
```

---

## 🔍 Advanced Debugging

### Enable Verbose Logging

```bash
# Edit .env.production
LOG_LEVEL="debug"

# Restart
pm2 restart sidora-v3

# Watch logs
pm2 logs sidora-v3 --follow
```

### Monitor Real-Time Uploads

```bash
# Terminal 1: Watch logs
pm2 logs sidora-v3 | grep HERO-UPLOAD

# Terminal 2: Monitor filesystem changes
watch -n 1 'ls -la /var/www/sidora-v3/public/uploads/hero/ | tail -5'

# Terminal 3: Upload test
# ... upload via UI or cURL ...
```

### Verify Nginx is Serving Static Files

```bash
# 1. Create test file manually
echo "test content" | sudo tee /var/www/sidora-v3/public/uploads/test.txt

# 2. Test via Nginx
curl http://localhost/uploads/test.txt
# Should see: "test content"

# NOT: Next.js 404 page or HTML error
```

---

## 📋 Verification Checklist - After Deploy

- [ ] UPLOADS_DIR diset di .env.production
- [ ] Directory `/var/www/sidora-v3/public/uploads/{hero,berita}` exists
- [ ] Permissions: `drwxr-xr-x www-data:www-data`
- [ ] www-data user dapat write: `sudo -u www-data touch /path/.test`
- [ ] NODE_ENV="production" diset
- [ ] Nginx config updated dengan `client_max_body_size 100M`
- [ ] Nginx tested: `sudo nginx -t`
- [ ] Nginx reloaded: `sudo systemctl reload nginx`
- [ ] PM2 restarted: `pm2 restart sidora-v3`
- [ ] Upload test via UI atau cURL berhasil
- [ ] File fisik ada di disk: `ls /var/www/sidora-v3/public/uploads/hero/`
- [ ] Browser dapat akses file: `curl http://sidorav3.cloud/uploads/hero/...`
