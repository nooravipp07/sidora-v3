# SIDORA Authentication API Documentation

## Base URL
```
http://localhost:3000  (Development)
https://app.example.com (Production)
```

---

## Authentication Endpoints

### 1. POST /api/auth/login

Login with email and password. Returns JWT token in HTTP-only cookie and user information.

**Request:**
```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | User's password (minimum 6 characters) |

**Success Response (200 OK):**
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

**Response Headers:**
```
Set-Cookie: auth_token=eyJhbGc...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "Email dan password harus diisi"
}
```

401 Unauthorized:
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

500 Server Error:
```json
{
  "success": false,
  "message": "Terjadi kesalahan pada server"
}
```

**Possible Error Messages:**
- `Email dan password harus diisi` - Missing fields
- `Format email tidak valid` - Invalid email format
- `Email atau password salah` - Invalid credentials
- `Terjadi kesalahan pada server` - Server error

**Example Usage (JavaScript):**
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123',
  }),
  credentials: 'include', // Include cookies
});

const data = await response.json();
if (data.success) {
  // Redirect to dashboard
  window.location.href = data.redirectUrl;
}
```

**Example Usage (cURL):**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

---

### 2. POST /api/auth/logout

Logout current user by clearing authentication cookie.

**Request:**
```http
POST /api/auth/logout HTTP/1.1
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

**Response Headers:**
```
Set-Cookie: auth_token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Terjadi kesalahan pada server"
}
```

**Example Usage (JavaScript):**
```javascript
const response = await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include',
});

const data = await response.json();
if (data.success) {
  // Redirect to login
  window.location.href = '/login';
}
```

**Example Usage (cURL):**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

---

### 3. GET /api/auth/me

Get current authenticated user information. Requires valid auth token in cookie.

**Request:**
```http
GET /api/auth/me HTTP/1.1
Cookie: auth_token=eyJhbGc...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Administrator",
    "email": "admin@example.com",
    "namaLengkap": "Admin System",
    "noTelepon": "081234567890",
    "roleId": 1,
    "status": 1,
    "lastLogin": "2024-03-08T10:30:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "role": {
      "id": 1,
      "name": "admin",
      "description": "Administrator - Full system access"
    }
  }
}
```

**Error Response: No Token (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Token tidak ditemukan"
}
```

**Error Response: Invalid Token (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Token tidak valid atau sudah expired"
}
```

**Error Response: User Not Found (404 Not Found):**
```json
{
  "success": false,
  "message": "User tidak ditemukan"
}
```

**Error Response: Server Error (500):**
```json
{
  "success": false,
  "message": "Terjadi kesalahan pada server"
}
```

**Example Usage (JavaScript):**
```javascript
const response = await fetch('/api/auth/me', {
  method: 'GET',
  credentials: 'include',
});

if (response.status === 401) {
  // Token invalid or expired, redirect to login
  window.location.href = '/login';
} else if (response.ok) {
  const data = await response.json();
  console.log('Current user:', data.user);
}
```

**Example Usage (cURL):**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

---

## Data Models

### User Response Object
```typescript
{
  id: bigint,                    // User ID
  name: string,                  // User name
  email: string,                 // Email address
  namaLengkap?: string,         // Full name (optional)
  noTelepon?: string,           // Phone number (optional)
  roleId: number | null,        // Role ID (1=admin, 2=operator, 3=user)
  status: number | null,        // User status (0=inactive, 1=active)
  lastLogin?: Date,             // Last login timestamp
  createdAt?: Date,             // Account creation date
  role?: {
    id: number,
    name: string,
    description: string
  }
}
```

### Login Request Object
```typescript
{
  email: string,      // Email address (required)
  password: string    // Password (required, minimum 6 characters)
}
```

### Standard Response Object
```typescript
{
  success: boolean,   // Operation success status
  message: string,    // Human-readable message
  user?: User,        // User object (on success)
  redirectUrl?: string // Redirect URL after login
}
```

---

## Authentication Flow

### 1. Login Flow
```
┌─────────┐
│ Client  │
└────┬────┘
     │ 1. POST /api/auth/login
     │    {email, password}
     ↓
┌──────────┐
│ Server   │
├──────────┤
│ 1. Validate input
│ 2. Find user by email
│ 3. Verify password (bcrypt)
│ 4. Generate JWT token
│ 5. Update last_login
│ 6. Log login attempt
│ 7. Set cookie
└────┬─────┘
     │ 2. Response + Cookie
     │    (auth_token=...)
     ↓
┌─────────┐
│ Client  │
├─────────┤
│ Store token in HTTP-only cookie
│ Redirect to dashboard
└─────────┘
```

### 2. Protected Route Access Flow
```
┌─────────┐
│ Client  │
└────┬────┘
     │ 1. GET /dashboard/admin
     │    (with auth_token cookie)
     ↓
