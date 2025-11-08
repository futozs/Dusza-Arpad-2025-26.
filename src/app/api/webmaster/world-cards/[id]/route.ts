import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CardType } from "@/generated/prisma";

const VALID_CARD_TYPES: CardType[] = ["EARTH", "AIR", "WATER", "FIRE"];

// GET - Egyedi kártya lekérése
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

    const worldCard = await prisma.worldCard.findUnique({
      where: { id },
      include: {
        environment: true,
      },
    });

    if (!worldCard) {
      return NextResponse.json({ error: "Nem található a kártya" }, { status: 404 });
    }

    return NextResponse.json(worldCard);
  } catch (error) {
    console.error("WorldCard GET error:", error);
    return NextResponse.json({ error: "Hiba történt a lekérés során" }, { status: 500 });
  }
}

// PUT - Kártya frissítése
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

    // Ellenőrizzük, hogy létezik-e a kártya
    const existingCard = await prisma.worldCard.findUnique({
      where: { id },
    });

    if (!existingCard) {
      return NextResponse.json({ error: "Nem található a kártya" }, { status: 404 });
    }

    // Ha a név változott, ellenőrizzük hogy nem foglalt-e
    if (name.trim() !== existingCard.name) {
      const nameExists = await prisma.worldCard.findUnique({
        where: { name: name.trim() },
      });

      if (nameExists) {
        return NextResponse.json({ error: "Már létezik ilyen nevű kártya" }, { status: 400 });
      }
    }

    // Kártya frissítése
    const worldCard = await prisma.worldCard.update({
      where: { id },
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

    return NextResponse.json(worldCard);
  } catch (error) {
    console.error("WorldCard PUT error:", error);
    return NextResponse.json({ error: "Hiba történt a frissítés során" }, { status: 500 });
  }
}

// DELETE - Kártya törlése
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "WEBMASTER") {
      return NextResponse.json({ error: "Nincs jogosultság" }, { status: 403 });
    }

    const { id } = await params;

    const existingCard = await prisma.worldCard.findUnique({
      where: { id },
    });

    if (!existingCard) {
      return NextResponse.json({ error: "Nem található a kártya" }, { status: 404 });
    }

    await prisma.worldCard.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kártya sikeresen törölve" });
  } catch (error) {
    console.error("WorldCard DELETE error:", error);
    return NextResponse.json({ error: "Hiba történt a törlés során" }, { status: 500 });
  }
}
