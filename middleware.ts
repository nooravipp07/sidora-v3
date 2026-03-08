import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

// Define protected paths
const PROTECTED_PATHS = ['/admin', '/dashboard'];
const PUBLIC_PATHS = ['/login', '/register', '/', '/api/auth/login', '/api/auth/logout'];
const ADMIN_PATHS = ['/admin', '/dashboard/admin'];
const OPERATOR_PATHS = ['/dashboard/operator'];
const USER_PATHS = ['/dashboard/user'];

/**
 * Middleware for route protection and role-based access control
 * Protects /admin/* routes - requires authentication and admin role
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path is public
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
  
  if (isPublicPath && pathname !== '/api/auth/login' && pathname !== '/api/auth/logout') {
    // Public paths allowed without authentication
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value;

  // Check if path is protected (admin or dashboard)
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));

//   if (isProtectedPath) {
//     // If no token and trying to access protected route, redirect to login
//     if (!token) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     // Verify token
//     const decoded = verifyToken(token);

//     if (!decoded) {
//       // Token is invalid or expired, clear cookie and redirect to login
//       const response = NextResponse.redirect(new URL('/login', request.url));
//       response.cookies.set('auth_token', '', { maxAge: 0 });
//       return response;
//     }

//     // // Role-based route protection
//     // // Admin routes - only for admin (roleId = 1)
//     // if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/dashboard-kecamatan') && !pathname.startsWith('/admin/dashboard-lembaga')) {
//     //   if (decoded.roleId !== 1) {
//     //     return NextResponse.redirect(new URL('/login', request.url));
//     //   }
//     // }

//     // // Operator routes - only for operator (roleId = 2)
//     // if (pathname.startsWith('/admin/dashboard-kecamatan')) {
//     //   if (decoded.roleId !== 2) {
//     //     return NextResponse.redirect(new URL('/login', request.url));
//     //   }
//     // }

//     // // User routes - only for user (roleId = 3)
//     // if (pathname.startsWith('/admin/dashboard-lembaga')) {
//     //   if (decoded.roleId !== 3) {
//     //     return NextResponse.redirect(new URL('/login', request.url));
//     //   }
//     // }

//     return NextResponse.next();
//   }

  // If trying to access auth endpoints without token/with invalid token
  if (pathname.startsWith('/api/auth') && pathname !== '/api/auth/login' && pathname !== '/api/auth/logout') {
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
