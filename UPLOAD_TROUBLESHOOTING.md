# Production Upload Troubleshooting Guide

## Quick Checklist

- [ ] Set `NEXT_PUBLIC_APP_URL` in production environment
- [ ] Check server logs for upload errors
- [ ] Verify file system permissions
- [ ] Ensure `/tmp` or `UPLOADS_DIR` is writable
- [ ] Check disk space available
- [ ] Verify database connection

## Common Issues & Solutions

### Issue 1: Upload Failed with No Error Message

**Cause:** Usually permission or path issue

**Debug:**
```bash
# Check server logs
docker logs <container-id>  # if using Docker
tail -f /var/log/application.log

# Check if directories exist and are writable
ls -la /tmp/uploads/
ls -la /app/public/uploads/
```

**Solution:** Ensure writable directories:
```bash
# Create if doesn't exist
mkdir -p /tmp/uploads/berita
chmod 755 /tmp/uploads

# Or use custom path
export UPLOADS_DIR=/var/www/uploads
mkdir -p $UPLOADS_DIR/berita
chmod 755 $UPLOADS_DIR
```

---

### Issue 2: "Image Not Found" After Upload

**Cause:** `NEXT_PUBLIC_APP_URL` not set correctly

**Solution - Production Only:**

For **Azure Container Instances:**
```env
NEXT_PUBLIC_APP_URL=https://<your-domain>.azurecontainer.io
# or
NEXT_PUBLIC_APP_URL=https://sidorav3.cloud
```

For **AWS/EC2/VPS:**
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

For **Docker/Local:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### Issue 3: Permission Denied Errors

**Root Cause:** File system permissions in production container

**Solution:**
```dockerfile
# In your Dockerfile
RUN mkdir -p /tmp/uploads/berita && \
    chmod 777 /tmp/uploads/berita

# Or use multi-stage to preserve permissions
FROM node:18 AS deps
RUN mkdir -p /tmp/uploads/berita && chmod 777 /tmp/uploads
```

**For Docker Compose:**
```yaml
services:
  app:
    build: .
    volumes:
      - ./uploads:/tmp/uploads
      - ./uploads:/app/public/uploads
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

### Issue 4: Disk Space Full

**Debug:**
```bash
df -h  # Check disk usage
du -sh /tmp/uploads  # Check uploads folder size
```

**Solution:**
```bash
# Clean old uploads (keep files modified in last 30 days)
find /tmp/uploads -type f -mtime +30 -delete

# Or use S3/cloud storage
```

---

### Issue 5: Database Encoding Issues

**Problem:** Some images stored as base64 appear corrupted

**Solution:** Ensure database column is LONGBLOB
```sql
ALTER TABLE gallery_items 
MODIFY COLUMN imageUrl LONGBLOB;

ALTER TABLE news 
MODIFY COLUMN thumbnail LONGBLOB;
```

---

## Environment Setup for Major Platforms

### Azure Container Instances

```bash
# Create resource group
az group create --name sidora-rg --location southeastasia

# Create container instance with environment variables
az container create \
  --resource-group sidora-rg \
  --name sidora-app \
  --image your-registry/sidora:latest \
  --environment-variables \
    NODE_ENV=production \
    NEXT_PUBLIC_APP_URL=https://sidorav3.cloud \
    DATABASE_URL="mysql://user:pass@host:3306/db" \
  --ports 3000 \
  --cpu 2 --memory 4

# Mount file share for uploads
az container create \
  --resource-group sidora-rg \
  --name sidora-app \
  --image sidora:latest \
  --azure-file-volume-account-name mystorageaccount \
  --azure-file-volume-account-key $STORAGE_KEY \
  --azure-file-volume-share-name uploads \
  --azure-file-volume-mount-path /mnt/uploads \
  --environment-variables UPLOADS_DIR=/mnt/uploads
