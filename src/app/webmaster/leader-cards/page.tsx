import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Plus, Crown, Sword, Heart, Zap } from "lucide-react";
import { DeleteLeaderCardButton } from "@/components/DeleteLeaderCardButton";

const prisma = new PrismaClient();

export default async function LeaderCardsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "WEBMASTER") {
    redirect("/auth/login/webmaster");
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
                <Crown className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Vezérkártyák
                </h1>
                <p className="text-zinc-400 mt-1">
                  Erősített kártyák származtatása világkártyákból
                </p>
              </div>
            </div>
          </div>
          
          <Link href="/webmaster/leader-cards/create">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Új vezérkártya
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaderCards.map((card) => (
            <Card key={card.id} className="border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  {card.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg">
                  <p className="text-xs text-zinc-400 mb-1">Alapkártya</p>
                  <p className="text-white font-semibold">{card.baseCard.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Sword className="w-4 h-4 text-red-500" />
                      <p className="text-xs text-zinc-400">Sebzés</p>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {card.boostType === "DAMAGE_DOUBLE" ? card.baseCard.damage * 2 : card.baseCard.damage}
                    </p>
                  </div>
                  <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Heart className="w-4 h-4 text-green-500" />
                      <p className="text-xs text-zinc-400">Életerő</p>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {card.boostType === "HEALTH_DOUBLE" ? card.baseCard.health * 2 : card.baseCard.health}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <p className="text-amber-400 font-semibold text-sm">
                      {card.boostType === "DAMAGE_DOUBLE" ? "Sebzés duplázás" : "Életerő duplázás"}
                    </p>
                  </div>
                </div>

                {card.environment && (
                  <p className="text-xs text-zinc-500 text-center">
                    Környezet: {card.environment.name}
                  </p>
                )}

                <div className="flex gap-2 mt-2">
                  <Link href={`/webmaster/leader-cards/${card.id}`} className="flex-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                      Szerkesztés
                    </Button>
                  </Link>
                  <DeleteLeaderCardButton cardId={card.id} cardName={card.name} />
                </div>
              </CardContent>
            </Card>
          ))}

          {leaderCards.length === 0 && (
            <div className="col-span-full">
              <Card className="border border-dashed border-zinc-800 bg-zinc-900">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-zinc-800 rounded-full mb-4">
                    <Crown className="w-8 h-8 text-zinc-600" />
                  </div>
                  <p className="text-zinc-400 text-lg mb-4">Még nincsenek vezérkártyák</p>
                  <Link href="/webmaster/leader-cards/create">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
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
