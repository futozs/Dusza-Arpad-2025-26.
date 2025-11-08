"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
} from "lucide-react";

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
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [showReplay, setShowReplay] = useState(false);

  // Statisztikák
  const totalBattles = battles.length;
  const wonBattles = battles.filter(b => b.status === "WON").length;
  const lostBattles = battles.filter(b => b.status === "LOST").length;
  const winRate = totalBattles > 0 ? Math.round((wonBattles / totalBattles) * 100) : 0;

  useEffect(() => {
    loadBattles();
  }, []);

  const loadBattles = async () => {
    try {
      setLoading(true);
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
      console.error("Failed to load battles:", error);
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
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
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
              <BarChart3 className="w-10 h-10 text-purple-400" />
              Harc Statisztikák
            </h1>
            <p className="text-zinc-400">Tekintsd meg az összes harcod és játszd újra őket!</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="border border-zinc-800 bg-gradient-to-br from-purple-900/20 to-zinc-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Swords className="w-12 h-12 text-purple-400" />
                  <span className="text-purple-400 text-sm font-medium">Összes</span>
                </div>
                <p className="text-4xl font-bold text-white mb-1">{totalBattles}</p>
                <p className="text-zinc-400 text-sm">Harc Összesen</p>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-gradient-to-br from-green-900/20 to-zinc-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-12 h-12 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Győzelem</span>
                </div>
                <p className="text-4xl font-bold text-white mb-1">{wonBattles}</p>
                <p className="text-zinc-400 text-sm">Megnyert Harc</p>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-gradient-to-br from-red-900/20 to-zinc-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <XCircle className="w-12 h-12 text-red-400" />
                  <span className="text-red-400 text-sm font-medium">Vereség</span>
                </div>
                <p className="text-4xl font-bold text-white mb-1">{lostBattles}</p>
                <p className="text-zinc-400 text-sm">Elvesztett Harc</p>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-gradient-to-br from-yellow-900/20 to-zinc-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-12 h-12 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">Arány</span>
                </div>
                <p className="text-4xl font-bold text-white mb-1">{winRate}%</p>
                <p className="text-zinc-400 text-sm">Győzelmi Arány</p>
              </CardContent>
            </Card>
          </div>

          {/* Battles List */}
          <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Swords className="w-6 h-6 text-red-400" />
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
                        className={`border-2 transition-all cursor-pointer hover:scale-[1.01] ${
                          battle.status === "WON"
                            ? "border-green-500/30 bg-green-500/5 hover:border-green-500/50"
                            : "border-red-500/30 bg-red-500/5 hover:border-red-500/50"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {battle.status === "WON" ? (
                                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                                ) : (
                                  <XCircle className="w-6 h-6 text-red-400" />
                                )}
                                <div>
                                  <h3 className="font-bold text-white text-lg">
                                    {battle.dungeon.name}
                                  </h3>
                                  <p className="text-zinc-400 text-sm">
                                    {battle.game.name}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm">
                                <Badge
                                  className={
                                    battle.status === "WON"
                                      ? "bg-green-500/20 text-green-400 border-green-500/50"
                                      : "bg-red-500/20 text-red-400 border-red-500/50"
                                  }
                                >
                                  {battle.status === "WON" ? "GYŐZELEM" : "VERESÉG"}
                                </Badge>
                                <span className="text-zinc-400">
                                  <Trophy className="w-4 h-4 inline mr-1" />
                                  {battle.playerWins} - {battle.dungeonWins}
                                </span>
                                <span className="text-zinc-400">
                                  <Calendar className="w-4 h-4 inline mr-1" />
                                  {formatDate(battle.createdAt)}
                                </span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleReplay(battle)}
                              className="bg-gradient-to-r from-purple-500 to-violet-500"
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
        </div>
      </div>

      {/* Replay Dialog */}
      <Dialog open={showReplay} onOpenChange={setShowReplay}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-2xl">
              <span className="bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
                Harc Replay - {selectedBattle?.dungeon.name}
              </span>
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
