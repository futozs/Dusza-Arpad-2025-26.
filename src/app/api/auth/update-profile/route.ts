import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateProfileSchema } from "@/schemas/auth.schemas";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    const body = await request.json();
    
   
    
    const validationResult = UpdateProfileSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join(", ");
      return NextResponse.json(
        { error: `Validációs hiba: ${errors}` },
        { status: 400 }
      );
    }

    const { username, email } = validationResult.data;

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: username,
        NOT: { email: session.user.email },
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Ez a felhasználónév már foglalt" },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email,
        NOT: { email: session.user.email },
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Ez az email cím már használatban van" },
        { status: 400 }
      );
    }

 
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username: username, // Zod-val már validálva
        email: email,       // Zod-val már validálva
        emailVerified: email !== session.user.email ? false : undefined,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "Profil sikeresen frissítve",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    
    // Prisma-specifikus hibakezelés
    if (error instanceof Error) {
      if (error.message.includes("P2000")) {
        return NextResponse.json(
          { error: "A felhasználónév túl hosszú (max 20 karakter). Módosítsd a Prisma sémát!" },
          { status: 400 }
        );
      }
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "Ez az adat már foglalt" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Hiba történt a profil frissítése során" },
      { status: 500 }
    );
  }
}
