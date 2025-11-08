"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BattleArena from "@/components/battle/BattleArena";
import { 
  BarChart3, 
  TrendingUp,
  Trophy,
  Target,
  Swords,
  Crown,
  Play,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  Flame,
  Droplet,
  Wind,
  Mountain,
  Award,
  Zap,
  Heart,
  Users,
} from "lucide-react";

interface PlayerStats {
  id: string;
  userId: string;
  
  // Alapvető statisztikák
  totalGamesPlayed: number;
  totalBattlesPlayed: number;
  totalBattlesWon: number;
  totalBattlesLost: number;
  
  // Kazamata statisztikák
  totalDungeonsCompleted: number;
  simpleDungeonsCompleted: number;
  smallDungeonsCompleted: number;
  largeDungeonsCompleted: number;
  
  // Ütközet statisztikák
  totalClashes: number;
  totalClashesWon: number;
  totalClashesLost: number;
  clashesWonByDamage: number;
  clashesWonByType: number;
  clashesLostByDefault: number;
  
  // Sebzés és életerő
  totalDamageDealt: number;
  totalDamageTaken: number;
  highestDamageInClash: number;
  totalHealthUsed: number;
  
  // Kártya típus statisztikák
  fireCardWins: number;
  waterCardWins: number;
  earthCardWins: number;
  airCardWins: number;
  fireCardLosses: number;
  waterCardLosses: number;
  earthCardLosses: number;
  airCardLosses: number;
  
  // Gyűjtemény
  totalCardsCollected: number;
  totalCardUpgrades: number;
  totalDamageUpgrades: number;
  totalHealthUpgrades: number;
  
  // Teljesítmény
  currentWinStreak: number;
  longestWinStreak: number;
  currentLoseStreak: number;
  longestLoseStreak: number;
  
  // Idő
  totalPlayTimeMinutes: number;
  averageBattleTime: number;
  fastestBattleWin: number;
  
  // Pakli
  totalDecksCreated: number;
  
  // Környezet
  totalEnvironmentsPlayed: number;
  
  // Számított értékek
  winRate: number;
  clashWinRate: number;
  averageDamagePerClash: number;
  favoriteCardType: "FIRE" | "WATER" | "EARTH" | "AIR" | null;
  
  user?: {
    username: string;
    email: string;
    createdAt: string;
  };
}

interface Battle {
  id: string;
  status: "WON" | "LOST";
  playerWins: number;
  dungeonWins: number;
  createdAt: string;
  dungeon: {
    name: string;
    type: string;
  };
  game: {
    name: string;
  };
  clashes: Array<{
    order: number;
    winner: "PLAYER" | "DUNGEON";
    winReason: "DAMAGE" | "TYPE_ADVANTAGE" | "DEFAULT";
    playerDamage: number;
    playerHealth: number;
    playerCardName: string;
    playerCardType: "EARTH" | "AIR" | "WATER" | "FIRE";
    dungeonDamage: number;
    dungeonHealth: number;
    dungeonCardName: string;
    dungeonCardType: "EARTH" | "AIR" | "WATER" | "FIRE";
  }>;
}

