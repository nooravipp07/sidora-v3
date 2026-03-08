# Authentication System Implementation Guide

## Project Structure

```
app/
├── api/
│   └── auth/
│       ├── login/route.ts       # Login endpoint
│       ├── logout/route.ts      # Logout endpoint
│       └── me/route.ts          # Get current user
├── (public)/
│   └── login/page.tsx           # Login page
└── (admin)/
    └── dashboard/               # Protected dashboard routes

lib/
└── auth/
    ├── types.ts                 # TypeScript types
    ├── jwt.ts                   # JWT utilities
    ├── bcrypt.ts                # Password hashing
    ├── prisma.ts                # Prisma client
    ├── middleware.ts            # Auth middleware
    ├── useAuth.ts               # React hooks
    └── index.ts                 # Barrel export

prisma/
├── schema.prisma                # Database schema
└── seed.ts                      # Database seeding

middleware.ts                    # Next.js middleware
.env.local                      # Environment variables
```

## Installation & Setup

### 1. Install Dependencies

Run the following command:

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

### 2. Configure Environment Variables

Update `.env.local` with your database connection and JWT settings:

```env
DATABASE_URL="mysql://username:password@localhost:3306/sidora_v3"
JWT_SECRET="your-secret-key-change-in-production-min-32-chars"
JWT_EXPIRY="7d"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Important for Production:**
- Change `JWT_SECRET` to a strong, random string (minimum 32 characters)
- Use environment variables for all sensitive data
- Set `NODE_ENV=production` in production

### 3. Setup Database

Create your MySQL database:

```sql
CREATE DATABASE sidora_v3;
```

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

### 4. Seed Initial Data (Optional)

Add test users and roles:

```bash
npx prisma db seed
```

This will create:
- **Admin user**: admin@example.com / password123 (roleId: 1)
- **Operator user**: operator@example.com / password123 (roleId: 2)
- **Regular user**: user@example.com / password123 (roleId: 3)

### 5. Start Development Server

```bash
npm run dev
```

Access the application at `http://localhost:3000`

## API Endpoints

### POST /api/auth/login

Login with email and password. Returns JWT token in HTTP-only cookie.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "name": "Administrator",
    "email": "admin@example.com",
    "roleId": 1,
    "status": 1
  },
  "redirectUrl": "/dashboard/admin"
}
```

### POST /api/auth/logout

Logout and clear authentication cookie.

**Response:**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

### GET /api/auth/me

Get current authenticated user details.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Administrator",
    "email": "admin@example.com",
    "namaLengkap": "Admin System",
    "roleId": 1,
    "status": 1,
    "lastLogin": "2024-03-08T10:30:00Z",
    "role": {
      "id": 1,
      "name": "admin",
      "description": "Administrator"
    }
  }
}
```

## Database Schema

### m_users
Main user table with authentication credentials.

### m_roles
User roles (admin, operator, user, etc.)

### m_permissions
System permissions.

### m_role_permissions
Pivot table for role-permission relationships.

### m_refresh_tokens
Token rotation for enhanced security.

### m_login_history
Audit trail for login attempts.

## Security Features

### 1. Password Security
- Passwords hashed with bcryptjs (10 salt rounds)
- Example: `bcryptjs.hash(password, 10)`

### 2. Token Security
- JWT tokens signed with HS256 algorithm
- Tokens stored in HTTP-only cookies (CSRF safe)
- 7-day expiration (configurable)
- Auto-refresh on page load

### 3. Route Protection
- Next.js middleware protects all `/dashboard/*` routes
- Automatic redirect to login if unauthorized
- Role-based access control (RBAC)

### 4. Environment Isolation
- Sensitive data in `.env.local` (never commit)
- Different JWT_SECRET per environment
- Secure cookie flags in production

## Frontend Integration

### Using useAuth Hook

```tsx
'use client';

import { useAuth, useLogout } from '@/lib/auth/useAuth';

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const logout = useLogout();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Wrap App with AuthProvider

Update `app/layout.tsx`:

```tsx
import { AuthProvider } from '@/lib/auth/useAuth';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

## Customization

### Change JWT Expiry

Edit `.env.local`:
```env
JWT_EXPIRY="30d"  # Change to any duration
```

### Add More Roles

Update role-based redirect in `middleware.ts`:

```typescript
if (pathname.startsWith('/dashboard/custom') && decoded.roleId !== 5) {
  return NextResponse.redirect(new URL('/dashboard/user', request.url));
}
```

### Add More Permissions

Add to `prisma/schema.prisma` and create migration:

```bash
npx prisma migrate dev --name add_custom_permission
```

## Best Practices

1. **Never hardcode secrets** - Use environment variables
2. **Always validate input** - Check email format, password length
3. **Use HTTPS in production** - Set `secure: true` for cookies
4. **Rotate secrets regularly** - Change JWT_SECRET periodically
5. **Log security events** - Use LoginHistory table for audit trails
6. **Implement rate limiting** - Add to login endpoint
7. **Use password reset flow** - For password recovery
8. **Add 2FA** - For enhanced security
9. **Monitor failed logins** - Alert on suspicious activity
10. **Expire sessions** - Clear old refresh tokens regularly

## Troubleshooting

### Token not found error
- Ensure cookies are enabled in browser
- Check that `credentials: 'include'` is in fetch requests
- Verify CORS configuration if using different domains

### "Unauthorized" response
- Token may have expired (7 days by default)
- JWT_SECRET mismatch between environments
- Verify token format is valid

### Users not redirecting after login
- Check role_id in m_users table
- Verify redirect mapping in middleware.ts
- Clear browser cookies and try again

### Database connection issues
- Verify DATABASE_URL is correct
- Check MySQL server is running
- Ensure database exists and user has permissions

## Additional Features to Add

1. **Email Verification** - Verify email before login
2. **Password Reset** - Allow users to reset forgotten passwords
3. **Two-Factor Authentication** - SMS or authenticator app
4. **Social Login** - OAuth with Google, GitHub, etc.
5. **Session Management** - Track active sessions
6. **Rate Limiting** - Prevent brute force attacks
7. **Audit Logging** - Track all user actions
8. **API Keys** - For programmatic access
9. **SSO Integration** - Single Sign-On support
10. **Password Policies** - Enforce strong passwords

## Performance Optimization

1. **Cache user data** - Use React Query or SWR
2. **Lazy load auth context** - Only when needed
3. **Memoize hooks** - Prevent unnecessary re-renders
4. **Database indexing** - Index email and id columns
5. **CDN static files** - Cache login page assets

## Running Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## Deployment

### Vercel (Recommended for Next.js)

```bash
npm install -g vercel
vercel
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables in Production

Set in your hosting platform's environment configuration:
- DATABASE_URL (production database)
- JWT_SECRET (strong, random string)
- NODE_ENV=production
- NEXT_PUBLIC_API_URL (production URL)

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP Security Guidelines](https://owasp.org/)
