import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/environments/[environmentId] - Környezet lekérése
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ environmentId: string }> }
) {
  try {
    const { environmentId } = await params;

    const environment = await prisma.environment.findUnique({
      where: { id: environmentId },
      include: {
        worldCards: {
          orderBy: { order: "asc" },
        },
        leaderCards: {
          include: {
            baseCard: true,
          },
        },
        dungeons: {
          include: {
            dungeonCards: {
              include: {
                worldCard: true,
                leaderCard: {
                  include: {
                    baseCard: true,
                  },
                },
              },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!environment) {
      return NextResponse.json(
        { error: "Környezet nem található" },
        { status: 404 }
      );
    }

    return NextResponse.json(environment);
  } catch (error) {
    console.error("Environment GET error:", error);
    return NextResponse.json({ error: "Hiba történt" }, { status: 500 });
  }
}
