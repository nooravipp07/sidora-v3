# Quick Fix Upload Not Working in Production

## 🚨 First - Check These 3 Things

### 1. Environment Variables Set?
```bash
# SSH into your production server/container
echo $NEXT_PUBLIC_APP_URL
echo $NODE_ENV

# Should output something like:
# https://sidorav3.cloud
# production
```

**If not set, add to your hosting:**
- Azure: App Settings → Configuration → Environment Variables
- AWS: Systems Manager → Parameter Store
- Docker: `-e NEXT_PUBLIC_APP_URL=https://your-domain.com`
- VPS: Edit `/etc/environment` or `.env` file

### 2. Directory Writable?
```bash
# Check if upload directory exists and is writable
ls -la /tmp/uploads/
ls -la /app/public/uploads/

# Make writable if needed
mkdir -p /tmp/uploads/berita
chmod 777 /tmp/uploads/berita
```

### 3. Check Server Logs
```bash
# Docker
docker logs <container-id> | tail -50

# Systemd
journalctl -u sidora-app -n 100

# PM2
pm2 logs

# Look for "Upload error" messages
```

---

## 🔧 The Quick Fix - What to Execute

### For Docker/Container Users

Update your docker-compose.yml or deployment:

```yaml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_APP_URL=https://sidorav3.cloud
  - DATABASE_URL=mysql://user:pass@host:3306/sidora_v3
```

Then redeploy:
```bash
docker-compose down
docker-compose up -d
```

### For VPS/Traditional Hosting

```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Stop application
pm2 stop sidora-app  # or systemctl stop

# 3. Create upload directory
sudo mkdir -p /tmp/uploads/berita
sudo chmod 777 /tmp/uploads/berita

# 4. Set environment variables
nano .env
# Add/Update:
# NEXT_PUBLIC_APP_URL=https://sidorav3.cloud
# NODE_ENV=production

# 5. Rebuild and restart
npm run build
pm2 start ecosystem.config.js  # or systemctl start

# 6. Check logs
pm2 logs  # or journalctl -f
```

### For Azure Container Instances

```bash
# Update container with env vars
az container create \
  --resource-group <group> \
  --name <container-name> \
  --image <image-uri> \
  --environment-variables \
    NODE_ENV=production \
    NEXT_PUBLIC_APP_URL=https://sidorav3.cloud \
    DATABASE_URL="<your-mysql>" \
  --cpu 2 --memory 4 \
  --registry-username <user> \
  --registry-password <pass>
```

---

## 🧪 Test If It Works Now

### Test via Browser Console

```javascript
// Copy paste into browser console at your-domain.com

// Get diagnostics
import { runUploadDiagnostics } from '/lib/upload-diagnostics.ts'
await runUploadDiagnostics()

// Or simple health check
fetch('/api/health').then(r => r.json()).then(console.log)
```

### Test with curl

```bash
# Simple test
curl https://your-domain.com/api/health | jq '.'

# Upload test (create test.png first)
curl -X POST \
  -F "file=@test.png" \
  https://your-domain.com/api/upload
```

### Manual Test in Admin Panel

1. Go to: `https://your-domain.com/admin/kegiatan`
2. Create Gallery → Try uploading image
3. If error, check:
   - Browser console (F12 → Network tab)
   - Server logs (docker logs, tail, pm2 logs, etc)

---

## 🆘 Still Not Working?

### Provide Me These Debug Info

```bash
# 1. Environment check
echo "NODE_ENV: $NODE_ENV"
echo "NEXT_PUBLIC_APP_URL: $NEXT_PUBLIC_APP_URL"

# 2. Directory check  
ls -la /tmp/uploads/ 2>/dev/null || echo "Directory not found"
ls -la /app/public/uploads/ 2>/dev/null || echo "Directory not found"

# 3. Disk space
df -h /tmp

# 4. Recent logs (last 30 lines)
# Docker: docker logs <container> 2>&1 | tail -30
# PM2: pm2 logs --lines 30
# Systemd: journalctl -u sidora-app -n 30

# 5. Node version
node --version

# 6. Hosting platform info
# Azure: Container Instances / App Service?
# AWS: EC2 / App Runner / Lightsail?
# VPS: Hosting provider?
```

When reporting the issue, share output of all 6 commands above.

---

## 📋 Production Deployment Checklist

- [ ] Set `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Set `NODE_ENV=production`
- [ ] Create `/tmp/uploads/berita` with 755 permissions
- [ ] Verify `DATABASE_URL` is correct
- [ ] Run health check: `curl https://your-domain.com/api/health`
- [ ] Test small file upload in admin panel
- [ ] Check server logs for any errors
- [ ] Verify uploaded image is accessible
- [ ] Setup auto-cleanup script for old uploads

---

## 🛡️ Production Architecture

For best practices, use cloud storage (recommended):

```typescript
// app/api/upload/route.ts
// Choose ONE:

// Option 1: Azure Blob Storage
await uploadToAzure(file);

// Option 2: AWS S3
await uploadToS3(file);

// Option 3: Local filesystem (current, with fallbacks)
await saveFileLocally(file) || await saveFileToDatabase(file);
```

See `FILE_UPLOAD_PROD_GUIDE.md` for cloud storage setup.

---

## 📞 Need Help?

1. Check `UPLOAD_TROUBLESHOOTING.md` - Most common issues
2. Review `FILE_UPLOAD_PROD_GUIDE.md` - Platform-specific setup
3. Run diagnostics - `/api/health` endpoint
4. Check application logs - Most detailed info
5. Share debug info above when asking for help
