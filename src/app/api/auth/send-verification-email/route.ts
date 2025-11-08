import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/mail/send-verification";
import crypto from "crypto";


export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    // Felhasználó lekérdezése
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Felhasználó nem található" }, { status: 404 });
    }

    // Ha már megerősített
    if (user.emailVerified) {
      return NextResponse.json({ 
        error: "Az email cím már megerősítésre került" 
      }, { status: 400 });
    }

    // Új token generálása
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresInHours = 24; // 24 óra múlva jár le
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    // Token mentése az adatbázisba
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: expiresAt,
      },
    });

    // Email küldése
    await sendVerificationEmail(
      user.email,
      verificationToken,
      user.username,
      expiresInHours
    );

    return NextResponse.json({ 
      message: "Megerősítő email elküldve",
      email: user.email,
    });
  } catch (error) {
    console.error("Send verification email error:", error);
    return NextResponse.json(
      { error: "Hiba történt az email küldése során" },
      { status: 500 }
    );
  }
}
