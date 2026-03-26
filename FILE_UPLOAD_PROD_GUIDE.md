# File Upload Configuration Guide

## Local Development

File uploads bekerja otomatis di development:
- Files disimpan ke `/public/uploads/berita/`
- URL yang di-return: `/uploads/berita/filename.png`
- Static files di-serve otomatis dari `/public`

## Production Deployment

### Opsi 1: Cloud Platform dengan Container (Recommended)

Untuk platform seperti Azure Container Instances, AWS App Runner, atau Vercel:

1. **Buat persistent storage mount** (jika tersedia)
   ```bash
   # Untuk Azure Container Instances, mount Azure File Share
   # Untuk Docker, gunakan named volumes
   docker run -v uploads_storage:/tmp/uploads -e UPLOADS_DIR=/tmp/uploads ...
   ```

2. **Set environment variable** di platform deployment:
   ```
   NEXT_PUBLIC_APP_URL=https://sidorav3.cloud
   UPLOADS_DIR=/tmp/uploads
   NODE_ENV=production
   ```

3. **Pastikan `/public` folder di-include dalam build**:
   - Check di `.dockerignore` atau build config
   - `/public` folder harus NOT di-exclude

### Opsi 2: Traditional VPS/Server Hosting

1. **Create persistent uploads directory**:
   ```bash
   sudo mkdir -p /var/www/uploads
   sudo chown www-data:www-data /var/www/uploads
   sudo chmod 755 /var/www/uploads
   ```

2. **Update .env di server**:
   ```
   UPLOADS_DIR=/var/www/uploads
   NEXT_PUBLIC_APP_URL=https://sidorav3.cloud
   ```

3. **Setup symlink atau serve files dengan nginx**:
   ```nginx
   # Nginx config
   location /uploads {
       root /var/www;
       expires 7d;
       add_header Cache-Control "public, immutable";
   }
   ```

### Opsi 3: Cloud Storage (Best Practice)

Gunakan cloud storage service untuk scalability lebih baik:

```typescript
// Perlu modifikasi upload route untuk menggunakan cloud SDK
// Contoh: Azure Blob Storage, AWS S3, Google Cloud Storage

// Install package:
npm install @azure/storage-blob
// atau
npm install aws-sdk
```

Update `app/api/upload/route.ts` untuk menggunakan cloud SDK.

## Troubleshooting

### Image Not Found di Production

**Penyebab Umum:**
1. `/public` folder tidak ada atau tidak ter-serve
2. Path tidak sesuai antara upload dan serving
3. CORS/permission issues

**Debug:**
```bash
# Check server logs
docker logs <container-id>
# atau
tail -f /var/log/next-app.log

# Verify file exists
ls -la /tmp/uploads/
# atau 
ls -la /var/www/uploads/
```

### Permission Denied Errors

```bash
# Fix permissions
chmod -R 755 /var/www/uploads
chown -R www-data:www-data /var/www/uploads
```

### Files Persisten di Container

Jika menggunakan Docker/Container, setup volume:

```yaml
# docker-compose.yml
services:
  app:
    image: sidora-v3:latest
    volumes:
      - uploads_data:/tmp/uploads
    environment:
      - UPLOADS_DIR=/tmp/uploads
      - NEXT_PUBLIC_APP_URL=https://sidorav3.cloud

volumes:
  uploads_data:
    driver: local
```

## Production Checklist

- [ ] Set `NEXT_PUBLIC_APP_URL` environment variable
- [ ] Create persistent storage directory
- [ ] Set `UPLOADS_DIR` if using custom path
- [ ] Verify `/public` folder exists in production build
- [ ] Test file upload and access at `https://yourdomain.com/uploads/berita/filename.png`
- [ ] Setup proper file permissions (755 for dir, 644 for files)
- [ ] Enable file caching headers in nginx/server config
- [ ] Monitor disk space for uploads directory
- [ ] Setup backup for uploads directory

## Monitoring

Add monitoring untuk uploads:

```bash
# Check disk usage
df -h /tmp/uploads
du -sh /tmp/uploads

# Setup logrotate untuk logs
cat /etc/logrotate.d/next-app
```
