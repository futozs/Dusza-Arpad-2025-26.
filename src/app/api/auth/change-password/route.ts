
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }


    const body = await request.json();
    const ChangePasswordSchema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8)
    });
    const parsed = ChangePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Érvénytelen adatok", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const { currentPassword, newPassword } = parsed.data;

    // Felhasználó lekérése
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Felhasználó nem található" }, { status: 404 });
    }

    // Jelenlegi jelszó ellenőrzése
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Helytelen jelenlegi jelszó" }, { status: 401 });
    }

    // Új jelszó hashelése
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Jelszó frissítése
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Jelszó sikeresen megváltozott" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
