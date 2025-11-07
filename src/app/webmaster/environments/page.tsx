import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";

const prisma = new PrismaClient();

export default async function EnvironmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "WEBMASTER") {
    redirect("/login/webmaster");
  }

  const environments = await prisma.environment.findMany({
    include: {
      worldCards: true,
      leaderCards: true,
      dungeons: true,
      _count: {
        select: {
          worldCards: true,
          leaderCards: true,
          dungeons: true,
          games: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
                🌍 Játékkörnyezetek
              </h1>
              <p className="text-zinc-400 mt-2">
                Világok létrehozása és kezelése
              </p>
            </div>
          </div>
          
          <Link href="/webmaster/environments/create">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Új környezet
            </Button>
          </Link>
        </div>

        {/* Environments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {environments.map((env) => (
            <Card key={env.id} className="border-2 border-red-400/20 bg-zinc-900/70 hover:bg-zinc-900/90 transition-all">
              <CardHeader>
                <CardTitle className="text-red-200 text-xl">{env.name}</CardTitle>
                {env.description && (
                  <CardDescription className="text-zinc-400">
                    {env.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Statisztikák */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-zinc-800/50 p-3 rounded-lg">
                    <p className="text-zinc-400">Világkártyák</p>
                    <p className="text-2xl font-bold text-red-200">{env._count.worldCards}</p>
                  </div>
                  <div className="bg-zinc-800/50 p-3 rounded-lg">
                    <p className="text-zinc-400">Vezérkártyák</p>
                    <p className="text-2xl font-bold text-orange-200">{env._count.leaderCards}</p>
                  </div>
                  <div className="bg-zinc-800/50 p-3 rounded-lg">
                    <p className="text-zinc-400">Kazamaták</p>
                    <p className="text-2xl font-bold text-amber-200">{env._count.dungeons}</p>
                  </div>
                  <div className="bg-zinc-800/50 p-3 rounded-lg">
                    <p className="text-zinc-400">Aktív játékok</p>
                    <p className="text-2xl font-bold text-green-200">{env._count.games}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/webmaster/environments/${env.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-red-400/40 text-red-200 hover:bg-red-900/30">
                      <Pencil className="w-4 h-4 mr-2" />
                      Szerkesztés
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-red-600/40 text-red-400 hover:bg-red-900/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-xs text-zinc-500 text-center">
                  Létrehozva: {new Date(env.createdAt).toLocaleDateString('hu-HU')}
                </div>
              </CardContent>
            </Card>
          ))}

          {environments.length === 0 && (
            <div className="col-span-full">
              <Card className="border-2 border-dashed border-red-400/20 bg-zinc-900/50">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-zinc-400 text-lg mb-4">Még nincsenek játékkörnyezetek</p>
                  <Link href="/webmaster/environments/create">
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Első környezet létrehozása
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
