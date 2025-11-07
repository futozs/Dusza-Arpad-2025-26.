import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

const prisma = new PrismaClient();

export default async function LeaderCardsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "WEBMASTER") {
    redirect("/login/webmaster");
  }

  const leaderCards = await prisma.leaderCard.findMany({
    include: {
      baseCard: true,
      environment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/webmaster">
              <Button variant="outline" size="icon" className="border-red-400/40 text-red-200">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-200 via-orange-200 to-red-200 bg-clip-text text-transparent">
                👑 Vezérkártyák
              </h1>
              <p className="text-zinc-400 mt-2">
                Erősített kártyák származtatása világkártyákból
              </p>
            </div>
          </div>
          
          <Link href="/webmaster/leader-cards/create">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Új vezérkártya
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaderCards.map((card) => (
            <Card key={card.id} className="border-2 border-orange-400/30 bg-gradient-to-br from-orange-900/20 to-red-900/20">
              <CardHeader>
                <CardTitle className="text-orange-200 flex items-center gap-2">
                  👑 {card.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-zinc-900/50 p-3 rounded-lg">
                  <p className="text-xs text-zinc-400">Alapkártya</p>
                  <p className="text-zinc-100 font-semibold">{card.baseCard.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-red-900/30 p-2 rounded text-center">
                    <p className="text-xs text-zinc-400">Sebzés</p>
                    <p className="text-lg font-bold text-red-200">
                      ⚔️ {card.boostType === "DAMAGE_DOUBLE" ? card.baseCard.damage * 2 : card.baseCard.damage}
                    </p>
                  </div>
                  <div className="bg-green-900/30 p-2 rounded text-center">
                    <p className="text-xs text-zinc-400">Életerő</p>
                    <p className="text-lg font-bold text-green-200">
                      ❤️ {card.boostType === "HEALTH_DOUBLE" ? card.baseCard.health * 2 : card.baseCard.health}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-900/30 border border-amber-400/30 p-2 rounded text-center">
                  <p className="text-amber-200 font-semibold">
                    {card.boostType === "DAMAGE_DOUBLE" ? "🗡️ Sebzés duplázás" : "💪 Életerő duplázás"}
                  </p>
                </div>

                {card.environment && (
                  <p className="text-xs text-zinc-500 text-center">
                    🌍 {card.environment.name}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {leaderCards.length === 0 && (
            <div className="col-span-full">
              <Card className="border-2 border-dashed border-red-400/20 bg-zinc-900/50">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-zinc-400 text-lg mb-4">Még nincsenek vezérkártyák</p>
                  <Link href="/webmaster/leader-cards/create">
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Első vezérkártya létrehozása
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