export default function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [showReplay, setShowReplay] = useState(false);

  // Statisztikák a battles alapján (fallback, ha nincs még stats)
  const totalBattles = battles.length;
  const wonBattles = battles.filter(b => b.status === "WON").length;
  const winRate = totalBattles > 0 ? Math.round((wonBattles / totalBattles) * 100) : 0;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Betöltjük a statisztikákat
      const statsRes = await fetch("/api/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      // Lekérjük az összes játékot
      const gamesRes = await fetch("/api/game");
      const games = await gamesRes.json();

      // Minden játékhoz lekérjük a harcokat
      const allBattles: Battle[] = [];
      for (const game of games) {
        const battlesRes = await fetch(`/api/game/${game.id}/battle`);
        const gameBattles = await battlesRes.json();
        allBattles.push(...gameBattles);
      }

      // Rendezzük időrendben (legújabb elől)
      allBattles.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setBattles(allBattles);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplay = (battle: Battle) => {
    setSelectedBattle(battle);
    setShowReplay(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pt-24 px-4 md:px-8 pb-8">
          <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-white" />
              Statisztikák
            </h1>
            <p className="text-zinc-500">Részletes áttekintés a teljesítményedről és haladásodról</p>
          </div>

          {/* Tabs for different stat categories */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="overview">Áttekintés</TabsTrigger>
              <TabsTrigger value="battles">Harcok</TabsTrigger>
              <TabsTrigger value="cards">Kártyák</TabsTrigger>
              <TabsTrigger value="achievements">Teljesítmények</TabsTrigger>
              <TabsTrigger value="history">Történet</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-6">
              {/* Main Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Trophy className="w-8 h-8 text-yellow-500" />
                      <span className="text-zinc-500 text-sm font-medium">Győzelem</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {stats?.totalBattlesWon || wonBattles}
                    </p>
                    <p className="text-zinc-500 text-sm">Megnyert Harc</p>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-8 h-8 text-green-500" />
                      <span className="text-zinc-500 text-sm font-medium">Arány</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {stats?.winRate?.toFixed(1) || winRate}%
                    </p>
                    <p className="text-zinc-500 text-sm">Győzelmi Arány</p>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Swords className="w-8 h-8 text-purple-500" />
                      <span className="text-zinc-500 text-sm font-medium">Ütközetek</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {stats?.totalClashesWon || 0}
                    </p>
                    <p className="text-zinc-500 text-sm">Nyert Ütközetek</p>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Crown className="w-8 h-8 text-orange-500" />
                      <span className="text-zinc-500 text-sm font-medium">Rekord</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {stats?.longestWinStreak || 0}
                    </p>
                    <p className="text-zinc-500 text-sm">Leghosszabb Sorozat</p>
                  </CardContent>
                </Card>
              </div>

              {/* Dungeon Stats */}
              <Card className="border border-zinc-800 bg-zinc-900/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Kazamata Teljesítmények
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-white mb-1">
                        {stats?.simpleDungeonsCompleted || 0}
                      </p>
                      <p className="text-zinc-500 text-sm">Egyszerű Találkozó</p>
                    </div>
                    <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-white mb-1">
                        {stats?.smallDungeonsCompleted || 0}
                      </p>
                      <p className="text-zinc-500 text-sm">Kis Kazamata</p>
                    </div>
                    <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-white mb-1">
                        {stats?.largeDungeonsCompleted || 0}
                      </p>
                      <p className="text-zinc-500 text-sm">Nagy Kazamata</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Combat Stats */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Sebzés Statisztika
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Összes Sebzés:</span>
                      <span className="text-white font-bold">{stats?.totalDamageDealt || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Átlagos Sebzés:</span>
                      <span className="text-white font-bold">{stats?.averageDamagePerClash || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Legnagyobb Sebzés:</span>
                      <span className="text-white font-bold">{stats?.highestDamageInClash || 0}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Életenergia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Használt Életerő:</span>
                      <span className="text-white font-bold">{stats?.totalHealthUsed || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Elszenvedett Sebzés:</span>
                      <span className="text-white font-bold">{stats?.totalDamageTaken || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Battles Tab */}
            <TabsContent value="battles" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Swords className="w-8 h-8 text-zinc-400" />
                      <span className="text-zinc-500 text-sm font-medium">Összes</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {stats?.totalBattlesPlayed || totalBattles}
                    </p>
                    <p className="text-zinc-500 text-sm">Harc Összesen</p>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-8 h-8 text-green-500" />
                      <span className="text-zinc-500 text-sm font-medium">Ütközetek</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {stats?.clashWinRate?.toFixed(1) || 0}%
                    </p>
                    <p className="text-zinc-500 text-sm">Ütközet Arány</p>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Award className="w-8 h-8 text-yellow-500" />
                      <span className="text-zinc-500 text-sm font-medium">Sorozat</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {stats?.currentWinStreak || 0}
                    </p>
                    <p className="text-zinc-500 text-sm">Jelenlegi Sorozat</p>
                  </CardContent>
                </Card>
              </div>

              {/* Win Methods */}
              <Card className="border border-zinc-800 bg-zinc-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Győzelmi Módszerek</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-zinc-400">Sebzéssel</span>
                        <span className="text-white font-bold">{stats?.clashesWonByDamage || 0}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all" 
                          style={{ 
                            width: `${stats?.totalClashesWon ? (stats.clashesWonByDamage / stats.totalClashesWon * 100) : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-zinc-400">Típus Előnnyel</span>
                        <span className="text-white font-bold">{stats?.clashesWonByType || 0}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all" 
                          style={{ 
                            width: `${stats?.totalClashesWon ? (stats.clashesWonByType / stats.totalClashesWon * 100) : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cards Tab */}
            <TabsContent value="cards" className="space-y-4 mt-6">
              {/* Card Type Performance */}
              <Card className="border border-zinc-800 bg-zinc-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Kártya Típus Teljesítmény</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Fire */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="w-5 h-5 text-red-500" />
                        <span className="text-white font-bold">Tűz</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Győzelmek:</span>
                        <span className="text-green-400 font-bold">{stats?.fireCardWins || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Vereségek:</span>
                        <span className="text-red-400 font-bold">{stats?.fireCardLosses || 0}</span>
                      </div>
                    </div>

                    {/* Water */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplet className="w-5 h-5 text-blue-500" />
                        <span className="text-white font-bold">Víz</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Győzelmek:</span>
                        <span className="text-green-400 font-bold">{stats?.waterCardWins || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Vereségek:</span>
                        <span className="text-red-400 font-bold">{stats?.waterCardLosses || 0}</span>
                      </div>
                    </div>

                    {/* Earth */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Mountain className="w-5 h-5 text-amber-600" />
                        <span className="text-white font-bold">Föld</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Győzelmek:</span>
                        <span className="text-green-400 font-bold">{stats?.earthCardWins || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Vereségek:</span>
                        <span className="text-red-400 font-bold">{stats?.earthCardLosses || 0}</span>
                      </div>
                    </div>

                    {/* Air */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-5 h-5 text-cyan-400" />
                        <span className="text-white font-bold">Levegő</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Győzelmek:</span>
                        <span className="text-green-400 font-bold">{stats?.airCardWins || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Vereségek:</span>
                        <span className="text-red-400 font-bold">{stats?.airCardLosses || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Collection Stats */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle className="text-white">Gyűjtemény</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Összegyűjtött:</span>
                      <span className="text-white font-bold">{stats?.totalCardsCollected || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Fejlesztések:</span>
                      <span className="text-white font-bold">{stats?.totalCardUpgrades || 0}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle className="text-white">Fejlesztések</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Sebzés +:</span>
                      <span className="text-white font-bold">{stats?.totalDamageUpgrades || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Életerő +:</span>
                      <span className="text-white font-bold">{stats?.totalHealthUpgrades || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Sorozat Rekordok
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Leghosszabb Győzelmi:</span>
                      <span className="text-green-400 font-bold">{stats?.longestWinStreak || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Jelenlegi Győzelmi:</span>
                      <span className="text-white font-bold">{stats?.currentWinStreak || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Leghosszabb Vesztes:</span>
                      <span className="text-red-400 font-bold">{stats?.longestLoseStreak || 0}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      Játék Tevékenység
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Összes Játék:</span>
                      <span className="text-white font-bold">{stats?.totalGamesPlayed || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Paklik Létrehozva:</span>
                      <span className="text-white font-bold">{stats?.totalDecksCreated || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Környezetek:</span>
                      <span className="text-white font-bold">{stats?.totalEnvironmentsPlayed || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Favorite Card Type */}
              {stats?.favoriteCardType && (
                <Card className="border border-zinc-800 bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle className="text-white">Kedvenc Kártya Típus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center gap-4 py-8">
                      {stats.favoriteCardType === "FIRE" && (
                        <>
                          <Flame className="w-16 h-16 text-red-500" />
                          <div>
                            <p className="text-3xl font-bold text-white">Tűz</p>
                            <p className="text-zinc-400">Legtöbb győzelem</p>
                          </div>
                        </>
                      )}
                      {stats.favoriteCardType === "WATER" && (
                        <>
                          <Droplet className="w-16 h-16 text-blue-500" />
                          <div>
                            <p className="text-3xl font-bold text-white">Víz</p>
                            <p className="text-zinc-400">Legtöbb győzelem</p>
                          </div>
                        </>
                      )}
                      {stats.favoriteCardType === "EARTH" && (
                        <>
                          <Mountain className="w-16 h-16 text-amber-600" />
                          <div>
                            <p className="text-3xl font-bold text-white">Föld</p>
                            <p className="text-zinc-400">Legtöbb győzelem</p>
                          </div>
                        </>
                      )}
                      {stats.favoriteCardType === "AIR" && (
                        <>
                          <Wind className="w-16 h-16 text-cyan-400" />
                          <div>
                            <p className="text-3xl font-bold text-white">Levegő</p>
                            <p className="text-zinc-400">Legtöbb győzelem</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-6">
              <Card className="border border-zinc-800 bg-zinc-900/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <Swords className="w-6 h-6 text-white" />
                    Összes Harc ({totalBattles})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {battles.length === 0 ? (
                    <div className="text-center py-12">
                      <Swords className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-500 text-lg mb-2">Még nincsenek harcaid</p>
                      <p className="text-zinc-600 text-sm">Indíts egy harcot a &quot;Játékok&quot; menüpontban!</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-3">
                        {battles.map((battle) => (
                          <Card
                            key={battle.id}
                            className="border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    {battle.status === "WON" ? (
                                      <CheckCircle2 className="w-5 h-5 text-white" />
                                    ) : (
                                      <XCircle className="w-5 h-5 text-white" />
                                    )}
                                    <div>
                                      <h3 className="font-bold text-white text-lg">
                                        {battle.dungeon.name}
                                      </h3>
                                      <p className="text-zinc-500 text-sm">
                                        {battle.game.name}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 text-sm">
                                    <Badge
                                      variant="outline"
                                      className="bg-zinc-800 text-white border-zinc-700"
                                    >
                                      {battle.status === "WON" ? "GYŐZELEM" : "VERESÉG"}
                                    </Badge>
                                    <span className="text-zinc-500">
                                      <Trophy className="w-4 h-4 inline mr-1" />
                                      {battle.playerWins} - {battle.dungeonWins}
                                    </span>
                                    <span className="text-zinc-500">
                                      <Calendar className="w-4 h-4 inline mr-1" />
                                      {formatDate(battle.createdAt)}
                                    </span>
                                  </div>
                                </div>

                                <Button
                                  onClick={() => handleReplay(battle)}
                                  variant="outline"
                                  className="border-zinc-700 hover:bg-zinc-800"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Replay
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Replay Dialog */}
      <Dialog open={showReplay} onOpenChange={setShowReplay}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-2xl">
              Harc Replay - {selectedBattle?.dungeon.name}
            </DialogTitle>
          </DialogHeader>

          {selectedBattle && selectedBattle.clashes && selectedBattle.clashes.length > 0 && (
            <BattleArena
              clashes={selectedBattle.clashes}
              playerWins={selectedBattle.playerWins}
              dungeonWins={selectedBattle.dungeonWins}
              onComplete={() => {
                setShowReplay(false);
                setSelectedBattle(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
