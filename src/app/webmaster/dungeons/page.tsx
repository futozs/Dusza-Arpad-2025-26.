import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient, DungeonType } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Plus, Castle, Swords, Sparkles, Crown } from "lucide-react";
import { DeleteDungeonButton } from "@/components/DeleteDungeonButton";

const prisma = new PrismaClient();

const dungeonTypeInfo: Record<DungeonType, { label: string; iconComponent: typeof Swords; color: string; reward: string }> = {
  SIMPLE_ENCOUNTER: { 
    label: "Egyszerű találkozás", 
    iconComponent: Swords, 
    color: "text-green-500",
    reward: "+1 sebzés"
  },
  SMALL_DUNGEON: { 
    label: "Kis kazamata", 
    iconComponent: Sparkles, 
    color: "text-blue-500",
    reward: "+2 életerő"
  },
  LARGE_DUNGEON: { 
    label: "Nagy kazamata", 
    iconComponent: Crown, 
    color: "text-purple-500",
    reward: "+3 sebzés"
  },
};

export default async function DungeonsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "WEBMASTER") {
    redirect("/auth/login/webmaster");
  }

  const dungeons = await prisma.dungeon.findMany({
    include: {
      environment: true,
      dungeonCards: {
        include: {
          worldCard: true,
          leaderCard: {
            include: {
              baseCard: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
      _count: {
        select: {
          battles: true,
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
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/webmaster">
              <Button variant="outline" size="icon" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <Castle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Kazamaták
                </h1>
                <p className="text-zinc-400 mt-1">
                  Kihívások összeállítása a játékosok számára
                </p>
              </div>
            </div>
          </div>
          
          <Link href="/webmaster/dungeons/create">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Új kazamata
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {dungeons.map((dungeon) => {
            const typeInfo = dungeonTypeInfo[dungeon.type];
            const IconComponent = typeInfo.iconComponent;
            
            return (
              <Card key={dungeon.id} className="border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <IconComponent className={`w-5 h-5 ${typeInfo.color}`} />
                      {dungeon.name}
                    </CardTitle>
                    <span className={`text-sm ${typeInfo.color} font-semibold px-3 py-1 bg-zinc-800 rounded-full`}>
                      {typeInfo.label}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Dungeon Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-zinc-900/50 p-3 rounded-lg">
                      <p className="text-zinc-400">Kártyák száma</p>
                      <p className="text-lg font-bold text-zinc-100">{dungeon.dungeonCards.length}</p>
                    </div>
                    <div className="bg-amber-900/30 p-3 rounded-lg">
                      <p className="text-zinc-400">Nyeremény</p>
                      <p className="text-lg font-bold text-amber-200">{typeInfo.reward}</p>
                    </div>
                  </div>

                  {/* Cards List */}
                  <div className="bg-zinc-900/50 p-3 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-xs text-zinc-400 mb-2">Kártyák sorrendje:</p>
                    <div className="space-y-1">
                      {dungeon.dungeonCards.map((dc) => (
                        <div key={dc.id} className="flex items-center gap-2 text-sm">
                          <span className="text-zinc-500">#{dc.order}</span>
                          {dc.leaderCard ? (
                            <span className="text-orange-300">
                              👑 {dc.leaderCard.name}
                            </span>
                          ) : (
                            <span className="text-zinc-300">
                              🎴 {dc.worldCard?.name}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Environment & Stats */}
                  {dungeon.environment && (
                    <p className="text-xs text-zinc-500">
                      🌍 {dungeon.environment.name} • {dungeon._count.battles} harc
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/webmaster/dungeons/${dungeon.id}`} className="flex-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full border-purple-400/40 text-purple-200 hover:bg-purple-900/30"
                      >
                        Részletek
                      </Button>
                    </Link>
                    <DeleteDungeonButton dungeonId={dungeon.id} dungeonName={dungeon.name} />
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {dungeons.length === 0 && (
            <div className="col-span-full">
              <Card className="border-2 border-dashed border-red-400/20 bg-zinc-900/50">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-zinc-400 text-lg mb-4">Még nincsenek kazamaták</p>
                  <Link href="/webmaster/dungeons/create">
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Első kazamata létrehozása
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Info Card */}
        <Card className="mt-6 border-2 border-blue-400/20 bg-blue-950/20">
          <CardContent className="pt-6">
            <h3 className="text-blue-200 font-semibold mb-3">ℹ️ Kazamata típusok</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-green-300 font-semibold">⚔️ Egyszerű találkozás</p>
                <p className="text-zinc-400">1 sima kártya • +1 sebzés nyeremény</p>
              </div>
              <div>
                <p className="text-blue-300 font-semibold">🏛️ Kis kazamata</p>
                <p className="text-zinc-400">3 sima + 1 vezér • +2 életerő nyeremény</p>
              </div>
              <div>
                <p className="text-purple-300 font-semibold">🏰 Nagy kazamata</p>
                <p className="text-zinc-400">5 sima + 1 vezér • +3 sebzés nyeremény</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
