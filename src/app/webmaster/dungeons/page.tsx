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

const dungeonTypeInfo: Record<DungeonType, { label: string; iconComponent: typeof Swords; color: string; textColor: string; reward: string }> = {
  SIMPLE_ENCOUNTER: { 
    label: "Egyszerű találkozás", 
    iconComponent: Swords, 
    color: "bg-green-500/10 border-green-500/30",
    textColor: "text-green-400",
    reward: "+1 sebzés"
  },
  SMALL_DUNGEON: { 
    label: "Kis kazamata", 
    iconComponent: Sparkles, 
    color: "bg-blue-500/10 border-blue-500/30",
    textColor: "text-blue-400",
    reward: "+2 életerő"
  },
  LARGE_DUNGEON: { 
    label: "Nagy kazamata", 
    iconComponent: Crown, 
    color: "bg-purple-500/10 border-purple-500/30",
    textColor: "text-purple-400",
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
                      <IconComponent className={`w-5 h-5 ${typeInfo.textColor}`} />
                      {dungeon.name}
                    </CardTitle>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${typeInfo.color} ${typeInfo.textColor}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Dungeon Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg">
                      <p className="text-zinc-400 text-xs mb-1">Kártyák száma</p>
                      <p className="text-lg font-bold text-zinc-100">{dungeon.dungeonCards.length}</p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg">
                      <p className="text-zinc-400 text-xs mb-1">Nyeremény</p>
                      <p className="text-lg font-bold text-amber-400">{typeInfo.reward}</p>
                    </div>
                    <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg">
                      <p className="text-zinc-400 text-xs mb-1">Sorrend</p>
                      <p className="text-lg font-bold text-zinc-100">#{dungeon.order}</p>
                    </div>
                    <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg">
                      <p className="text-zinc-400 text-xs mb-1">Szükséges győzelmek</p>
                      <p className="text-lg font-bold text-zinc-100">{dungeon.requiredWins}</p>
                    </div>
                  </div>

                  {/* Cards List */}
                  <div className="bg-zinc-800/50 border border-zinc-700 p-3 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-xs text-zinc-400 mb-2">Kártyák sorrendje:</p>
                    <div className="space-y-1">
                      {dungeon.dungeonCards.map((dc) => (
                        <div key={dc.id} className="flex items-center gap-2 text-sm">
                          <span className="text-zinc-500 font-mono">#{dc.order}</span>
                          {dc.leaderCard ? (
                            <span className="text-amber-400 flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              {dc.leaderCard.name}
                            </span>
                          ) : (
                            <span className="text-zinc-300">
                              {dc.worldCard?.name}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Environment & Stats */}
                  {dungeon.environment && (
                    <p className="text-xs text-zinc-500 text-center">
                      {dungeon.environment.name} • {dungeon._count.battles} harc
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/webmaster/dungeons/${dungeon.id}`} className="flex-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        Szerkesztés
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
              <Card className="border border-dashed border-zinc-800 bg-zinc-900">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-zinc-800 rounded-full mb-4">
                    <Castle className="w-8 h-8 text-zinc-600" />
                  </div>
                  <p className="text-zinc-400 text-lg mb-4">Még nincsenek kazamaták</p>
                  <Link href="/webmaster/dungeons/create">
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Első kazamata létrehozása
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
