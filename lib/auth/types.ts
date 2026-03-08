import { JwtPayload } from 'jsonwebtoken';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roleId: number | null;
  status: number | null;
}

export interface AuthToken extends JwtPayload {
  userId: string; // String representation of BigInt
  email: string;
  roleId: number | null;
  status: number | null;
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  token?: string;
  redirectUrl?: string;
}

export interface AuthContext {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface MiddlewareCheckResult {
  isValid: boolean;
  user?: AuthUser;
  error?: string;
}

// Role constants
export const ROLES = {
  ADMIN: 1,
  OPERATOR: 2,
  USER: 3,
} as const;

// Role redirect mapping
export const ROLE_REDIRECTS: Record<number, string> = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.OPERATOR]: '/admin/dashboard-kecamatan',
  [ROLES.USER]: '/admin/dashboard-lembaga',
};

// Protected routes that require authentication
export const PROTECTED_ROUTES = ['/admin'];
export const PUBLIC_ROUTES = ['/login', '/register', '/'];
