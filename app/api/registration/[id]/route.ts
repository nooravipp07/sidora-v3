import { NextRequest, NextResponse } from "next/server";
import { RegistrationService } from "@/services/registration.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const registration = await RegistrationService.getById(id);

    if (!registration) {
      return NextResponse.json(
        { error: "Registrasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(registration);
  } catch (error: any) {
    console.error("Error fetching registration:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data registrasi" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    const body = await req.json();
    const { action, rejectReason, verifiedBy } = body;

    if (!action || !verifiedBy) {
      return NextResponse.json(
        { error: "Action dan verifiedBy diperlukan" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Approve dan buat user baru
      const result = await RegistrationService.approveAndCreateUser(id, verifiedBy);
      return NextResponse.json({
        success: true,
        message: "Registrasi disetujui dan akun baru telah dibuat",
        data: result,
      });
    } else if (action === "reject") {
      // Hanya reject tanpa buat user
      if (!rejectReason) {
        return NextResponse.json(
          { error: "Alasan penolakan diperlukan" },
          { status: 400 }
        );
      }
      const result = await RegistrationService.reject(id, verifiedBy, rejectReason);
      return NextResponse.json({
        success: true,
        message: "Registrasi ditolak",
        data: result,
      });
    } else {
      return NextResponse.json(
        { error: "Action tidak valid" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      { error: error.message || "Gagal memproses registrasi" },
      { status: 500 }
    );
  }
}
