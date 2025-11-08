import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as speakeasy from "speakeasy";
import * as QRCode from "qrcode";
import { TwoFactorSetupSchema } from "@/schemas/auth.schemas";
import bcrypt from "bcryptjs";


/**
 * GET /api/auth/2fa/setup
 * 
 * 2FA beállítás kezdeményezése
 * - Generál egy TOTP secretet
 * - Visszaad egy QR kódot és backup kódokat
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - bejelentkezés szükséges" },
        { status: 401 }
      );
    }

    // Már engedélyezett a 2FA?
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorEnabled: true },
    });

    if (user?.twoFactorEnabled) {
      return NextResponse.json(
        { error: "A 2FA már engedélyezve van ezen a fiókon" },
        { status: 400 }
      );
    }

    // TOTP secret generálása
    const secret = speakeasy.generateSecret({
      name: `Damareen (${session.user.email})`,
      issuer: "Damareen",
      length: 32,
    });

    // QR kód generálása
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url || "");

    // Backup kódok generálása (8 db, 8 karakteres)
    const backupCodes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    // Secret ideiglenesen session-ben tárolható, vagy DB-ben flag-gelve
    // Most visszaadjuk, és a verify során mentjük el véglegesen
    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      backupCodes,
      message: "Szkenneld be a QR kódot az authenticator app-oddal (pl. Google Authenticator, Authy)",
    });
  } catch (error) {
    console.error("2FA setup error:", error);
    return NextResponse.json(
      { error: "Hiba történt a 2FA beállítása során" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/2fa/setup
 * 
 * 2FA engedélyezése - kód ellenőrzés
 * - Ellenőrzi a user által megadott TOTP kódot
 * - Ha helyes, elmenti a secretet és engedélyezi a 2FA-t
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - bejelentkezés szükséges" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { secret, code, backupCodes } = body;

    // Validálás
    const validatedFields = TwoFactorSetupSchema.safeParse({ code });
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Érvénytelen kód formátum", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    if (!secret || !backupCodes) {
      return NextResponse.json(
        { error: "Hiányzó secret vagy backup kódok" },
        { status: 400 }
      );
    }

    // TOTP kód ellenőrzése
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token: code,
      window: 2,
    });

    if (!verified) {
      return NextResponse.json(
        { error: "Érvénytelen kód. Próbáld újra!" },
        { status: 400 }
      );
    }

    // 2FA engedélyezése és mentés DB-be
    // Először hash-eljük a backup kódokat
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(async (code: string) => ({
        code: await bcrypt.hash(code, 10),
        used: false,
      }))
    );

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        backupCodes: {
          deleteMany: {}, // Töröljük a régi kódokat, ha vannak
          create: hashedBackupCodes,
        },
      },
    });

    console.log(`2FA enabled for user: ${session.user.email}`);

    return NextResponse.json({
      success: true,
      message: "A kétfaktoros hitelesítés sikeresen engedélyezve!",
    });
  } catch (error) {
    console.error("2FA verification error:", error);
    return NextResponse.json(
      { error: "Hiba történt a 2FA engedélyezése során" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/2fa/setup
 * 
 * 2FA letiltása
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - bejelentkezés szükséges" },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: {
          deleteMany: {},
        },
      },
    });

    console.log(`2FA disabled for user: ${session.user.email}`);

    return NextResponse.json({
      success: true,
      message: "A kétfaktoros hitelesítés sikeresen letiltva",
    });
  } catch (error) {
    console.error("2FA disable error:", error);
    return NextResponse.json(
      { error: "Hiba történt a 2FA letiltása során" },
      { status: 500 }
    );
  }
}
