import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient, CardType } from "@/generated/prisma";

const prisma = new PrismaClient();

const VALID_CARD_TYPES: CardType[] = ["EARTH", "AIR", "WATER", "FIRE"];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "WEBMASTER") {
      return NextResponse.json({ error: "Nincs jogosultság" }, { status: 403 });
    }

    const worldCards = await prisma.worldCard.findMany({
      include: {
        environment: true,
      },
      orderBy: [
        { environmentId: "asc" },
        { order: "asc" },
      ],
    });

    return NextResponse.json(worldCards);
  } catch (error) {
    console.error("WorldCard GET error:", error);
    return NextResponse.json({ error: "Hiba történt a lekérés során" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "WEBMASTER") {
      return NextResponse.json({ error: "Nincs jogosultság" }, { status: 403 });
    }

    const body = await request.json();
    const { name, damage, health, type, order, environmentId } = body;

    // Validálás
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "A név megadása kötelező" }, { status: 400 });
    }

    if (name.length > 16) {
      return NextResponse.json({ error: "A név maximum 16 karakter lehet" }, { status: 400 });
    }

    if (typeof damage !== "number" || damage < 2 || damage > 100) {
      return NextResponse.json({ error: "Sebzés érték 2 és 100 között kell legyen" }, { status: 400 });
    }

    if (typeof health !== "number" || health < 1 || health > 100) {
      return NextResponse.json({ error: "Életerő 1 és 100 között kell legyen" }, { status: 400 });
    }

    if (!VALID_CARD_TYPES.includes(type)) {
      return NextResponse.json({ error: "Érvénytelen kártya típus" }, { status: 400 });
    }

    if (typeof order !== "number" || order < 1) {
      return NextResponse.json({ error: "Sorrend legalább 1 kell legyen" }, { status: 400 });
    }

    if (!environmentId) {
      return NextResponse.json({ error: "Környezet kiválasztása kötelező" }, { status: 400 });
    }

    // Ellenőrizzük, hogy létezik-e a környezet
    const environment = await prisma.environment.findUnique({
      where: { id: environmentId },
    });

    if (!environment) {
      return NextResponse.json({ error: "A kiválasztott környezet nem létezik" }, { status: 400 });
    }

    // Ellenőrizzük, hogy létezik-e már ilyen nevű kártya
    const existing = await prisma.worldCard.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      return NextResponse.json({ error: "Már létezik ilyen nevű kártya" }, { status: 400 });
    }

    // Kártya létrehozása
    const worldCard = await prisma.worldCard.create({
      data: {
        name: name.trim(),
        damage,
        health,
        type,
        order,
        environmentId,
      },
      include: {
        environment: true,
      },
    });

    return NextResponse.json(worldCard, { status: 201 });
  } catch (error) {
    console.error("WorldCard POST error:", error);
    return NextResponse.json({ error: "Hiba történt a létrehozás során" }, { status: 500 });
  }
}
