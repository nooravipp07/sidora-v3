# Nginx Configuration untuk Upload di Production VPS

Jika menggunakan Nginx sebagai reverse proxy di production VPS, pastikan konfigurasi berikut:

## 1. Increase Request Body Size

Edit `/etc/nginx/nginx.conf` atau site config di `/etc/nginx/sites-available/your-app`:

```nginx
server {
    listen 80;
    server_name sidorav3.cloud;
    
    # ✅ CRITICAL: Allow large file uploads
    client_max_body_size 100M;  # Allow up to 100MB uploads
    
    # Set proper timeouts untuk long-running uploads
    client_body_timeout 300s;   # 5 minutes
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
    
    # Proxy settings untuk Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Don't buffer uploads
        proxy_request_buffering off;
        proxy_buffering off;
        
        # Pass through actual IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # ✅ Serve static uploads directly from filesystem
    location /uploads/ {
        alias /path/to/your/uploads/;  # Must match UPLOADS_DIR or public/uploads
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # ✅ API routes should still go through Next.js
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Don't buffer
        proxy_request_buffering off;
        proxy_buffering off;
    }
}
```

## 2. Validate Nginx Configuration

```bash
# Test nginx syntax
sudo nginx -t

# Expected output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration will be successful
```

## 3. Reload Nginx

```bash
# Reload nginx tanpa downtime
sudo systemctl reload nginx

# Or
sudo service nginx reload

# Or if using docker
docker exec nginx-container nginx -s reload
```

## 4. Verify Upload Directory Accessible

```bash
# Check if upload directory exists dan writable
ls -la /path/to/your/uploads/

# If doesn't exist, create it
sudo mkdir -p /path/to/your/uploads/berita
sudo mkdir -p /path/to/your/uploads/hero

# Set proper permissions untuk www-user (if running with nginx)
sudo chown -R www-data:www-data /path/to/your/uploads/
sudo chmod -R 755 /path/to/your/uploads/

# Or if running with regular user
sudo chown -R $USER:$USER /path/to/your/uploads/
sudo chmod -R 755 /path/to/your/uploads/
```

## 5. Check Disk Space

```bash
# Ensure enough disk space for uploads
df -h

# Example output:
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/sda1       100G   50G   50G  50%  /
#
# ⚠️ If "Use%" > 90%, clean up disk space
```

## Common Issues & Solutions

### Issue: 413 Payload Too Large
**Error:** `413 Request Entity Too Large`

**Fix:**
```nginx
client_max_body_size 100M;  # Increase from default 1M
```

### Issue: 504 Gateway Timeout
**Error:** Upload takes too long

**Fix:**
```nginx
# Increase timeouts
fastcgi_read_timeout 300s;
fastcgi_send_timeout 300s;
proxy_read_timeout 300s;
proxy_send_timeout 300s;
```

### Issue: File saved but 404 when accessing
**Error:** Upload success but image 404

**Verify:**
1. Upload directory path matches `UPLOADS_DIR` env var
2. Nginx location block points to same directory
3. File permissions readable by web server user

## Testing from Command Line

### Test 1: Upload via curl
```bash
curl -X POST \
  -F "file=@/path/to/image.jpg" \
  http://localhost:3000/api/upload \
  -H "Accept: application/json"

# Expected response:
# {"url":"/uploads/berita/1234567-abc123.jpg","local":true}
```

### Test 2: Access uploaded file
```bash
curl -I http://localhost:3000/uploads/berita/1234567-abc123.jpg

# Expected response: 200 OK
# Content-Type: image/jpeg
# Content-Length: 123456
```

### Test 3: Via Nginx (external)
```bash
curl -I https://sidorav3.cloud/uploads/berita/1234567-abc123.jpg

# Expected response: 200 OK
# Should be served directly by Nginx, not by Next.js
```

## Production Checklist

- [ ] Nginx config syntax valid: `nginx -t`
- [ ] Nginx reloaded: `systemctl reload nginx`
- [ ] Upload directory exists
- [ ] Upload directory writable by app user
- [ ] Disk space available (> 10% free)
- [ ] `client_max_body_size` set to 100M or higher
- [ ] Timeouts configured for slow uploads
- [ ] Log files configured to rotate (prevent disk full)

## References

- [Nginx client_max_body_size](http://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
- [Nginx Proxy Documentation](http://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Nginx location Directive](http://nginx.org/en/docs/http/ngx_http_core_module.html#location)
