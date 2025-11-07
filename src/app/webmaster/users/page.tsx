import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, UserCog } from "lucide-react";
import { UserListClient } from "@/app/webmaster/users/UserListClient";

const prisma = new PrismaClient();

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "WEBMASTER") {
    redirect("/login/webmaster");
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

  // Biztonság: ne küldjük el az érzékeny adatokat
  const sanitizedUsers = users.map((user) => ({
    ...user,
    password: undefined,
    twoFactorSecret: undefined,
    twoFactorBackupCodes: undefined,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    games: user.games.map((game) => ({
      ...game,
      createdAt: game.createdAt.toISOString(),
      updatedAt: game.updatedAt.toISOString(),
      environment: {
        ...game.environment,
        createdAt: game.environment.createdAt.toISOString(),
        updatedAt: game.environment.updatedAt.toISOString(),
      },
    })),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/webmaster">
              <Button variant="outline" size="icon" className="border-red-400/40 text-red-200">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-200 via-orange-200 to-red-200 bg-clip-text text-transparent">
                👥 Felhasználók
              </h1>
              <p className="text-zinc-400 mt-2">
                Felhasználók kezelése és adminisztrálása
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="border-2 border-red-400/30 bg-zinc-900/90 backdrop-blur-xl mb-8">
          <CardHeader>
            <CardTitle className="text-red-200 flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Statisztikák
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <p className="text-zinc-400 text-sm">Összes felhasználó</p>
                <p className="text-3xl font-bold text-zinc-100">{users.length}</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <p className="text-zinc-400 text-sm">Játékosok</p>
                <p className="text-3xl font-bold text-blue-200">
                  {users.filter((u) => u.role === "PLAYER").length}
                </p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <p className="text-zinc-400 text-sm">Webmesterek</p>
                <p className="text-3xl font-bold text-red-200">
                  {users.filter((u) => u.role === "WEBMASTER").length}
                </p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <p className="text-zinc-400 text-sm">2FA engedélyezve</p>
                <p className="text-3xl font-bold text-green-200">
                  {users.filter((u) => u.twoFactorEnabled).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <UserListClient initialUsers={sanitizedUsers} currentUserId={session.user.id} />
      </div>
    </div>
  );
}
