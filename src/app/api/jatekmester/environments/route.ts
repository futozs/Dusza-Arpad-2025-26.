import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


// GET - Lista összes környezetről
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "JATEKMESTER") {
      return NextResponse.json(
        { error: "Nincs jogosultság" },
        { status: 403 }
      );
    }

    const environments = await prisma.environment.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(environments);
  } catch (error) {
    console.error("Environment GET error:", error);
    return NextResponse.json(
      { error: "Hiba történt a lekérés során" },
      { status: 500 }
    );
  }
}

// POST - Új környezet létrehozása
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "JATEKMESTER") {
      return NextResponse.json(
        { error: "Nincs jogosultság" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    // Validálás
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "A név megadása kötelező" },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: "A név maximum 50 karakter lehet" },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy létezik-e már ilyen nevű környezet
    const existing = await prisma.environment.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Már létezik ilyen nevű környezet" },
        { status: 400 }
      );
    }

    // Környezet létrehozása
    const environment = await prisma.environment.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(environment, { status: 201 });
  } catch (error) {
    console.error("Environment POST error:", error);
    return NextResponse.json(
      { error: "Hiba történt a létrehozás során" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "JATEKMESTER") {
      return NextResponse.json(
        { error: "Nincs jogosultság" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Hiányzó környezet ID" },
        { status: 400 }
      );
    }

    await prisma.environment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Környezet sikeresen törölve" });
  } catch (error) {
    console.error("Environment DELETE error:", error);
    return NextResponse.json(
      { error: "Hiba történt a törlés során" },
      { status: 500 }
    );
  }
}
