import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { valid: false, error: "Token hiányzik" },
        { status: 400 }
      );
    }

    // Keressük meg a felhasználót a tokennel
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(), // Token még nem járt le
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { valid: false, error: "A token érvénytelen vagy lejárt" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { valid: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("Validate reset token error:", error);
    return NextResponse.json(
      { valid: false, error: "Hiba történt a token ellenőrzése során" },
      { status: 500 }
    );
  }
}
