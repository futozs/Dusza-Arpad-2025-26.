import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient, CardType } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";

const prisma = new PrismaClient();

// Kártya típus ikonok és színek
const cardTypeInfo: Record<CardType, { icon: string; color: string; bg: string }> = {
  EARTH: { icon: "🌍", color: "text-amber-400", bg: "bg-amber-900/30" },
  AIR: { icon: "💨", color: "text-cyan-400", bg: "bg-cyan-900/30" },
  WATER: { icon: "💧", color: "text-blue-400", bg: "bg-blue-900/30" },
  FIRE: { icon: "🔥", color: "text-red-400", bg: "bg-red-900/30" },
};

const cardTypeNames: Record<CardType, string> = {
  EARTH: "Föld",
  AIR: "Levegő",
  WATER: "Víz",
  FIRE: "Tűz",
};

export default async function WorldCardsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "WEBMASTER") {
    redirect("/login/webmaster");
  }

  const environments = await prisma.environment.findMany({
    orderBy: { name: "asc" },
  });

  const worldCards = await prisma.worldCard.findMany({
    include: {
      environment: true,
    },
    orderBy: [
      { environmentId: "asc" },
      { order: "asc" },
    ],
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
                🎴 Világkártyák
              </h1>
              <p className="text-zinc-400 mt-2">
                Sima kártyák létrehozása és kezelése
              </p>
            </div>
          </div>
          
          <Link href="/webmaster/world-cards/create">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Új kártya
            </Button>
          </Link>
        </div>

        {/* Environment Filters */}
        {environments.length === 0 ? (
          <Card className="border-2 border-dashed border-red-400/20 bg-zinc-900/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-zinc-400 text-lg mb-4">Először hozz létre egy játékkörnyezetet!</p>
              <Link href="/webmaster/environments/create">
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  Környezet létrehozása
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Cards by Environment */}
            {environments.map((env) => {
              const envCards = worldCards.filter((card) => card.environmentId === env.id);
              
              if (envCards.length === 0) return null;

              return (
                <div key={env.id} className="mb-8">
                  <h2 className="text-2xl font-bold text-red-200 mb-4">
                    🌍 {env.name}
                  </h2>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {envCards.map((card) => {
                      const typeInfo = cardTypeInfo[card.type];
                      
                      return (
                        <Card key={card.id} className={`border-2 border-red-400/20 ${typeInfo.bg} backdrop-blur-sm`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg text-zinc-100">
                                {card.name}
                              </CardTitle>
                              <span className="text-2xl">{typeInfo.icon}</span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="bg-zinc-900/50 p-2 rounded text-center">
                                <p className="text-zinc-400 text-xs">Sorrend</p>
                                <p className="text-lg font-bold text-zinc-200">#{card.order}</p>
                              </div>
                              <div className="bg-red-900/30 p-2 rounded text-center">
                                <p className="text-zinc-400 text-xs">Sebzés</p>
                                <p className="text-lg font-bold text-red-200">⚔️ {card.damage}</p>
                              </div>
                              <div className="bg-green-900/30 p-2 rounded text-center">
                                <p className="text-zinc-400 text-xs">Életerő</p>
                                <p className="text-lg font-bold text-green-200">❤️ {card.health}</p>
                              </div>
                            </div>

                            {/* Type */}
                            <div className={`${typeInfo.bg} border border-${typeInfo.color}/30 p-2 rounded text-center`}>
                              <p className={`${typeInfo.color} font-semibold`}>
                                {typeInfo.icon} {cardTypeNames[card.type]}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Link href={`/webmaster/world-cards/${card.id}`} className="flex-1">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-full border-red-400/40 text-red-200 hover:bg-red-900/30"
                                >
                                  <Pencil className="w-3 h-3 mr-1" />
                                  Szerkeszt
                                </Button>
                              </Link>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-red-600/40 text-red-400 hover:bg-red-900/50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {worldCards.length === 0 && (
              <Card className="border-2 border-dashed border-red-400/20 bg-zinc-900/50">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-zinc-400 text-lg mb-4">Még nincsenek világkártyák</p>
                  <Link href="/webmaster/world-cards/create">
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Első kártya létrehozása
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
