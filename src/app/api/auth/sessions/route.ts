import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    // TODO: Get actual sessions from database/session store
    // For now, return mock data
    const sessions = [
      {
        id: "1",
        device: "MacBook Pro - Chrome",
        location: "Budapest, Magyarország",
        lastActive: "Jelenleg aktív",
        current: true,
      },
    ];

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Get sessions error:", error);
    return NextResponse.json(
      { error: "Hiba történt" },
      { status: 500 }
    );
  }
}
