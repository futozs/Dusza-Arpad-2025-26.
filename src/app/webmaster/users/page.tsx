import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Users as UsersIcon, UserCheck, Shield, GamepadIcon } from "lucide-react";
import { UserListClient } from "@/app/webmaster/users/UserListClient";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "WEBMASTER") {
    redirect("/auth/login/webmaster");
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
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/webmaster">
              <Button variant="outline" size="icon" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <UsersIcon className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Felhasználók
                </h1>
                <p className="text-zinc-400 mt-1">
                  Felhasználók kezelése és adminisztrálása
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="border border-zinc-800 bg-zinc-900 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-cyan-500" />
              Statisztikák
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <UsersIcon className="w-4 h-4 text-zinc-400" />
                  <p className="text-zinc-400 text-sm">Összes felhasználó</p>
                </div>
                <p className="text-3xl font-bold text-white">{users.length}</p>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-4 h-4 text-blue-500" />
                  <p className="text-zinc-400 text-sm">Játékosok</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {users.filter((u) => u.role === "PLAYER").length}
                </p>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <p className="text-zinc-400 text-sm">Webmesterek</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {users.filter((u) => u.role === "WEBMASTER").length}
                </p>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <GamepadIcon className="w-4 h-4 text-green-500" />
                  <p className="text-zinc-400 text-sm">2FA engedélyezve</p>
                </div>
                <p className="text-3xl font-bold text-white">
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
