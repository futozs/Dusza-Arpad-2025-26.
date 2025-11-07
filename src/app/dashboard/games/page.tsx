import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@/generated/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import { 
  Gamepad2, 
  Plus,
  Clock,
  Target,
  Swords,
  Shield,
  Users,
  Play,
  Trash2,
  Trophy,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

export default async function GamesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Játékos játékainak lekérése
  const games = await prisma.game.findMany({
    where: { userId: session.user.id },
    include: {
      environment: true,
      _count: {
        select: {
          battles: true,
          playerCards: true,
          decks: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const activeGames = games; // Jelenleg nincs status mező
  const completedGames: typeof games = []; // Jelenleg nincs status mező

  return (
    <DashboardLayout>
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Gamepad2 className="w-10 h-10 text-purple-400" />
                Játékaim
              </h1>
              <p className="text-zinc-400">Kezeld játékaidat és indíts új kalandokat</p>
            </div>
            <Link href="/dashboard/games/new">
              <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Új Játék
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Összes</p>
                    <p className="text-3xl font-bold text-white">{games.length}</p>
                  </div>
                  <Gamepad2 className="w-10 h-10 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Aktív</p>
                    <p className="text-3xl font-bold text-white">{activeGames.length}</p>
                  </div>
                  <Play className="w-10 h-10 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Befejezett</p>
                    <p className="text-3xl font-bold text-white">{completedGames.length}</p>
                  </div>
                  <Trophy className="w-10 h-10 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Games */}
          {activeGames.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Play className="w-6 h-6 text-green-400" />
                Aktív Játékok
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeGames.map((game) => (
                  <Card key={game.id} className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-purple-500/30 transition-all group">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                          <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                        <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                          <Play className="w-3 h-3" />
                          Aktív
                        </span>
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors">
                        {game.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-zinc-500">
                        <Target className="w-4 h-4" />
                        {game.environment.name}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-zinc-400">
                            <Swords className="w-4 h-4" />
                            Csaták
                          </span>
                          <span className="text-white font-medium">{game._count.battles}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-zinc-400">
                            <Shield className="w-4 h-4" />
                            Kártyák
                          </span>
                          <span className="text-white font-medium">{game._count.playerCards}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-zinc-400">
                            <Users className="w-4 h-4" />
                            Paklik
                          </span>
                          <span className="text-white font-medium">{game._count.decks}</span>
                        </div>

                        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(game.updatedAt).toLocaleDateString('hu-HU')}
                          </span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Link href={`/dashboard/games/${game.id}/play`} className="flex-1">
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                              <Play className="w-4 h-4 mr-2" />
                              Játék
                            </Button>
                          </Link>
                          <Button variant="outline" className="border-red-700 text-red-400 hover:bg-red-900/30">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Games */}
          {completedGames.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Befejezett Játékok
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedGames.map((game) => (
                  <Card key={game.id} className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-yellow-500/30 transition-all group">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Befejezett
                        </span>
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-yellow-300 transition-colors">
                        {game.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-zinc-500">
                        <Target className="w-4 h-4" />
                        {game.environment.name}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-zinc-400">
                            <Swords className="w-4 h-4" />
                            Csaták
                          </span>
                          <span className="text-white font-medium">{game._count.battles}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-zinc-400">
                            <Shield className="w-4 h-4" />
                            Kártyák
                          </span>
                          <span className="text-white font-medium">{game._count.playerCards}</span>
                        </div>

                        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(game.updatedAt).toLocaleDateString('hu-HU')}
                          </span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Link href={`/dashboard/games/${game.id}/play`} className="flex-1">
                            <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                              <Play className="w-4 h-4 mr-2" />
                              Játék
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {games.length === 0 && (
            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Gamepad2 className="w-24 h-24 text-zinc-700 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Még nincs játékod</h3>
                <p className="text-zinc-400 mb-6">Indíts egy új kalandot és fedezd fel a Damareen világát!</p>
                <Link href="/dashboard/games/new">
                  <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white flex items-center gap-2 mx-auto">
                    <Plus className="w-5 h-5" />
                    Új Játék Indítása
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
