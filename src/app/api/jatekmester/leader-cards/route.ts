import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LeaderBoostType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const VALID_BOOST_TYPES: LeaderBoostType[] = ["DAMAGE_DOUBLE", "HEALTH_DOUBLE"];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "JATEKMESTER") {
      return NextResponse.json({ error: "Nincs jogosultság" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const environmentId = searchParams.get("environmentId");

    const leaderCards = await prisma.leaderCard.findMany({
      where: environmentId ? { environmentId } : undefined,
      include: {
        baseCard: true,
        environment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leaderCards);
  } catch (error) {
    console.error("LeaderCard GET error:", error);
    return NextResponse.json({ error: "Hiba történt a lekérés során" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "JATEKMESTER") {
      return NextResponse.json({ error: "Nincs jogosultság" }, { status: 403 });
    }

    const body = await request.json();
    const { name, baseCardId, boostType, environmentId } = body;

    // Validálás
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "A név megadása kötelező" }, { status: 400 });
    }

    if (name.length > 20) {
      return NextResponse.json({ error: "A név maximum 20 karakter lehet" }, { status: 400 });
    }

    if (!baseCardId) {
      return NextResponse.json({ error: "Alapkártya kiválasztása kötelező" }, { status: 400 });
    }

    if (!VALID_BOOST_TYPES.includes(boostType)) {
      return NextResponse.json({ error: "Érvénytelen erősítés típus" }, { status: 400 });
    }

    if (!environmentId) {
      return NextResponse.json({ error: "Környezet kiválasztása kötelező" }, { status: 400 });
    }

    // Ellenőrizzük, hogy létezik-e az alapkártya
    const baseCard = await prisma.worldCard.findUnique({
      where: { id: baseCardId },
    });

    if (!baseCard) {
      return NextResponse.json({ error: "A kiválasztott alapkártya nem létezik" }, { status: 400 });
    }

    // Ellenőrizzük, hogy létezik-e a környezet
    const environment = await prisma.environment.findUnique({
      where: { id: environmentId },
    });

    if (!environment) {
      return NextResponse.json({ error: "A kiválasztott környezet nem létezik" }, { status: 400 });
    }

    // Ellenőrizzük, hogy létezik-e már ilyen nevű vezérkártya
    const existing = await prisma.leaderCard.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      return NextResponse.json({ error: "Már létezik ilyen nevű vezérkártya" }, { status: 400 });
    }

    // Vezérkártya létrehozása
    const leaderCard = await prisma.leaderCard.create({
      data: {
        name: name.trim(),
        boostType,
        baseCardId,
        environmentId,
      },
      include: {
        baseCard: true,
        environment: true,
      },
    });

    return NextResponse.json(leaderCard, { status: 201 });
  } catch (error) {
    console.error("LeaderCard POST error:", error);
    return NextResponse.json({ error: "Hiba történt a létrehozás során" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "JATEKMESTER") {
      return NextResponse.json({ error: "Nincs jogosultság" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Hiányzó vezérkártya ID" }, { status: 400 });
    }

    await prisma.leaderCard.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Vezérkártya sikeresen törölve" });
  } catch (error) {
    console.error("LeaderCard DELETE error:", error);
    return NextResponse.json({ error: "Hiba történt a törlés során" }, { status: 500 });
  }
}
