import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";


const ChangeEmailSchema = z.object({
  newEmail: z.string().email(),
  password: z.string(),
});

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    const body = await request.json();
    const { newEmail, password } = ChangeEmailSchema.parse(body);

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

    // Check if new email is already taken
    const existingEmail = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Ez az email cím már használatban van" },
        { status: 400 }
      );
    }

    // Update email
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        email: newEmail,
        emailVerified: false, // Reset email verification
      },
    });

    return NextResponse.json({ message: "Email cím sikeresen módosítva" });
  } catch (error) {
    console.error("Email change error:", error);
    return NextResponse.json(
      { error: "Hiba történt az email módosítása során" },
      { status: 500 }
    );
  }
}
