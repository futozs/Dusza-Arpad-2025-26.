import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "WEBMASTER") {
      return NextResponse.json({ error: "Nincs jogosultság" }, { status: 403 });
    }

    const { id } = await params;

    const environment = await prisma.environment.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            worldCards: true,
            leaderCards: true,
            dungeons: true,
            games: true,
          },
        },
      },
    });

    if (!environment) {
      return NextResponse.json({ error: "Környezet nem található" }, { status: 404 });
    }

    return NextResponse.json(environment);
  } catch (error) {
    console.error("Environment GET error:", error);
    return NextResponse.json({ error: "Hiba történt a lekérés során" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "WEBMASTER") {
      return NextResponse.json({ error: "Nincs jogosultság" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description } = body;

    // Validálás
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "A név megadása kötelező" }, { status: 400 });
    }

    if (name.length > 50) {
      return NextResponse.json({ error: "A név maximum 50 karakter lehet" }, { status: 400 });
    }

    // Ellenőrizzük, hogy létezik-e már ilyen nevű környezet (kivéve a jelenlegit)
    const existing = await prisma.environment.findFirst({
      where: {
        name: name.trim(),
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Már létezik ilyen nevű környezet" }, { status: 400 });
    }

    // Környezet frissítése
    const environment = await prisma.environment.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
      include: {
        _count: {
          select: {
            worldCards: true,
            leaderCards: true,
            dungeons: true,
            games: true,
          },
        },
      },
    });

    return NextResponse.json(environment);
  } catch (error) {
    console.error("Environment PUT error:", error);
    return NextResponse.json({ error: "Hiba történt a frissítés során" }, { status: 500 });
  }
}
