import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@/generated/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import { 
  Gamepad2, 
  TrendingUp, 
  Trophy, 
  Clock, 
  Target,
  Play,
  Users,
  Swords,
  Shield,
  Crown,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  // Játékos statisztikák lekérése
  const games = await prisma.game.findMany({
    where: { userId: session.user.id },
    include: {
      environment: {
        include: {
          dungeons: true,
        },
      },
      battles: {
        include: {
          dungeon: true,
        },
      },
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

  // Számoljuk ki a befejezett játékokat (ahol minden kazamata le van győzve)
  const gamesWithCompletion = games.map(game => {
    const totalDungeons = game.environment.dungeons.length;
    const wonDungeons = game.battles.filter(b => b.status === 'WON').map(b => b.dungeonId);
    const uniqueWonDungeons = new Set(wonDungeons).size;
    const isCompleted = totalDungeons > 0 && uniqueWonDungeons === totalDungeons;
    return { ...game, isCompleted };
  });

  const activeGames = gamesWithCompletion.filter(g => !g.isCompleted).length;
  const completedGames = gamesWithCompletion.filter(g => g.isCompleted).length;
  const totalBattles = games.reduce((sum, g) => sum + g._count.battles, 0);

  // Legutóbbi csaták lekérése
  const recentBattles = await prisma.battle.findMany({
    where: {
      gameId: { in: games.map(g => g.id) },
      status: { in: ['WON', 'LOST'] },
    },
    include: {
      game: true,
      dungeon: true,
      deck: true,
    },
    orderBy: { updatedAt: 'desc' },
    take: 5,
  });

  return (
    <DashboardLayout>
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">

          {/* Welcome Section */}
          <div className="relative mb-12">
            <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Üdvözöllek, <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{session.user.username}</span>!
                  </h1>
                </div>
                <p className="text-zinc-400 text-lg">
                  Készen állsz a következő kalandra? Indíts új játékot vagy folytasd, ahol abbahagytad!
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-purple-500/30 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Gamepad2 className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{activeGames}</p>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm">Aktív Játék</p>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-violet-500/30 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-8 h-8 text-violet-400 group-hover:scale-110 transition-transform" />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{completedGames}</p>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm">Befejezett</p>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-fuchsia-500/30 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Swords className="w-8 h-8 text-fuchsia-400 group-hover:scale-110 transition-transform" />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{totalBattles}</p>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm">Összes Csata</p>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Crown className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{games.length}</p>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm">Összes Játék</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Aktív Játékok */}
          <div className="space-y-6">
            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <Play className="w-6 h-6 text-purple-400" />
                    Aktív Játékok
                  </CardTitle>
                  <div className="flex gap-3">
                    <Link href="/dashboard/games/new">
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                        Új játék
                      </Button>
                    </Link>
                    <Link href="/dashboard/games">
                      <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white">
                        Összes megtekintése
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gamesWithCompletion.slice(0, 3).map((game) => (
                    <Link key={game.id} href={`/dashboard/games/${game.id}`}>
                        <div className="group p-4 rounded-xl border border-zinc-800 hover:border-purple-500/30 bg-zinc-950/50 hover:bg-zinc-950/80 transition-all cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-lg ${game.isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gradient-to-br from-purple-500 to-violet-500'} flex items-center justify-center`}>
                                {game.isCompleted ? (
                                  <Trophy className="w-6 h-6 text-white" />
                                ) : (
                                  <Gamepad2 className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors flex items-center gap-2">
                                  {game.name}
                                  {game.isCompleted && (
                                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                      Befejezett
                                    </span>
                                  )}
                                </h3>
                                <p className="text-zinc-500 text-sm flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  {game.environment.name}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-zinc-400 text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(game.updatedAt).toLocaleDateString('hu-HU')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-1 text-zinc-400">
                              <Swords className="w-4 h-4" />
                              <span>{game._count.battles} csata</span>
                            </div>
                            <div className="flex items-center gap-1 text-zinc-400">
                              <Shield className="w-4 h-4" />
                              <span>{game._count.playerCards} kártya</span>
                            </div>
                            <div className="flex items-center gap-1 text-zinc-400">
                              <Users className="w-4 h-4" />
                              <span>{game._count.decks} pakli</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}

                    {games.length === 0 && (
                      <div className="text-center py-12">
                        <Gamepad2 className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500 mb-4">Még nincs aktív játékod</p>
                        <Link href="/dashboard/games/new">
                          <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white">
                            Új játék indítása
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Legutóbbi Eredmények */}
              <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-violet-400" />
                    Legutóbbi Kazamata Harcok
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentBattles.length > 0 ? (
                    <div className="space-y-3">
                      {recentBattles.map((battle) => (
                        <Link key={battle.id} href={`/dashboard/games/${battle.gameId}`}>
                          <div className="group p-4 rounded-xl border border-zinc-800 hover:border-violet-500/30 bg-zinc-950/50 hover:bg-zinc-950/80 transition-all cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${
                                  battle.playerWins > battle.dungeonWins 
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                                    : battle.playerWins === battle.dungeonWins 
                                    ? 'bg-gradient-to-br from-yellow-500 to-amber-500' 
                                    : 'bg-gradient-to-br from-red-500 to-rose-500'
                                } flex items-center justify-center`}>
                                  {battle.playerWins > battle.dungeonWins ? (
                                    <Trophy className="w-5 h-5 text-white" />
                                  ) : battle.playerWins === battle.dungeonWins ? (
                                    <Swords className="w-5 h-5 text-white" />
                                  ) : (
                                    <Swords className="w-5 h-5 text-white" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-white font-medium group-hover:text-violet-300 transition-colors">
                                    {battle.dungeon.name}
                                  </h4>
                                  <p className="text-zinc-500 text-sm">
                                    {battle.game.name} • {
                                      battle.playerWins > battle.dungeonWins 
                                        ? 'Győzelem' 
                                        : battle.playerWins === battle.dungeonWins 
                                        ? 'Döntetlen' 
                                        : 'Vereség'
                                    }
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-sm font-semibold ${
                                    battle.playerWins > battle.dungeonWins 
                                      ? 'text-green-400' 
                                      : battle.playerWins === battle.dungeonWins 
                                      ? 'text-yellow-400' 
                                      : 'text-red-400'
                                  }`}>
                                    {battle.playerWins} - {battle.dungeonWins}
                                  </span>
                                </div>
                                <p className="text-zinc-500 text-xs">
                                  {new Date(battle.updatedAt).toLocaleDateString('hu-HU', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-500">Még nem játszottál egyetlen kazamata harcot sem</p>
                      <p className="text-zinc-600 text-sm mt-2">Indíts egy játékot és vívd meg az első csatádat!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
