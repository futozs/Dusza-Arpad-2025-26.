import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token kötelező" },
        { status: 400 }
      );
    }

    // Token keresése az adatbázisban
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Érvénytelen vagy lejárt token" },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy a token nem járt-e le
    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return NextResponse.json(
        { error: "A megerősítő link lejárt. Kérj újat!" },
        { status: 400 }
      );
    }

    // Ha már megerősített
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Az email cím már korábban megerősítésre került" },
        { status: 200 }
      );
    }

    // Email megerősítése
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return NextResponse.json({
      message: "Email cím sikeresen megerősítve",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Hiba történt az email megerősítése során" },
      { status: 500 }
    );
  }
}
