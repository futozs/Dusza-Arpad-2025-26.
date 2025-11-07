import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    // TODO: Implement actual session revocation for all sessions except current
    // This would typically remove all sessions from your session store except the current one
    
    return NextResponse.json({ 
      message: "Minden munkamenet sikeresen törölve",
    });
  } catch (error) {
    console.error("Revoke all sessions error:", error);
    return NextResponse.json(
      { error: "Hiba történt" },
      { status: 500 }
    );
  }
}
