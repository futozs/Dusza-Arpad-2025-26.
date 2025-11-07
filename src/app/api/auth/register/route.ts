import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import { SignUpSchema } from "@/schemas/auth.schemas";
import { z } from "zod";

const prisma = new PrismaClient();

/**
 * POST /api/auth/register
 * 
 * Új felhasználó regisztrációja
 * - Zod validáció
 * - Duplikáció ellenőrzés
 * - Bcrypt password hashing
 * - Email verification token generálás (később SMTP-vel)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validálás Zod sémával
    const validatedFields = SignUpSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, username, password } = validatedFields.data;

    // Ellenőrizzük, hogy létezik-e már a user
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Ez az e-mail cím már regisztrálva van" },
        { status: 409 }
      );
    }

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: "Ez a felhasználónév már foglalt" },
        { status: 409 }
      );
    }

    // Jelszó hashelés (bcrypt, 12 rounds)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Email verification token generálás
    // TODO: SMTP implementáció esetén email küldés
    const emailVerificationToken = crypto.randomUUID();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 óra

    // User létrehozása
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: "PLAYER", // Default role
        emailVerified: false, // TODO: true-ra állítani email verification után
        emailVerificationToken,
        emailVerificationExpires,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    console.log(`New user registered: ${user.email}`);

    // TODO: Email küldés a verification tokennel
    // await sendVerificationEmail(user.email, emailVerificationToken);

    return NextResponse.json(
      {
        message: "Sikeres regisztráció! Most már bejelentkezhetsz.",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        // DEV only - később töröld!
        ...(process.env.NODE_ENV === "development" && {
          _dev_verification_token: emailVerificationToken,
        }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Váratlan hiba történt a regisztráció során" },
      { status: 500 }
    );
  }
}
