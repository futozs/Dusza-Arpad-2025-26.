import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token hiányzik" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Jelszó hiányzik" },
        { status: 400 }
      );
    }

    // Jelszó validáció
    if (password.length < 8) {
      return NextResponse.json(
        { error: "A jelszónak legalább 8 karakter hosszúnak kell lennie" },
        { status: 400 }
      );
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { error: "A jelszónak tartalmaznia kell kis- és nagybetűt, valamint számot" },
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
        { error: "A token érvénytelen vagy lejárt" },
        { status: 400 }
      );
    }

    // Hasheljük az új jelszót
    const hashedPassword = await bcrypt.hash(password, 10);

    // Frissítsük a jelszót és töröljük a reset tokent
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return NextResponse.json(
      { success: true, message: "A jelszó sikeresen megváltozott" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Hiba történt a jelszó visszaállítása során" },
      { status: 500 }
    );
  }
}
