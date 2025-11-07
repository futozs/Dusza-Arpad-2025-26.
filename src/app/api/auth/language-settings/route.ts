import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    const body = await request.json();
    const { language } = body;
    
    // TODO: Save language preference to database
    // For now, just return success
    
    return NextResponse.json({ 
      message: "Nyelv sikeresen mentve",
      language,
    });
  } catch (error) {
    console.error("Update language settings error:", error);
    return NextResponse.json(
      { error: "Hiba történt" },
      { status: 500 }
    );
  }
}
