import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@/generated/prisma";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { 
  BarChart3, 
  TrendingUp,
  Trophy,
  Target,
  Zap,
  Award,
  Flame,
  Shield,
  Swords,
  Crown
} from "lucide-react";

const prisma = new PrismaClient();

export default async function StatsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Statisztikák lekérése
  const games = await prisma.game.findMany({
    where: { userId: session.user.id },
    include: {
      environment: true,
      battles: true,
      playerCards: true,
      _count: {
        select: {
          battles: true,
          playerCards: true,
          decks: true,
        },
      },
    },
  });

  const totalGames = games.length;
  const activeGames = games.length; // Jelenleg nincs status mező
  const completedGames = 0; // Jelenleg nincs status mező
  const totalBattles = games.reduce((sum, g) => sum + g._count.battles, 0);
  const totalCards = games.reduce((sum, g) => sum + g._count.playerCards, 0);
  const totalDecks = games.reduce((sum, g) => sum + g._count.decks, 0);

  // Környezetek szerinti játékok
  const gamesByEnvironment = games.reduce((acc: Record<string, number>, game) => {
    const envName = game.environment.name;
    if (!acc[envName]) {
      acc[envName] = 0;
    }
    acc[envName]++;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <DashboardNavbar />
      
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Decorative Background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-40 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-60 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-1/2 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
          </div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-purple-400" />
              Statisztikák
            </h1>
            <p className="text-zinc-400">Tekintsd meg játékos teljesítményedet és előrehaladásodat</p>
          </div>

          {/* Main Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border border-zinc-800 bg-gradient-to-br from-purple-900/20 to-zinc-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-12 h-12 text-purple-400" />
                  <span className="text-purple-400 text-sm font-medium">Összes</span>
                </div>
                <p className="text-4xl font-bold text-white mb-1">{totalGames}</p>
                <p className="text-zinc-400 text-sm">Játék Összesen</p>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-gradient-to-br from-green-900/20 to-zinc-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Flame className="w-12 h-12 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Aktív</span>
                </div>
                <p className="text-4xl font-bold text-white mb-1">{activeGames}</p>
                <p className="text-zinc-400 text-sm">Folyamatban</p>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-gradient-to-br from-yellow-900/20 to-zinc-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-12 h-12 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">Kész</span>
                </div>
                <p className="text-4xl font-bold text-white mb-1">{completedGames}</p>
                <p className="text-zinc-400 text-sm">Befejezett</p>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-gradient-to-br from-blue-900/20 to-zinc-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-12 h-12 text-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">Arány</span>
                </div>
                <p className="text-4xl font-bold text-white mb-1">
                  {totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0}%
                </p>
                <p className="text-zinc-400 text-sm">Befejezési Arány</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Combat Stats */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <Swords className="w-6 h-6 text-red-400" />
                    Harci Statisztikák
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                      <div className="flex items-center gap-3 mb-2">
                        <Swords className="w-8 h-8 text-red-400" />
                        <div>
                          <p className="text-2xl font-bold text-white">{totalBattles}</p>
                          <p className="text-zinc-400 text-sm">Összes Csata</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-8 h-8 text-blue-400" />
                        <div>
                          <p className="text-2xl font-bold text-white">{totalCards}</p>
                          <p className="text-zinc-400 text-sm">Összes Kártya</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="w-8 h-8 text-yellow-400" />
                        <div>
                          <p className="text-2xl font-bold text-white">{totalDecks}</p>
                          <p className="text-zinc-400 text-sm">Összes Pakli</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800">
                    <h3 className="text-white font-medium mb-3">Átlagok</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-sm">Csata / Játék</span>
                        <span className="text-white font-medium">
                          {totalGames > 0 ? (totalBattles / totalGames).toFixed(1) : 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-sm">Kártya / Játék</span>
                        <span className="text-white font-medium">
                          {totalGames > 0 ? (totalCards / totalGames).toFixed(1) : 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-sm">Pakli / Játék</span>
                        <span className="text-white font-medium">
                          {totalGames > 0 ? (totalDecks / totalGames).toFixed(1) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environment Stats */}
              <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <Target className="w-6 h-6 text-violet-400" />
                    Környezetek Szerinti Játékok
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(gamesByEnvironment).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(gamesByEnvironment).map(([envName, count]) => (
                        <div key={envName} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                          <span className="text-white font-medium">{envName}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-violet-500"
                                style={{ width: `${(count / totalGames) * 100}%` }}
                              />
                            </div>
                            <span className="text-zinc-400 text-sm min-w-[3rem] text-right">
                              {count} játék
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-500">Még nincsenek statisztikák</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Achievements & Progress */}
            <div className="space-y-6">
              <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Teljesítmények
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800 opacity-50">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-zinc-600" />
                        <div>
                          <p className="text-white font-medium text-sm">Első Győzelem</p>
                          <p className="text-zinc-500 text-xs">Zárt le az első csatádat</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800 opacity-50">
                      <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 text-zinc-600" />
                        <div>
                          <p className="text-white font-medium text-sm">Kártyagyűjtő</p>
                          <p className="text-zinc-500 text-xs">Szerezz 50 kártyát</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800 opacity-50">
                      <div className="flex items-center gap-3">
                        <Crown className="w-8 h-8 text-zinc-600" />
                        <div>
                          <p className="text-white font-medium text-sm">Mester</p>
                          <p className="text-zinc-500 text-xs">Fejezz be 10 játékot</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Előrehaladás
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-400 text-sm">Befejezett Játékok</span>
                      <span className="text-white text-sm font-medium">{completedGames}/{totalGames}</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${totalGames > 0 ? (completedGames / totalGames) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
