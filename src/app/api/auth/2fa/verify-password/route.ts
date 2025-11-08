import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/2fa/verify-password
 * 
 * Jelszó ellenőrzés a 2FA beállítása előtt
 * Extra biztonsági réteg
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - bejelentkezés szükséges" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Jelszó megadása kötelező" },
        { status: 400 }
      );
    }

    // Felhasználó lekérése
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Felhasználó nem található" },
        { status: 404 }
      );
    }

    // Jelszó ellenőrzés
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Helytelen jelszó" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Jelszó sikeresen ellenőrizve",
    });
  } catch (error) {
    console.error("Password verification error:", error);
    return NextResponse.json(
      { error: "Hiba történt a jelszó ellenőrzése során" },
      { status: 500 }
    );
  }
}
