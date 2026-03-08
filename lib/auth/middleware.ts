import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

/**
 * Verify authentication from request
 * Extract and validate JWT token from cookies
 */
export function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return { isValid: false, user: null, error: 'No token provided' };
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return { isValid: false, user: null, error: 'Invalid or expired token' };
    }

    return {
      isValid: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        roleId: decoded.roleId,
        status: decoded.status,
      },
      error: null,
    };
  } catch (error) {
    return { isValid: false, user: null, error: 'Authentication failed' };
  }
}

/**
 * Middleware wrapper for protecting API routes
 */
export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const auth = verifyAuth(request);

    if (!auth.isValid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Attach user to request (Next.js doesn't support this directly for route handlers,
    // so you'll need to call verifyAuth() in your route handlers)
    return handler(request);
  };
}

/**
 * Middleware to require specific role
 */
export function withRole(allowedRoles: number[]) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (request: NextRequest) => {
      const auth = verifyAuth(request);

      if (!auth.isValid) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        );
      }

      if (allowedRoles.length > 0 && auth.user && !allowedRoles.includes(auth.user.roleId || 0)) {
        return NextResponse.json(
          { success: false, message: 'Forbidden - insufficient permissions' },
          { status: 403 }
        );
      }

      return handler(request);
    };
  };
}
