import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    const { id: sessionId } = await params;

    // TODO: Implement actual session revocation
    // This would typically remove the session from your session store
    
    return NextResponse.json({ 
      message: "Munkamenet sikeresen törölve",
      sessionId,
    });
  } catch (error) {
    console.error("Revoke session error:", error);
    return NextResponse.json(
      { error: "Hiba történt" },
      { status: 500 }
    );
  }
}
