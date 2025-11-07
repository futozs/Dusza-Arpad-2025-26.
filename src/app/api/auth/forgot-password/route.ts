import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/mail/send-password-reset";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      // Biztonsági okokból mindig 200-zal válaszolunk
      return NextResponse.json(
        { 
          success: true,
          message: "Ha az email cím létezik, elküldtük a visszaállító linket" 
        },
        { status: 200 }
      );
    }

    // Ellenőrizzük, hogy létezik-e a felhasználó
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Biztonsági okokból mindig sikeres választ adunk,
    // függetlenül attól, hogy létezik-e a felhasználó
    if (!user) {
      return NextResponse.json(
        { 
          success: true,
          message: "Ha az email cím létezik, elküldtük a visszaállító linket" 
        },
        { status: 200 }
      );
    }

    // Generálunk egy biztonságos reset tokent
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 óra

    // Mentjük a tokent az adatbázisba
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Küldjük el az emailt
    try {
      await sendPasswordResetEmail(
        user.email,
        resetToken,
        user.username,
        1 // 1 óra érvényesség
      );
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
      // Még emailküldési hiba esetén is sikeres választ adunk
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Ha az email cím létezik, elküldtük a visszaállító linket" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot password error:", error);
    
    // Még hibák esetén is sikeres választ adunk biztonsági okokból
    return NextResponse.json(
      { 
        success: true,
        message: "Ha az email cím létezik, elküldtük a visszaállító linket" 
      },
      { status: 200 }
    );
  }
}
