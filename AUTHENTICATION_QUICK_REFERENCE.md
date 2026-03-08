# SIDORA Authentication System - Quick Reference

## Quick Start (5 minutes)

### 1. Install & Configure
```bash
npm install
cp .env.example .env.local
# Edit .env.local with your database URL and JWT_SECRET
```

### 2. Setup Database
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 3. Start Development
```bash
npm run dev
```

### 4. Test Login
- Go to http://localhost:3000/login
- Use test credentials (from seed):
  - Email: `admin@example.com`
  - Password: `password123`
  - Role: Admin

---

## API Endpoints Quick Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|------------------|
| POST | `/api/auth/login` | Login with email/password | No |
| POST | `/api/auth/logout` | Clear auth session | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

---

## Protected Routes

| Route | Required Role | Description |
|-------|---------------|-------------|
| `/dashboard/admin` | 1 (Admin) | Admin dashboard |
| `/dashboard/operator` | 2 (Operator) | Operator dashboard |
| `/dashboard/user` | 3 (User) | User dashboard |
| `/login` | None | Login page |

---

## React Hooks

### useAuth()
```tsx
const { user, isAuthenticated, isLoading, error } = useAuth();
```

### useRole(allowedRoles)
```tsx
const { hasRole, user, isLoading } = useRole([1, 2]); // Check if user has role 1 or 2
if (hasRole) {
  // Show admin content
}
```

### useLogout()
```tsx
const logout = useLogout();
logout(); // Logout user
```

---

## Component Examples

### Protected Route Wrapper
```tsx
<ProtectedRoute requiredRole={1}>
  <AdminPanel />
</ProtectedRoute>
```

### Role-Based Access
```tsx
<RoleBasedAccess allowedRoles={[1, 2]}>
  <AdminFeature />
</RoleBasedAccess>
```

### User Profile Component
```tsx
<UserProfile />
```

---

## Database Models

```
User (m_users)
├── id (bigint, PK)
├── email (unique)
├── password (hashed with bcrypt)
├── roleId (FK to Role)
├── status
├── lastLogin
└── relations: role, refreshTokens, loginHistory

Role (m_roles)
├── id
├── name (unique)
├── permissions (M2M via RolePermission)

Permission (m_permissions)
├── id
├── name (unique)

RefreshToken (m_refresh_tokens)
├── id
├── userId (FK)
├── token (unique)
├── expiresAt
└── revokedAt

LoginHistory (m_login_history)
├── id
├── userId (FK)
├── ipAddress
├── userAgent
├── status
└── timestamps
```

---

## Security Checklist

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT tokens signed with HS256
- ✅ Tokens in HTTP-only cookies (CSRF safe)
- ✅ Middleware protects routes
- ✅ Environment variables for secrets
- ✅ HTTPS-only cookies in production
- ✅ Login history tracking
- ✅ Role-based access control

---

## Environment Variables

```env
# Required
DATABASE_URL=mysql://user:pass@localhost:3306/db
JWT_SECRET=your-secret-key-min-32-chars

# Optional
JWT_EXPIRY=7d
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migration
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Push schema without migration
npm run db:push

# Open Prisma Studio (GUI)
npm run db:studio
```

---

## File Structure

```
lib/auth/
├── types.ts              # TypeScript types
├── jwt.ts               # Token generation/verification
├── bcrypt.ts            # Password hashing
├── prisma.ts            # Prisma client singleton
├── middleware.ts        # Auth middleware
├── useAuth.ts           # React hooks
├── ProtectedRoute.tsx   # Protected component wrapper
├── UserProfile.tsx      # User profile component
└── index.ts             # Barrel exports

app/api/auth/
├── login/route.ts       # POST /api/auth/login
├── logout/route.ts      # POST /api/auth/logout
└── me/route.ts          # GET /api/auth/me

middleware.ts            # Next.js route middleware

prisma/
├── schema.prisma        # Database schema
└── seed.ts             # Seed script
```

---

## Testing Credentials

After running seed:

```
Admin User:
  Email: admin@example.com
  Password: password123
  Role: Administrator (1)

Operator User:
  Email: operator@example.com
  Password: password123
  Role: Operator (2)

Regular User:
  Email: user@example.com
  Password: password123
  Role: User (3)
```

---

## Common Tasks

### Add New User
```bash
npx prisma studio
# Navigate to m_users > Create new record
# Or use API to create user (you'll need to implement)
```

### Change Password
```bash
# Use Prisma Studio or implement password change endpoint
```

### Check User Login History
```bash
npx prisma studio
# Navigate to m_login_history
```

### Add New Role
```bash
npx prisma studio
# Create new record in m_roles
# Then update role conditions in middleware.ts
```

---

## Troubleshooting

### "Database connection refused"
- Check DATABASE_URL is correct
- Ensure MySQL server is running
- Verify database exists

### "Token verification failed"
- Check JWT_SECRET matches
- Token may be expired (7 days by default)
- Clear browser cookies

### "Route returns 401"
- Check auth token exists in cookies
- Verify token hasn't expired
- Test with `/api/auth/me` endpoint

### Import errors
- Run `npm install` again
- Delete `node_modules/.prisma`
- Run `npm run prisma:generate`

---

## Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [JWT.io](https://jwt.io)
- [bcryptjs Docs](https://github.com/dcodeIO/bcrypt.js)
- [Auth0 Blog](https://auth0.com/blog/)

---

## Support

For issues or questions:
1. Check AUTH_IMPLEMENTATION_GUIDE.md for detailed docs
2. Review database schema in prisma/schema.prisma
3. Check middleware.ts for route protection logic
4. Review API endpoints in app/api/auth/
