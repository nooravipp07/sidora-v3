# Production Deployment Guide

## Pre-Deployment Checklist

### Security
- [ ] Change `JWT_SECRET` to a strong random string (min 32 chars)
- [ ] Update database credentials
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS on your domain
- [ ] Configure CORS if needed
- [ ] Review all environment variables
- [ ] Update `NEXT_PUBLIC_API_URL` to production domain
- [ ] Implement rate limiting on login endpoint
- [ ] Add CSRF protection
- [ ] Set secure cookie flags

### Database
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Backup existing database
- [ ] Verify all tables created
- [ ] Run seed for initial roles/permissions
- [ ] Test database connection from production server

### Performance
- [ ] Test all login flows
- [ ] Verify token expiration works
- [ ] Test role-based redirects
- [ ] Load test the API endpoints
- [ ] Check database query performance
- [ ] Verify cookie settings work with HTTPS

### Monitoring
- [ ] Setup error tracking (Sentry/Rollbar)
- [ ] Add logging for auth events
- [ ] Monitor failed login attempts
- [ ] Track API response times
- [ ] Setup database backups

### Documentation
- [ ] Document all environment variables
- [ ] Create user management guidelines
- [ ] Document role structure
- [ ] Create incident response procedures
- [ ] Update team documentation

---

## Environment Variables for Production

```env
# Database
DATABASE_URL="mysql://prod_user:SecurePassword123@prod-db.example.com:3306/sidora_prod"

# JWT
JWT_SECRET="your-very-long-and-random-secret-string-min-32-chars-aB3xYz9mN2kL"
JWT_EXPIRY="7d"

# NextJS
NODE_ENV="production"
NEXT_PUBLIC_API_URL="https://app.example.com"

# Optional
LOG_LEVEL="info"
SENTRY_DSN="https://xxxx@sentry.io/12345"
```

---

## Deployment Platforms

### Vercel (Recommended for Next.js)

1. **Connect Repository**
   - Push code to GitHub/GitLab/Bitbucket
   - Import project in Vercel dashboard

2. **Configure Environment Variables**
   - Go to Settings > Environment Variables
   - Add all variables from `.env.local`
   - Set for Production environment

3. **Database Setup**
   - Use Vercel Postgres (or external MySQL)
   - Update DATABASE_URL environment variable
   - Run migrations: `vercel env pull && npx prisma migrate deploy`

4. **Deploy**
   - Deploy button or automatic deployment on push
   - Vercel automatically builds and starts server

### Docker (Self-Hosted)

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && npm run prisma:generate

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: mysql://user:password@db:3306/sidora
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - db
    restart: always

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: sidora
      MYSQL_USER: sidora_user
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    restart: always

volumes:
  db_data:
```

**Deploy with Docker:**
```bash
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

### AWS (EC2 + RDS)

1. **EC2 Instance Setup**
   ```bash
   # SSH into instance
   sudo yum update -y
   sudo yum install nodejs npm -y
   
   # Clone repo
   git clone <repo-url>
   cd sidora-v3
   npm install
   ```

2. **RDS Database**
   - Create RDS MySQL instance
   - Get endpoint URL
   - Set DATABASE_URL environment variable

3. **Environment Variables**
   ```bash
   export DATABASE_URL="mysql://user:password@rds-endpoint:3306/sidora"
   export JWT_SECRET="your-secret"
   export NODE_ENV="production"
   ```

4. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

5. **Start Application**
   ```bash
   npm run build
   npm start
   ```

6. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start "npm start" --name "sidora"
   pm2 save
   pm2 startup
   ```

### DigitalOcean App Platform

1. Sign in to DigitalOcean
2. Click "Create" > "App"
3. Connect GitHub repository
4. Set environment variables
5. Configure build/run commands
6. Deploy

---

## SSL/TLS Certificate

### Let's Encrypt with Nginx

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d app.example.com
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name app.example.com;

    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## CDN Configuration

### Using Cloudflare

1. **Set Nameservers** to Cloudflare
2. **SSL/TLS** > Set to "Full (strict)"
3. **Cache Rules** > Cache static assets
4. **Security** > Enable bot protection

### Cache Settings

```nginx
# In next.config.mjs
headers: async () => {
  return [
    {
      source: '/api/auth/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate',
        },
      ],
    },
    {
      source: '/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
},
```

---

## Monitoring & Logging

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

Update `next.config.mjs`:
```javascript
const { withSentryConfig } = require("@sentry/nextjs");

