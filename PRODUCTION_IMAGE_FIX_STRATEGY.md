# Production Image Serving Fix Strategy

## Problem Summary
Files upload successfully to production (`/uploads/berita/filename`), but accessing the image returns **404** errors.

Upload logs confirm:  
✅ "File uploaded successfully: https://sidorav3.cloud/uploads/berita/1774565168928-irv0j.png"  
❌ "⨯ upstream image response failed... 404"

## Root Cause
The file is saved to the filesystem (`/app/public/uploads` or similar), but Next.js Image Optimization cannot access it:

1. **Direct Path Issue**: Files in `/tmp/uploads` or `/app/public/uploads` without proper web server config
2. **URL Generation Issue**: Using absolute URLs that don't resolve correctly
3. **Missing Web Server Config**: Nginx/server not configured to serve `/public` folder

## Solution Strategy (3-Layer Fallback)

### Layer 1: Relative URLs (Already Implemented ✅)
In `app/api/upload/route.ts`, return **relative** URLs:
```typescript
// Returns relative path that web server can serve
const url = `/uploads/berita/${filename}`;
```

**Why this helps**: Relative URLs let the web server handle static file serving naturally, avoiding Image Optimization issues.

### Layer 2: API Fallback Route (New ✅)
Updated `lib/image-utils.ts` to use `/api/files/` as fallback in production:
```typescript
if (!isDev) {
  // Production: Use API fallback route
  if (imagePath.startsWith('/uploads/')) {
    return `/api/files/${imagePath.replace(/^\/uploads\//, '')}`;
  }
}
```

**How it works**:
- Image URL: `/uploads/berita/photo.png` → `/api/files/berita/photo.png`
- The `/api/files/[[...slug]]` route searches multiple directories and serves the file
- Falls back through: `UPLOADS_DIR` → `/app/public/uploads` → `/tmp/uploads`

### Layer 3: Detection & Path Priority (Already Updated ✅)
`app/api/files/[[...slug]]/route.ts` tries multiple storage locations:
```typescript
const possiblePaths = [
  process.env.UPLOADS_DIR ? join(process.env.UPLOADS_DIR, filePath) : null,
  join('/app/public/uploads', filePath),         // Docker container
  join(process.cwd(), 'public', 'uploads', filePath), // VPS
  join('/tmp/uploads', filePath),                // Fallback
];
```

## Implementation Status

- ✅ Upload API returns relative URLs: `/uploads/berita/filename`
- ✅ Image utilities configured to use API fallback in production
- ✅ File serving route detects multiple storage locations
- ✅ Health check endpoint available: `GET /api/health`

## Testing the Fix

### Step 1: Verify Upload API Works
```bash
curl https://sidorav3.cloud/api/health
```

**Expected response**:
```json
{
  "status": "HEALTHY",
  "environment": "production",
  "uploadDir": "/app/public/uploads",
  "writable": true,
  "diskSpace": "X GB available"
}
```

### Step 2: Test Image Upload
1. Admin panel → Create News Article
2. Upload an image
3. Verify file shows in console logs: "File uploaded successfully"

### Step 3: Test Image Display
1. Save the article
2. View the image directly: `https://sidorav3.cloud/uploads/berita/FILENAME`
3. **If 404**: Image service uses `/api/files/berita/FILENAME` automatically
4. View the article in public - image should display

### Step 4: Verify API Route Works
```bash
curl "https://sidorav3.cloud/api/files/berita/FILENAME" -I
```

**Expected response**: `200 OK` with proper Content-Type header

## If Still Getting 404

### Check 1: Web Server Static File Serving
If using Nginx, verify `/public` folder is served:
```nginx
location /uploads {
  alias /app/public/uploads;
  access_log off;
  expires 30d;
  try_files $uri $uri/ =404;
}

# OR forward unmapped uploads to API route
location /uploads {
  proxy_pass http://localhost:3000/api/files/$request_uri;
}
```

### Check 2: Verify File Was Actually Saved
```bash
# On production server
ls -la /app/public/uploads/berita/
ls -la $UPLOADS_DIR/  # if UPLOADS_DIR env var set
```

### Check 3: Check Upload Directory Configuration
```bash
# Verify UPLOADS_DIR environment variable
env | grep UPLOADS_DIR

# Or check .env.production file
cat .env.production | grep UPLOADS
```

### Check 4: Use API Route Diagnostics
```bash
# Call the fallback route with verbose logging
curl -v "https://sidorav3.cloud/api/files/berita/FILENAME_HERE"
```

Check for headers like:
- `X-Searched-Paths`: Shows all attempted file locations
- `Content-Type`: Should be image MIME type
- `X-File-Source`: Shows which path the file was found in

## Recommended Production Setup

### Option A: Web Server Direct Serving (Best Performance ⭐)
1. Configure Nginx/Apache to serve `/public/uploads` folder
2. Set `UPLOADS_DIR=/app/public/uploads` in `.env.production`
3. Images serve directly without API overhead
4. API route acts as fallback only

### Option B: Force API-Only Serving (More Reliable)
1. All `/uploads/` requests route to `/api/files/` API
2. Single source of truth for file serving
3. Slightly slower but more maintainable
4. Already configured in `lib/image-utils.ts`

### Option C: Use Cloud Storage (Best for Scale 🚀)
1. Use next-cloudinary or similar
2. Upload to Cloudinary, AWS S3, or similar
3. Completely bypass filesystem concerns
4. See PRODUCTION_DEPLOYMENT_GUIDE.md for details

## Environment Variables Checklist

```bash
# .env.production file should have:
NEXT_PUBLIC_APP_URL=https://sidorav3.cloud
UPLOADS_DIR=/app/public/uploads  # or your custom path
DATABASE_URL=mysql://user:pass@host/dbname
```

## To Deploy This Fix

1. **Pull latest changes**:
   ```bash
   git pull origin main
   npm install  # if needed
   ```

2. **Verify configuration**:
   ```bash
   curl https://sidorav3.cloud/api/health
   ```

3. **Test upload** in admin panel

4. **Check logs** if still having issues:
   ```bash
   docker logs sidora-v3  # if using Docker
   # or check application logs directory
   ```

## Performance Considerations

- **Direct serving**: <10ms latency (best)
- **API fallback route**: ~50-100ms latency (acceptable)
- **Image optimization + API**: ~200ms+ (acceptable but could improve)

For production with many images, consider Nginx config (Option A) for best performance.

## Related Documentation
- [QUICK_FIX_UPLOAD.md](./QUICK_FIX_UPLOAD.md) - Quick diagnostic checklist
- [UPLOAD_TROUBLESHOOTING.md](./UPLOAD_TROUBLESHOOTING.md) - Detailed troubleshooting
- [FILE_UPLOAD_PROD_GUIDE.md](./FILE_UPLOAD_PROD_GUIDE.md) - Platform-specific setup
- [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md) - Full deployment instructions
