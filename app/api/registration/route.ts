import { NextRequest, NextResponse } from "next/server";
import { RegistrationService } from "@/services/registration.service";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const status = searchParams.get('status') ? parseInt(searchParams.get('status')!, 10) : undefined;
        const search = searchParams.get('search') || undefined;

        const result = await RegistrationService.getAll(
            { status, search },
            { page, limit }
        );

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error fetching registrations:', error);
        return NextResponse.json(
            { error: error.message || 'Gagal mengambil data registrasi' },
            { status: 500 }
        );
    }
}

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