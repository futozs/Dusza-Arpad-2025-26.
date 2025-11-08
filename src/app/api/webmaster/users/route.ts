import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Prisma client imported from singleton

/**
 * GET /api/webmaster/users
 * Felhasználók listázása (admin)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "WEBMASTER") {
      return NextResponse.json(
        { error: "Nincs jogosultság" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      include: {
        games: {
          include: {
            environment: true,
            _count: {
              select: {
                playerCards: true,
                battles: true,
              },
            },
          },
        },
        _count: {
          select: {
            games: true,
            sessions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Biztonság: ne küldjük vissza a jelszavakat és érzékeny adatokat
    const sanitizedUsers = users.map((user) => ({
      ...user,
      password: undefined,
      twoFactorSecret: undefined,
      twoFactorBackupCodes: undefined,
    }));

    return NextResponse.json(sanitizedUsers);
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json(
      { error: "Hiba történt a lekérés során" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/webmaster/users?id=xxx
 * Felhasználó adatainak módosítása
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "WEBMASTER") {
      return NextResponse.json(
        { error: "Nincs jogosultság" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Hiányzó felhasználó ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      username, 
      email, 
      role, 
      emailVerified, 
      twoFactorEnabled,
      password 
    } = body;

    // Ellenőrizzük, hogy a felhasználó létezik-e
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "A felhasználó nem létezik" },
        { status: 404 }
      );
    }

    // Ne engedjük, hogy saját magát törölje le adminból
    if (id === session.user.id && role && role !== "WEBMASTER") {
      return NextResponse.json(
        { error: "Nem törölheted le saját magad adminból!" },
        { status: 400 }
      );
    }

    // Ellenőrizzük az email egyediséget
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Ez az email cím már használatban van" },
          { status: 400 }
        );
      }
    }

    // Ellenőrizzük a username egyediséget
    if (username && username !== existingUser.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username },
      });

      if (usernameExists) {
        return NextResponse.json(
          { error: "Ez a felhasználónév már használatban van" },
          { status: 400 }
        );
      }
    }

    // Építsük fel az update adatokat
    const updateData: Record<string, unknown> = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (typeof emailVerified === "boolean") updateData.emailVerified = emailVerified;
    if (typeof twoFactorEnabled === "boolean") updateData.twoFactorEnabled = twoFactorEnabled;
    
    // Ha új jelszót adtak meg
    if (password && password.length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Frissítés
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            games: true,
            sessions: true,
          },
        },
      },
    });

    // Biztonság: ne küldjük vissza az érzékeny adatokat
    const sanitizedUser = {
      ...updatedUser,
      password: undefined,
      twoFactorSecret: undefined,
      twoFactorBackupCodes: undefined,
    };

    return NextResponse.json(sanitizedUser);
  } catch (error) {
    console.error("User PATCH error:", error);
    return NextResponse.json(
      { error: "Hiba történt a módosítás során" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/webmaster/users?id=xxx
 * Felhasználó törlése
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "WEBMASTER") {
      return NextResponse.json(
        { error: "Nincs jogosultság" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Hiányzó felhasználó ID" },
        { status: 400 }
      );
    }

    // Ne engedjük, hogy saját magát törölje
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Nem törölheted saját magadat!" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Felhasználó sikeresen törölve" });
  } catch (error) {
    console.error("User DELETE error:", error);
    return NextResponse.json(
      { error: "Hiba történt a törlés során" },
      { status: 500 }
    );
  }
}
