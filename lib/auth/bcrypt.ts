import bcryptjs from 'bcryptjs';

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcryptjs.hash(password, saltRounds);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Check if string is valid bcrypt hash
 */
export function isValidBcryptHash(hash: string): boolean {
  // Bcrypt hash format: $2a$|$2b$|$2x$|$2y$10$....
  return /^\$2[aby]\$\d{2}\$.{53}$/.test(hash);
}
