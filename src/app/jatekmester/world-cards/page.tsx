import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CardType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Layers, Mountain, Wind, Droplet, Flame } from "lucide-react";
import { DeleteCardButton } from "@/components/DeleteCardButton";

// Kártya típus ikonok és színek
const cardTypeInfo: Record<CardType, { iconComponent: typeof Mountain; color: string; bgColor: string }> = {
  EARTH: { iconComponent: Mountain, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  AIR: { iconComponent: Wind, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  WATER: { iconComponent: Droplet, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  FIRE: { iconComponent: Flame, color: "text-red-500", bgColor: "bg-red-500/10" },
};

const cardTypeNames: Record<CardType, string> = {
  EARTH: "Föld",
  AIR: "Levegő",
  WATER: "Víz",
  FIRE: "Tűz",
};

export default async function WorldCardsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "JATEKMESTER") {
    redirect("/auth/login/jatekmester");
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
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/jatekmester">
              <Button variant="outline" size="icon" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <Layers className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Világkártyák
                </h1>
                <p className="text-zinc-400 mt-1">
                  Alap kártyák létrehozása és kezelése
                </p>
              </div>
            </div>
          </div>
          
          <Link href="/jatekmester/world-cards/create">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Új kártya
            </Button>
          </Link>
        </div>

        {/* Environment Filters */}
        {environments.length === 0 ? (
          <Card className="border border-dashed border-zinc-800 bg-zinc-900">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-zinc-400 text-lg mb-4">Először hozz létre egy játékkörnyezetet!</p>
              <Link href="/jatekmester/environments/create">
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
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {env.name}
                  </h2>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {envCards.map((card) => {
                      const typeInfo = cardTypeInfo[card.type];
                      const TypeIcon = typeInfo.iconComponent;
                      
                      return (
                        <Card key={card.id} className="border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg text-white">
                                {card.name}
                              </CardTitle>
                              <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="bg-zinc-800 border border-zinc-700 p-2 rounded text-center">
                                <p className="text-zinc-400 text-xs">Sorrend</p>
                                <p className="text-lg font-bold text-white">#{card.order}</p>
                              </div>
                              <div className="bg-zinc-800 border border-zinc-700 p-2 rounded text-center">
                                <p className="text-zinc-400 text-xs">Sebzés</p>
                                <p className="text-lg font-bold text-red-400">{card.damage}</p>
                              </div>
                              <div className="bg-zinc-800 border border-zinc-700 p-2 rounded text-center">
                                <p className="text-zinc-400 text-xs">Életerő</p>
                                <p className="text-lg font-bold text-green-400">{card.health}</p>
                              </div>
                            </div>

                            {/* Type */}
                            <div className={`${typeInfo.bgColor} border border-zinc-700 p-2 rounded text-center`}>
                              <div className="flex items-center justify-center gap-2">
                                <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                                <p className={`${typeInfo.color} font-semibold text-sm`}>
                                  {cardTypeNames[card.type]}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Link href={`/jatekmester/world-cards/${card.id}`} className="flex-1">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                >
                                  <Pencil className="w-3 h-3 mr-1" />
                                  Szerkeszt
                                </Button>
                              </Link>
                              <DeleteCardButton cardId={card.id} cardName={card.name} />
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
                  <Link href="/jatekmester/world-cards/create">
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
