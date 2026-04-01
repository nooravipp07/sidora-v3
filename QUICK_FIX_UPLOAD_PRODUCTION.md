# Quick Fix Guide: Upload Error di Production VPS

Jika upload error "Unexpected token '<'" pada production VPS, ikuti guide ini.

## 🚨 Problem
```
Gagal mengupload gambar: Unexpected token '<', "<html>
<h"... is not valid JSON
```

**Cause**: Server return HTML error page bukan JSON response.

---

## ⚡ Quick Fix (5 Steps)

### **Step 1: SSH ke VPS**
```bash
ssh user@sidorav3.cloud
cd /var/www/sidora-v3
```

### **Step 2: Create Upload Directories**
```bash
sudo mkdir -p /var/www/sidora-v3/public/uploads/berita
sudo mkdir -p /var/www/sidora-v3/public/uploads/hero
sudo chown -R www-data:www-data /var/www/sidora-v3/public/uploads
sudo chmod -R 755 /var/www/sidora-v3/public/uploads
```

### **Step 3: Add Environment Variable**
```bash
# Edit atau create .env.production
nano .env.production

# Add this line:
UPLOADS_DIR=/var/www/sidora-v3/public/uploads/berita
```

### **Step 4: Check Nginx Config**
```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/sidora-v3

# Make sure server block has:
server {
    client_max_body_size 100M;          # ← ADD THIS
    client_body_timeout 300s;           # ← ADD THIS
    proxy_read_timeout 300s;            # ← ADD THIS
    proxy_send_timeout 300s;            # ← ADD THIS
    ...
}

# Test & reload
sudo nginx -t
sudo systemctl reload nginx
```

### **Step 5: Rebuild & Restart**
```bash
# Build application
npm run build

# Restart PM2
pm2 restart sidora-v3

# Verify running
pm2 status
pm2 logs sidora-v3 --lines 20
```

---

## ✅ Test Upload

```bash
# Test with curl
curl -X POST \
  -F "file=@/path/to/image.jpg" \
  https://sidorav3.cloud/api/upload

# Should return JSON:
# {"url":"/uploads/berita/1712138400000-xxx.jpg","local":true}
```

---

## 🔍 If Still Not Working

### Check 1: File Logs
```bash
pm2 logs sidora-v3 | grep "UPLOAD"
# Should see successful [UPLOAD] messages
```

### Check 2: File Permission
```bash
sudo -u www-data touch /var/www/sidora-v3/public/uploads/test.txt
ls -la /var/www/sidora-v3/public/uploads/test.txt
```

### Check 3: Nginx Error
```bash
sudo tail -f /var/log/nginx/error.log
# Look for 413, 502, timeout errors
```

### Check 4: Verify Code Changed
```bash
# Verify middleware.ts exclude api
git diff middleware.ts
# Should show: '/((?!_next/static|_next/image|favicon.ico|public|api).*)'
```

---

## 📋 Checklist

- [ ] Step 1: SSH to VPS
- [ ] Step 2: Create upload directories with chmod 755
- [ ] Step 3: Add UPLOADS_DIR to .env.production
- [ ] Step 4: Add 4 lines to Nginx config
- [ ] Step 5: Build dan restart PM2
- [ ] Test upload returns JSON

---

## 📞 If Need Full Details

See these files:
- [`UPLOAD_ERROR_ROOT_CAUSE.md`](UPLOAD_ERROR_ROOT_CAUSE.md) - Root cause analysis
- [`ENV_PRODUCTION_CHECKLIST.md`](ENV_PRODUCTION_CHECKLIST.md) - Full checklist with debugging
- [`NGINX_UPLOAD_CONFIG.md`](NGINX_UPLOAD_CONFIG.md) - Nginx config details
- [`setup-production.sh`](setup-production.sh) - Automated setup script

## Done! 🚀

Upload should now work correctly di production!

Jika masih ada error, check logs dengan:
```bash
pm2 logs sidora-v3
# dan
sudo tail -f /var/log/nginx/error.log
```
