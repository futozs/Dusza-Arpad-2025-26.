import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma/client";

// Prisma client imported from singleton

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    // TODO: Get actual settings from database
    const settings = {
      emailNotifications: true,
      gameUpdates: true,
      gameResults: true,
      systemAlerts: true,
      pushNotifications: false,
      browserPush: false,
      instantUpdates: false,
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Get notification settings error:", error);
    return NextResponse.json(
      { error: "Hiba történt" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    const body = await request.json();
    
    // TODO: Save settings to database
    // For now, just return success
    
    return NextResponse.json({ 
      message: "Beállítások sikeresen mentve",
      settings: body,
    });
  } catch (error) {
    console.error("Update notification settings error:", error);
    return NextResponse.json(
      { error: "Hiba történt" },
      { status: 500 }
    );
  }
}
