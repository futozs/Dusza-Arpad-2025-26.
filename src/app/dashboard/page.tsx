import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@/generated/prisma";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
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
    redirect("/login");
  }

  // Játékos statisztikák lekérése
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

  const activeGames = games.length; // Jelenleg nincs status mező
  const completedGames = 0; // Jelenleg nincs status mező
  const totalBattles = games.reduce((sum, g) => sum + g._count.battles, 0);

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
                  <Link href="/dashboard/games">
                    <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white">
                      Összes megtekintése
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {games.slice(0, 3).map((game) => (
                  <Link key={game.id} href={`/dashboard/games/${game.id}`}>
                      <div className="group p-4 rounded-xl border border-zinc-800 hover:border-purple-500/30 bg-zinc-950/50 hover:bg-zinc-950/80 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                              <Gamepad2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                                {game.name}
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
                </CardContent>
              </Card>

              {/* Legutóbbi Eredmények */}
              <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-violet-400" />
                    Legutóbbi Eredmények
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Trophy className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500">Itt jelennek meg a legutóbbi csatáid eredményei</p>
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