┌──────────────┐
│ Middleware   │
├──────────────┤
│ 1. Extract token from cookie
│ 2. Verify JWT signature
│ 3. Check token expiration
│ 4. Verify user role
└────┬─────────┘
     │ 2. Allow/Deny
     ↓
┌─────────┐
│ Client  │
├─────────┤
│ If authorized: Show page
│ If not authorized: Redirect to login
└─────────┘
```

### 3. Token Validation Flow
```
┌──────────────┐
│ JWT Token    │
└──────┬───────┘
       │ Contains:
       │ - userId
       │ - email
       │ - roleId
       │ - status
       │ - iat (issued at)
       │ - exp (expiration)
       ↓
┌────────────────┐
│ Verification   │
├────────────────┤
│ 1. Decode with JWT_SECRET
│ 2. Verify signature
│ 3. Check expiration (exp > now)
│ 4. Validate user exists
└────┬───────────┘
     │ Valid/Invalid
     ↓
┌──────────┐
│ Response │
└──────────┘
```

---

## Role-Based Redirects

After successful login, users are redirected based on their role:

| Role ID | Role Name | Redirect URL | Permissions |
|---------|-----------|--------------|-------------|
| 1 | Admin | `/dashboard/admin` | Full access |
| 2 | Operator | `/dashboard/operator` | Data entry/management |
| 3 | User | `/dashboard/user` | View only |

---

## Security Features

### Password Security
- Hashed with bcryptjs (10 salt rounds)
- Never transmitted in plain text
- Minimum 6 characters required
- Database stores hash only

### Token Security
- Algorithm: HS256 (HMAC SHA-256)
- Expiry: 7 days (configurable)
- Signed with JWT_SECRET
- Stored in HTTP-only cookie
- CSRF safe (SameSite=Lax)
- Secure flag set in production

### Request Validation
- Email format validation
- Password length validation
- Input sanitization
- SQL injection prevention
- XSS prevention

### Rate Limiting
- Implement on login endpoint
- Max attempts: 5 per minute (recommended)
- Lock account after 10 failed attempts
- Log failed attempts

---

## HTTP Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| 200 | OK | Successful login/logout, get current user |
| 400 | Bad Request | Missing or invalid parameters |
| 401 | Unauthorized | Invalid credentials, no token, expired token |
| 403 | Forbidden | Insufficient permissions/role |
| 404 | Not Found | User not found |
| 500 | Server Error | Database error, server error |

---

## Cookie Details

### auth_token Cookie

```
Name: auth_token
Value: <JWT_TOKEN>
HttpOnly: true (not accessible via JavaScript)
Secure: true (HTTPS only in production)
SameSite: Lax (CSRF protection)
Max-Age: 604800 (7 days)
Path: /
Domain: automatic (current domain)
```

---

## Rate Limiting Recommendations

```javascript
// Recommended limits for production
const loginRateLimit = {
  windowMs: 60 * 1000,        // 1 minute
  maxRequests: 5,              // 5 attempts
  lockoutMs: 15 * 60 * 1000   // 15 minute lockout
};
```

---

## Testing with Postman

### Environment Setup
```
{
  "base_url": "http://localhost:3000",
  "token": ""
}
```

### 1. Login Request
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

Test script:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

### 2. Get Current User
```
GET {{base_url}}/api/auth/me
Cookie: auth_token={{token}}
```

### 3. Logout Request
```
POST {{base_url}}/api/auth/logout
Cookie: auth_token={{token}}
```

---

## Troubleshooting

### "Token not found" Error
- Verify cookies are enabled
- Check `credentials: 'include'` in fetch
- Verify cookie was set in previous response

### "Token invalid or expired"
- Token may have expired (7 days)
- JWT_SECRET may have changed
- Request coming from different domain

### "Email or password is wrong"
- Case-sensitive email check
- Verify password is correct
- Check user exists in database

### CORS Errors
- Make sure API call is to same domain
- Or configure CORS headers
- Check `NEXT_PUBLIC_API_URL`

---

## Integration Examples

### React Hook (useAuth)
```typescript
import { useAuth } from '@/lib/auth/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not logged in</div>;
  
  return <div>Welcome, {user?.name}</div>;
}
```

### Fetch with Auth
```typescript
const response = await fetch('/api/auth/me', {
  method: 'GET',
  credentials: 'include', // Include cookies
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Protected Component
```typescript
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';

function App() {
  return (
    <ProtectedRoute requiredRole={1}>
      <AdminPanel />
    </ProtectedRoute>
  );
}
```

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2024-03-08 | 1.0.0 | Initial implementation |

---

## Support

For issues or questions:
1. Check error messages carefully
2. Review database records
3. Check browser cookies
4. Enable debug logging
5. Review authentication logs
