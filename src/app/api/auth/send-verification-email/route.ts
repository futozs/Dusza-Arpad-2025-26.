import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    // TODO: Implement email verification logic
    // This would typically:
    // 1. Generate a verification token
    // 2. Store it in the database
    // 3. Send an email with a verification link
    
    // For now, just return success
    return NextResponse.json({ 
      message: "Megerősítő email elküldve",
      email: session.user.email,
    });
  } catch (error) {
    console.error("Send verification email error:", error);
    return NextResponse.json(
      { error: "Hiba történt az email küldése során" },
      { status: 500 }
    );
  }
}
