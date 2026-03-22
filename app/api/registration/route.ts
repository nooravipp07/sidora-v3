import { NextRequest, NextResponse } from "next/server";
import { RegistrationService } from "@/services/registration.service";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const registration = await RegistrationService.register(formData);
        return NextResponse.json({ success: true, data: registration });
    } catch (error: any) {
        console.error('Error creating athlete:', error);
        return NextResponse.json({ error: error.message || 'Registrasi Gagal' }, { status: 500 });
    }
}