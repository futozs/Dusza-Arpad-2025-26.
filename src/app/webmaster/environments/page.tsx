import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Plus, Globe, Layers, Crown, Castle, GamepadIcon, Pencil } from "lucide-react";
import { DeleteEnvironmentButton } from "@/components/DeleteEnvironmentButton";

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
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Játékkörnyezetek
                </h1>
                <p className="text-zinc-400 mt-1">
                  Világok létrehozása és kezelése
                </p>
              </div>
            </div>
          </div>
          
          <Link href="/webmaster/environments/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Új környezet
            </Button>
          </Link>
        </div>

        {/* Environments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {environments.map((env) => (
            <Card key={env.id} className="border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all">
              <CardHeader>
                <CardTitle className="text-white text-xl">{env.name}</CardTitle>
                {env.description && (
                  <CardDescription className="text-zinc-400">
                    {env.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Statisztikák */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="w-4 h-4 text-purple-500" />
                      <p className="text-zinc-400 text-xs">Világkártyák</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{env._count.worldCards}</p>
                  </div>
                  <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <p className="text-zinc-400 text-xs">Vezérkártyák</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{env._count.leaderCards}</p>
                  </div>
                  <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Castle className="w-4 h-4 text-red-500" />
                      <p className="text-zinc-400 text-xs">Kazamaták</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{env._count.dungeons}</p>
                  </div>
                  <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <GamepadIcon className="w-4 h-4 text-green-500" />
                      <p className="text-zinc-400 text-xs">Aktív játékok</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{env._count.games}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/webmaster/environments/${env.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      <Pencil className="w-4 h-4 mr-2" />
                      Szerkesztés
                    </Button>
                  </Link>
                  <DeleteEnvironmentButton environmentId={env.id} environmentName={env.name} />
                </div>

                <div className="text-xs text-zinc-500 text-center">
                  Létrehozva: {new Date(env.createdAt).toLocaleDateString('hu-HU')}
                </div>
              </CardContent>
            </Card>
          ))}

          {environments.length === 0 && (
            <div className="col-span-full">
              <Card className="border border-dashed border-zinc-800 bg-zinc-900">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-zinc-800 rounded-full mb-4">
                    <Globe className="w-8 h-8 text-zinc-600" />
                  </div>
                  <p className="text-zinc-400 text-lg mb-4">Még nincsenek játékkörnyezetek</p>
                  <Link href="/webmaster/environments/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
