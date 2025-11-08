import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma/client";
import { z } from "zod";

// Prisma client imported from singleton

const UpdateProfileSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
});

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    const body = await request.json();
    const { username, email } = UpdateProfileSchema.parse(body);

    // Check if username is already taken by another user
    const existingUsername = await prisma.user.findFirst({
      where: {
        username,
        NOT: { email: session.user.email },
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Ez a felhasználónév már foglalt" },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: { email: session.user.email },
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Ez az email cím már használatban van" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username,
        email,
        emailVerified: email !== session.user.email ? false : undefined,
      },
    });

    return NextResponse.json({
      message: "Profil sikeresen frissítve",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Hiba történt a profil frissítése során" },
      { status: 500 }
    );
  }
}
