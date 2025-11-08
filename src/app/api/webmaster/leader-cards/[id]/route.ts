import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LeaderBoostType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const VALID_BOOST_TYPES: LeaderBoostType[] = ["DAMAGE_DOUBLE", "HEALTH_DOUBLE"];

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

    const leaderCard = await prisma.leaderCard.findUnique({
      where: { id },
      include: {
        baseCard: true,
        environment: true,
      },
    });

    if (!leaderCard) {
      return NextResponse.json({ error: "Vezérkártya nem található" }, { status: 404 });
    }

    return NextResponse.json(leaderCard);
  } catch (error) {
    console.error("LeaderCard GET error:", error);
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

    // Ellenőrizzük, hogy létezik-e már ilyen nevű vezérkártya (kivéve a jelenlegit)
    const existing = await prisma.leaderCard.findFirst({
      where: {
        name: name.trim(),
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Már létezik ilyen nevű vezérkártya" }, { status: 400 });
    }

    // Vezérkártya frissítése
    const leaderCard = await prisma.leaderCard.update({
      where: { id },
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

    return NextResponse.json(leaderCard);
  } catch (error) {
    console.error("LeaderCard PUT error:", error);
    return NextResponse.json({ error: "Hiba történt a frissítés során" }, { status: 500 });
  }
}
