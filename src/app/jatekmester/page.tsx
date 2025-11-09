import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Globe, 
  Layers, 
  Crown, 
  Castle, 
  Users, 
  BarChart3, 
  ShieldAlert,
  TrendingUp,
  Activity
} from "lucide-react";
import TwoFactorSetupButton from "@/components/TwoFactorSetupButton";
import { prisma } from "@/lib/prisma";

export default async function JatekmesterDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login/jatekmester");
  }

  // Role check - csak JATEKMESTER férhet hozzá
  if (session.user.role !== "JATEKMESTER") {
    redirect("/dashboard");
  }

  // Statisztikák lekérése
  const [
    environmentsCount,
    worldCardsCount,
    leaderCardsCount,
    dungeonsCount,
    usersCount,
    activeUsersCount,
    gamesCount,
    activeBattlesCount
  ] = await Promise.all([
    prisma.environment.count(),
    prisma.worldCard.count(),
    prisma.leaderCard.count(),
    prisma.dungeon.count(),
    prisma.user.count(),
    prisma.user.count({ where: { emailVerified: true } }),
    prisma.game.count(),
    prisma.battle.count({ where: { status: "IN_PROGRESS" } })
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Glass Effect */}
        <div className="relative mb-12">
          {/* Decorative Background Blur */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          
          <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl" />
                  <div className="relative p-4 bg-zinc-900 rounded-2xl border border-red-500/30">
                    <ShieldCheck className="w-10 h-10 text-red-500" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Játékmester Panel
                  </h1>
                  <p className="text-zinc-400 mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-white font-medium">{session.user.username}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-500 text-sm">Online</span>
                  </p>
                </div>
              </div>
              
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all"
                >
                  Játékos nézet
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Környezetek</p>
                <p className="text-2xl font-bold text-white">{environmentsCount}</p>
              </div>
              <Globe className="w-8 h-8 text-blue-500/50 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 hover:border-purple-500/30 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Világkártyák</p>
                <p className="text-2xl font-bold text-white">{worldCardsCount}</p>
              </div>
              <Layers className="w-8 h-8 text-purple-500/50 group-hover:text-purple-500 transition-colors" />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 hover:border-yellow-500/30 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Vezérkártyák</p>
                <p className="text-2xl font-bold text-white">{leaderCardsCount}</p>
              </div>
              <Crown className="w-8 h-8 text-yellow-500/50 group-hover:text-yellow-500 transition-colors" />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 hover:border-red-500/30 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Börtönök</p>
                <p className="text-2xl font-bold text-white">{dungeonsCount}</p>
              </div>
              <Castle className="w-8 h-8 text-red-500/50 group-hover:text-red-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 hover:border-cyan-500/30 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Felhasználók</p>
                <p className="text-2xl font-bold text-white">{usersCount}</p>
                <p className="text-xs text-zinc-500 mt-1">{activeUsersCount} aktív</p>
              </div>
              <Users className="w-8 h-8 text-cyan-500/50 group-hover:text-cyan-500 transition-colors" />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 hover:border-green-500/30 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Játékok össz.</p>
                <p className="text-2xl font-bold text-white">{gamesCount}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500/50 group-hover:text-green-500 transition-colors" />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 hover:border-orange-500/30 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Aktív csaták</p>
                <p className="text-2xl font-bold text-white">{activeBattlesCount}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500/50 group-hover:text-orange-500 transition-colors" />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Össz. kártya</p>
                <p className="text-2xl font-bold text-white">{worldCardsCount + leaderCardsCount}</p>
                <p className="text-xs text-zinc-500 mt-1">{worldCardsCount}+{leaderCardsCount}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
            </div>
          </div>
        </div>



        {/* Admin Actions Grid - Modern Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Játékkörnyezetek */}
          <Link href="/jatekmester/environments" className="group">
            <Card className="relative overflow-hidden border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50 transition-all duration-300 h-full hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-300" />
              <CardHeader>
                <div className="flex items-center justify-between relative z-10">
                  <CardTitle className="text-white flex items-center gap-3 text-lg">
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                      <Globe className="w-5 h-5 text-blue-500" />
                    </div>
                    Játékkörnyezetek
                  </CardTitle>
                  <div className="w-2 h-2 bg-blue-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-zinc-400 text-sm">Világok létrehozása és kezelése</p>
              </CardContent>
            </Card>
          </Link>

          {/* Világkártyák */}
          <Link href="/jatekmester/world-cards" className="group">
            <Card className="relative overflow-hidden border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50 transition-all duration-300 h-full hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all duration-300" />
              <CardHeader>
                <div className="flex items-center justify-between relative z-10">
                  <CardTitle className="text-white flex items-center gap-3 text-lg">
                    <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                      <Layers className="w-5 h-5 text-purple-500" />
                    </div>
                    Világkártyák
                  </CardTitle>
                  <div className="w-2 h-2 bg-purple-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-zinc-400 text-sm">Alap kártyák adminisztrálása</p>
              </CardContent>
            </Card>
          </Link>

          {/* Vezérkártyák */}
          <Link href="/jatekmester/leader-cards" className="group">
            <Card className="relative overflow-hidden border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50 transition-all duration-300 h-full hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all duration-300" />
              <CardHeader>
                <div className="flex items-center justify-between relative z-10">
                  <CardTitle className="text-white flex items-center gap-3 text-lg">
                    <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                      <Crown className="w-5 h-5 text-amber-500" />
                    </div>
                    Vezérkártyák
                  </CardTitle>
                  <div className="w-2 h-2 bg-amber-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-zinc-400 text-sm">Vezérkártyák származtatása</p>
              </CardContent>
            </Card>
          </Link>

          {/* Kazamaták */}
          <Link href="/jatekmester/dungeons" className="group">
            <Card className="relative overflow-hidden border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50 transition-all duration-300 h-full hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-all duration-300" />
              <CardHeader>
                <div className="flex items-center justify-between relative z-10">
                  <CardTitle className="text-white flex items-center gap-3 text-lg">
                    <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                      <Castle className="w-5 h-5 text-red-500" />
                    </div>
                    Kazamaták
                  </CardTitle>
                  <div className="w-2 h-2 bg-red-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-zinc-400 text-sm">Kihívások összeállítása</p>
              </CardContent>
            </Card>
          </Link>

          {/* Felhasználók */}
          <Link href="/jatekmester/users" className="group">
            <Card className="relative overflow-hidden border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50 transition-all duration-300 h-full hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all duration-300" />
              <CardHeader>
                <div className="flex items-center justify-between relative z-10">
                  <CardTitle className="text-white flex items-center gap-3 text-lg">
                    <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                      <Users className="w-5 h-5 text-cyan-500" />
                    </div>
                    Felhasználók
                  </CardTitle>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-zinc-400 text-sm">Felhasználók kezelése</p>
              </CardContent>
            </Card>
          </Link>

          {/* Statisztikák */}
          <Card className="relative overflow-hidden border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-50" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />
            <CardHeader>
              <div className="flex items-center justify-between relative z-10">
                <CardTitle className="text-white flex items-center gap-3 text-lg">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                  </div>
                  Statisztikák
                </CardTitle>
                <div className="w-2 h-2 bg-green-500 rounded-full opacity-50" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Össz. elem:</span>
                  <span className="text-white font-semibold">
                    {environmentsCount + worldCardsCount + leaderCardsCount + dungeonsCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Aktív játékosok:</span>
                  <span className="text-white font-semibold">{activeUsersCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Folyó csaták:</span>
                  <span className="text-white font-semibold">{activeBattlesCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>

        {/* Security Notice */}
        {!session.user.twoFactorEnabled && (
          <Card className="relative overflow-hidden border border-yellow-500/30 bg-zinc-900/50 backdrop-blur-sm mt-8">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
            <CardHeader>
              <CardTitle className="text-yellow-500 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                Biztonsági figyelmeztetés
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-zinc-300 mb-4">
                Admin fiók esetén erősen ajánlott a kétfaktoros hitelesítés (2FA) beállítása a fokozott biztonság érdekében.
              </p>
              <TwoFactorSetupButton 
                isEnabled={false}
                variant="default"
                className="bg-yellow-600 hover:bg-yellow-700"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
