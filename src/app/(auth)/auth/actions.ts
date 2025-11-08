"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignUpSchema, SignInSchema, SignUpInput, PasswordResetRequestSchema, PasswordResetSchema, ChangePasswordSchema } from "@/schemas/auth.schemas";
import { sendVerificationEmail } from "@/mail/send-verification";
import { sendPasswordResetEmail } from "@/mail/send-password-reset";
import { z } from "zod";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Server action for user registration
 */
export async function registerUser(data: SignUpInput) {
  try {
    // Validálás Zod sémával
    const validatedFields = SignUpSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Érvénytelen adatok",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, username, password } = validatedFields.data;

    // Ellenőrizzük, hogy létezik-e már a user
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return {
        success: false,
        error: "Ez az e-mail cím már regisztrálva van",
      };
    }

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return {
        success: false,
        error: "Ez a felhasználónév már foglalt",
      };
    }

    // Jelszó hashelés (bcrypt, 12 rounds)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Email verification token generálás
    const emailVerificationToken = crypto.randomUUID();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 óra

    // User létrehozása
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: "PLAYER", // Default role
        emailVerified: false,
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

    // Email küldés a verification tokennel
    await sendVerificationEmail(
      user.email,
      emailVerificationToken,
      user.username,
      24
    );

    return {
      success: true,
      message: "Sikeres regisztráció! Elküldtünk egy megerősítő emailt.",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validációs hiba",
        details: error.flatten(),
      };
    }

    return {
      success: false,
      error: "Váratlan hiba történt a regisztráció során",
    };
  }
}

/**
 * Server action for user login validation
 * Note: Actual authentication is handled by NextAuth
 */
export async function validateLoginCredentials(email: string, password: string) {
  try {
    const validatedFields = SignInSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Érvénytelen adatok",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Login validation error:", error);
    return {
      success: false,
      error: "Validációs hiba",
    };
  }
}

/**
 * Server action for password reset request
 */
export async function requestPasswordReset(email: string) {
  try {
    const validatedFields = PasswordResetRequestSchema.safeParse({ email });

    if (!validatedFields.success) {
      // Biztonsági okokból mindig sikeres választ adunk
      return {
        success: true,
        message: "Ha az email cím létezik, elküldtük a visszaállító linket",
      };
    }

    // Ellenőrizzük, hogy létezik-e a felhasználó
    const user = await prisma.user.findUnique({
      where: { email: validatedFields.data.email.toLowerCase() },
    });

    // Biztonsági okokból mindig sikeres választ adunk
    if (!user) {
      return {
        success: true,
        message: "Ha az email cím létezik, elküldtük a visszaállító linket",
      };
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
    }

    return {
      success: true,
      message: "Ha az email cím létezik, elküldtük a visszaállító linket",
    };
  } catch (error) {
    console.error("Password reset request error:", error);
    
    // Még hibák esetén is sikeres választ adunk biztonsági okokból
    return {
      success: true,
      message: "Ha az email cím létezik, elküldtük a visszaállító linket",
    };
  }
}

/**
 * Server action for resetting password with token
 */
export async function resetPassword(token: string, newPassword: string, confirmNewPassword: string) {
  try {
    const validatedFields = PasswordResetSchema.safeParse({
      token,
      newPassword,
      confirmNewPassword,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Érvénytelen adatok",
      };
    }

    // Token keresése
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Érvénytelen vagy lejárt token",
      };
    }

    // Új jelszó hashelése
    const hashedPassword = await bcrypt.hash(validatedFields.data.newPassword, 12);

    // Jelszó frissítése és token törlése
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return {
      success: true,
      message: "Jelszó sikeresen megváltoztatva",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      success: false,
      error: "Hiba történt a jelszó visszaállítása során",
    };
  }
}

/**
 * Server action for changing password (authenticated users)
 */
export async function changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string) {
  try {
    // Session ellenőrzés
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        success: false,
        error: "Nincs bejelentkezve",
      };
    }

    const validatedFields = ChangePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Érvénytelen adatok",
      };
    }

    // Felhasználó lekérése
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return {
        success: false,
        error: "Felhasználó nem található",
      };
    }

    // Jelenlegi jelszó ellenőrzése
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return {
        success: false,
        error: "Helytelen jelenlegi jelszó",
      };
    }

    // Új jelszó hashelése
    const hashedPassword = await bcrypt.hash(validatedFields.data.newPassword, 12);

    // Jelszó frissítése
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: "Jelszó sikeresen megváltozott",
    };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      error: "Hiba történt a jelszó változtatása során",
    };
  }
}

/**
 * Server action for email verification
 */
export async function verifyEmail(token: string) {
  try {
    if (!token) {
      return {
        success: false,
        error: "Érvénytelen token",
      };
    }

    // Token keresése
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Érvénytelen vagy lejárt token",
      };
    }

    // Email megerősítése
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return {
      success: true,
      message: "Email cím sikeresen megerősítve",
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      error: "Hiba történt az email megerősítése során",
    };
  }
}