export default withSentryConfig({
  // Your existing config
}, {
  org: "your-org",
  project: "your-project",
});
```

### Database Monitoring

Monitor query performance:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  
  // Enable slow query logging
  // Set in MySQL: set global log_queries_not_using_indexes=1;
}
```

### Application Logs

```typescript
// lib/logger.ts
export const logger = {
  info: (msg: string, data?: any) => console.log(`[INFO] ${msg}`, data),
  error: (msg: string, err?: any) => console.error(`[ERROR] ${msg}`, err),
  warn: (msg: string, data?: any) => console.warn(`[WARN] ${msg}`, data),
};
```

---

## Performance Optimization

### Database Indexing

```sql
-- Already in schema:
CREATE UNIQUE INDEX users_email_unique ON m_users(email);

-- Additionally recommended:
CREATE INDEX idx_users_roleid ON m_users(role_id);
CREATE INDEX idx_users_status ON m_users(status);
CREATE INDEX idx_loginhistory_userid ON m_login_history(user_id);
CREATE INDEX idx_loginhistory_createdat ON m_login_history(created_at);
```

### Query Optimization

```typescript
// Use select to minimize data transfer
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    name: true,
    roleId: true,
    status: true,
    // Don't fetch password unless needed
  },
});
```

### API Response Compression

```bash
npm install compression
```

```typescript
// api/auth/login - already handled by Next.js
// Next.js compresses responses by default
```

---

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u user -p'password' sidora_prod > /backups/sidora_$DATE.sql.gz
```

### Automated Backups (AWS)

- Enable automated backups in RDS console
- Set backup retention to 30 days
- Enable Multi-AZ for high availability

---

## Post-Deployment

1. **Verify Authentication**
   - Test login with production credentials
   - Verify tokens work
   - Check role redirects

2. **Monitor Performance**
   - Check response times
   - Monitor database queries
   - Track error rates

3. **Security Check**
   - Verify HTTPS is enforced
   - Check secure cookie flags
   - Test CSRF protection

4. **Load Testing**
   ```bash
   npm install -g artillery
   artillery quick --count 100 --num 10 https://app.example.com/api/auth/login
   ```

5. **Documentation Update**
   - Document deployment specifics
   - Create runbooks for common tasks
   - Document rollback procedures

---

## Troubleshooting Production Issues

### High CPU Usage
- Check slow queries: `SHOW PROCESSLIST;`
- Add database indexes
- Review Prisma query optimization

### Database Connection Errors
- Verify DATABASE_URL
- Check network connectivity
- Test with MySQL client: `mysql -h host -u user -p`

### JWT Token Issues
- Ensure JWT_SECRET is same across all instances
- Check system time synchronization (NTP)
- Verify token expiration settings

### 502 Bad Gateway
- Check application logs
- Verify Node process is running
- Check PM2 status: `pm2 status`

### Memory Leaks
- Monitor with PM2: `pm2 monit`
- Check for unclosed database connections
- Review Prisma client usage

---

## Security Hardening

### Additional Measures

1. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

2. **CORS Configuration**
   ```typescript
   headers: {
     'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_API_URL,
     'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
     'Access-Control-Allow-Headers': 'Content-Type',
   }
   ```

3. **HTTPS Redirect**
   ```nginx
   server {
     listen 80;
     server_name app.example.com;
     return 301 https://$server_name$request_uri;
   }
   ```

4. **Security Headers**
   ```typescript
   // next.config.mjs
   headers: async () => {
     return [
       {
         source: '/:path*',
         headers: [
           { key: 'X-Content-Type-Options', value: 'nosniff' },
           { key: 'X-Frame-Options', value: 'DENY' },
           { key: 'X-XSS-Protection', value: '1; mode=block' },
           { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
         ],
       },
     ];
   },
   ```

---

## Rollback Procedure

If issues occur:

1. **Immediate Actions**
   ```bash
   # Revert to previous version
   git revert <commit-hash>
   npm install
   npm run build
   npm start
   ```

2. **Database Rollback**
   ```bash
   # Restore from backup
   mysql -u user -p database_name < backup_file.sql
   ```

3. **Communication**
   - Notify team
   - Update status page
   - Document incident

---

## Success Metrics

Monitor these after deployment:

- **Uptime**: Target 99.9%+
- **API Response Time**: < 200ms p95
- **Error Rate**: < 0.1%
- **Failed Login Attempts**: < 1% false positives
- **Database Query Time**: < 100ms p95
