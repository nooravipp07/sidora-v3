import { NextRequest, NextResponse } from "next/server";
import { KecamatanService } from "@/services/kecamatan.service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const result = await KecamatanService.getById(id);

    if (!result) {
      return NextResponse.json(
        { error: "Kecamatan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching kecamatan:", error);

    return NextResponse.json(
      { error: "Failed to fetch kecamatan" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const result = await KecamatanService.update(id, body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating kecamatan:", error);

    return NextResponse.json(
      { error: "Failed to update kecamatan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    await KecamatanService.delete(id);

    return NextResponse.json({
      message: "Kecamatan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting kecamatan:", error);

    return NextResponse.json(
      { error: "Failed to delete kecamatan" },
      { status: 500 }
    );
  }
}