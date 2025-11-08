import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Prisma client imported from singleton

const DeleteAccountSchema = z.object({
  password: z.string(),
});

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    const body = await request.json();
    const { password } = DeleteAccountSchema.parse(body);

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Felhasználó nem található" }, { status: 404 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: "Helytelen jelszó" }, { status: 400 });
    }

    // Delete all user related data
    // Delete backup codes first
    await prisma.backupCode.deleteMany({
      where: { userId: user.id },
    });

    // Delete the user
    await prisma.user.delete({
      where: { email: session.user.email },
    });

    return NextResponse.json({ 
      message: "Fiók sikeresen törölve",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Hiba történt a fiók törlése során" },
      { status: 500 }
    );
  }
}
