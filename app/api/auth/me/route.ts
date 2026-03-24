import { NextRequest, NextResponse } from 'next/server';
import { prisma, verifyToken } from '@/lib/auth';

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token tidak ditemukan' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid atau sudah expired' },
        { status: 401 }
      );
    }

    // Get full user data from database
    const userId = Number(decoded.userId);
    console.log('🔍 [auth/me] Fetching user id:', userId);
    
    // Fetch user with relations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // Manually construct response object to ensure all fields included
    const responseData = {
      id: user.id,
      name: user.name,
      email: user.email,
      namaLengkap: user.namaLengkap,
      noTelepon: user.noTelepon,
      roleId: user.roleId,
      kecamatanId: user.kecamatanId,
      desaKelurahanId: user.desaKelurahanId,
      status: user.status,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      role: user.role ? {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description,
      } : null,
    };

    console.log('📊 [auth/me] Response kecamatanId:', responseData.kecamatanId);

    const jsonResponse = {
      success: true,
      user: responseData,
    };
    
    console.log('✅ [auth/me] Final JSON response:', JSON.stringify(jsonResponse, null, 2));

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
