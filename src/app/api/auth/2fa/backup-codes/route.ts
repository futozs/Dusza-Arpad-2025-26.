import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";



/**
 * GET /api/auth/2fa/backup-codes
 * 
 * Felhasználó backup kódjainak lekérése
 * Csak a használatlan kódokat adjuk vissza maszkírozva
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        backupCodes: {
          select: {
            id: true,
            used: true,
            usedAt: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Felhasználó nem található" },
        { status: 404 }
      );
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: "A 2FA nincs engedélyezve" },
        { status: 400 }
      );
    }

    // Visszaadjuk a kódok státuszát (hash-elve vannak, így nem tudjuk mutatni a tényleges kódot)
    const backupCodesStatus = user.backupCodes.map((code, index) => ({
      id: code.id,
      position: index + 1,
      used: code.used,
      usedAt: code.usedAt,
      createdAt: code.createdAt,
    }));

    return NextResponse.json({
      totalCodes: user.backupCodes.length,
      unusedCodes: user.backupCodes.filter((c) => !c.used).length,
      codes: backupCodesStatus,
    });
  } catch (error) {
    console.error("Backup codes fetch error:", error);
    return NextResponse.json(
      { error: "Hiba történt a backup kódok lekérése során" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/2fa/backup-codes
 * 
 * Új backup kódok generálása (jelszó ellenőrzéssel)
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
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Jelszó megadása kötelező" },
        { status: 400 }
      );
    }

    // Felhasználó lekérése jelszóval
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Felhasználó nem található" },
        { status: 404 }
      );
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: "A 2FA nincs engedélyezve" },
        { status: 400 }
      );
    }

    // Jelszó ellenőrzése
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Helytelen jelszó" },
        { status: 401 }
      );
    }

    // Új backup kódok generálása
    const newBackupCodes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    // Hash-elés
    const hashedBackupCodes = await Promise.all(
      newBackupCodes.map(async (code: string) => ({
        code: await bcrypt.hash(code, 10),
        used: false,
      }))
    );

    // Régi kódok törlése és újak mentése
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        backupCodes: {
          deleteMany: {},
          create: hashedBackupCodes,
        },
      },
    });

    console.log(`New backup codes generated for user: ${session.user.email}`);

    // Csak most adjuk vissza a plain text kódokat
    return NextResponse.json({
      success: true,
      backupCodes: newBackupCodes,
      message: "Új backup kódok sikeresen generálva!",
    });
  } catch (error) {
    console.error("Backup codes generation error:", error);
    return NextResponse.json(
      { error: "Hiba történt az új backup kódok generálása során" },
      { status: 500 }
    );
  }
}
