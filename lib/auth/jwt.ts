import jwt, { Secret } from 'jsonwebtoken';
import { AuthToken, AuthUser } from './types';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'default-secret-change-me';
const JWT_EXPIRY: string = process.env.JWT_EXPIRY || '7d';

/**
 * Generate JWT token
 */
export function generateToken(user: AuthUser): string {
  const payload = {
    userId: String(user.id), // Convert BigInt to string for JWT serialization
    email: user.email,
    roleId: user.roleId,
    status: user.status,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256',
  } as any);
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });

    return decoded as AuthToken;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Decode token without verification (use with caution)
 */
export function decodeToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.decode(token);
    return decoded as AuthToken;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as AuthToken | null;
    if (!decoded || !decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
}

/**
 * Get token expiry time
 */
export function getTokenExpiryTime(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as AuthToken | null;
    return decoded?.exp || null;
  } catch {
    return null;
  }
}
