import { NextRequest, NextResponse } from 'next/server';
import { prisma, comparePassword, generateToken, AuthUser } from '@/lib/auth';

/**
 * POST /api/auth/login
 * Login endpoint - verify email and password, return JWT token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        roleId: true,
        status: true,
      },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Verify password using bcrypt
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Log login attempt (optional audit trail)
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        status: 'success',
      },
    });

    // Prepare user data for token (convert BigInt id to string for JSON serialization)
    const authUser: AuthUser = {
      id: String(user.id),
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      status: user.status,
    };

    // Generate JWT token
    const token = generateToken(authUser);

    // Determine redirect URL based on role
    const roleRedirects: Record<number, string> = {
      1: '/admin',
      3: '/admin/dashboard-kecamatan',
      4: '/admin/dashboard-lembaga',
      5: '/admin/dashboard-lembaga',
      6: '/admin/dashboard-lembaga',
    };

    const redirectUrl = user.roleId ? roleRedirects[user.roleId] : '/login';

    // Create response with token in HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: authUser,
      token: token,
      redirectUrl,
    });

    // Set HTTP-only cookie with token
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
