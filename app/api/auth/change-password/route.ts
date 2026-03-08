import { NextRequest, NextResponse } from 'next/server';
import { prisma, comparePassword, hashPassword } from '@/lib/auth';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * POST /api/auth/change-password
 * Endpoint to change user password
 */
export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth_token')?.value;

    // Verify token
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { oldPassword, newPassword, confirmPassword } = body;

    // Validate input
    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Password lama, password baru, dan konfirmasi password harus diisi' },
        { status: 400 }
      );
    }

    // Validate password requirements
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password baru minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Password baru dan konfirmasi password tidak cocok' },
        { status: 400 }
      );
    }

    // Check if old password is same as new password
    if (oldPassword === newPassword) {
      return NextResponse.json(
        { success: false, message: 'Password baru tidak boleh sama dengan password lama' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.userId) },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // Verify old password
    const isOldPasswordValid = await comparePassword(oldPassword, user.password);

    if (!isOldPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Password lama tidak sesuai' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    // Log password change (optional audit trail)
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // You can add a login history entry to track password changes
    // await prisma.loginHistory.create({
    //   data: {
    //     userId: user.id,
    //     ipAddress,
    //     userAgent: request.headers.get('user-agent') || 'unknown',
    //     status: 'password_changed',
    //   },
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'Password berhasil diubah',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