```

### AWS App Runner

```bash
# Set environment variables in AWS Console or via CLI
aws apprunner create-service \
  --service-name sidora-app \
  --service-role-arn arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole \
  --source-configuration \
    ImageRepository={RepositoryType=ECR,ImageIdentifier=...} \
  --instance-config Cpu=2,Memory=4 \
  --environment-variables \
    NODE_ENV=production,\
    NEXT_PUBLIC_APP_URL=https://your-domain.com,\
    DATABASE_URL='mysql://...'
```

**For persistence, use EBS volume or S3:**
```javascript
// Modify upload route to use S3
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

async function uploadToS3(file, filename) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/berita/${filename}`,
    Body: await file.arrayBuffer(),
    ContentType: file.type,
  };
  
  const result = await s3.upload(params).promise();
  return {
    url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/uploads/berita/${filename}`,
    local: false
  };
}
```

### Vercel

```bash
# Set environment via vercel.json or UI
{
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://sidorav3.vercel.app"
  }
}

# For persistent storage, use:
# - Vercel Postgres (store as base64)
# - AWS S3
# - Azure Blob Storage
```

**Note:** Vercel `/tmp` is ephemeral - files won't persist between deployments!

---

## Best Practice: Use Cloud Storage

For production, use cloud storage services:

### Option A: Azure Blob Storage
```typescript
import { BlobServiceClient } from "@azure/storage-blob";

export async function uploadToAzure(file: File, filename: string) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING!
  );
  const containerClient = blobServiceClient.getContainerClient('uploads');
  const blockBlobClient = containerClient.getBlockBlobClient(filename);
  
  await blockBlobClient.uploadData(await file.arrayBuffer(), {
    blobHTTPHeaders: { blobContentType: file.type },
  });
  
  return blockBlobClient.url;
}
```

### Option B: AWS S3
```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadToS3(file: File, filename: string) {
  const s3Client = new S3Client({ region: process.env.AWS_REGION });
  
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/${filename}`,
    Body: await file.arrayBuffer(),
    ContentType: file.type,
  }));
  
  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/uploads/${filename}`;
}
```

---

## Production Upload Route with Cloud Fallback

```typescript
// Better upload route with multiple storage options
export async function POST(request: NextRequest) {
  const file = await getAndValidateFile(request);
  
  // Try in order: Cloud Storage → Local FS → Database
  let result = 
    await tryCloudStorage(file) ||
    await tryLocalStorage(file) ||
    await tryDatabaseStorage(file);
  
  if (!result) {
    return error('No storage available', 500);
  }
  
  return success(result);
}
```

---

## Monitoring & Maintenance

```bash
# Monitor uploads folder
watch -n 5 'ls -la /tmp/uploads/ | tail -20'

# Log file uploads for audit
tail -f /var/log/upload-audit.log | grep -i upload

# Cleanup old uploads
cron: 0 2 * * * find /tmp/uploads -type f -mtime +90 -delete

# Alert on disk space
df /tmp | awk '$5 > 80 { print "WARNING: Disk usage is " $5 }' | mail admin@example.com
```

---

## When All Else Fails

1. **Check application logs** - Most detailed information
2. **Check browser console** - Network tab for API response
3. **Test with curl:**
   ```bash
   curl -X POST \
     -F "file=@/path/to/image.jpg" \
     https://your-domain.com/api/upload
   ```
4. **Test database connection:**
   ```bash
   mysql -h $DB_HOST -u $DB_USER -p $DB_PASSWORD -e "SHOW DATABASES;"
   ```
5. **Check file permissions:**
   ```bash
   ls -la /tmp/uploads/
   stat /tmp/uploads/
   ```

---

## Getting Help

When asking for help, provide:
- [ ] Error message from browser console
- [ ] Server logs (stderr/stdout)
- ] Output of `df -h` (disk space)
- [ ] Output of `ls -la /tmp/uploads/`
- [ ] Platform info (Azure, AWS, VPS, Docker, etc)
- [ ] `NEXT_PUBLIC_APP_URL` value
- [ ] `NODE_ENV` value
