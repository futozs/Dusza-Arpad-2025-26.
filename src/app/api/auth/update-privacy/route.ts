import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma";
import { z } from "zod";

const prisma = new PrismaClient();

const UpdatePrivacySchema = z.object({
  profileVisibility: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Nem vagy bejelentkezve" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = UpdatePrivacySchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Érvénytelen adatok" },
        { status: 400 }
      );
    }

    const { profileVisibility } = validatedData.data;

    // Frissítjük a felhasználó adatvédelmi beállításait
    await prisma.user.update({
      where: { id: session.user.id },
      data: { profileVisibility },
    });

    return NextResponse.json({
      success: true,
      message: "Adatvédelmi beállítások sikeresen mentve",
      profileVisibility,
    });
  } catch (error) {
    console.error("Error updating privacy settings:", error);
    return NextResponse.json(
      { error: "Hiba történt az adatvédelmi beállítások mentése során" },
      { status: 500 }
    );
  }
}
