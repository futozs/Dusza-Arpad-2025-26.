"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Skull, Swords, TrendingUp, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BattleArena from "@/components/battle/BattleArena";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CardType = "EARTH" | "AIR" | "WATER" | "FIRE";

interface Clash {
  order: number;
  winner: "PLAYER" | "DUNGEON";
  winReason: "DAMAGE" | "TYPE_ADVANTAGE" | "DEFAULT";
  playerDamage: number;
  playerHealth: number;
  playerCardName: string;
  playerCardType: CardType;
  dungeonDamage: number;
  dungeonHealth: number;
  dungeonCardName: string;
  dungeonCardType: CardType;
}

interface Battle {
  id: string;
  status: "IN_PROGRESS" | "WON" | "LOST";
  playerWins: number;
  dungeonWins: number;
  createdAt: string;
  dungeon: {
    name: string;
    type: string;
  };
  clashes: Clash[];
}

interface Game {
  id: string;
  name: string;
}

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;

  const [game, setGame] = useState<Game | null>(null);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [replayBattle, setReplayBattle] = useState<Battle | null>(null);
  const [showReplay, setShowReplay] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Játék adatok
        const gameRes = await fetch(`/api/game`);
        const games = await gameRes.json();
        const currentGame = games.find((g: Game) => g.id === gameId);
        setGame(currentGame || null);

        // Harcok lekérése
        const battlesRes = await fetch(`/api/game/${gameId}/battle`);
        const battlesData = await battlesRes.json();
        setBattles(battlesData || []);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
      setLoading(false);
    };

    loadData();
  }, [gameId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pt-24 px-4 md:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-white">Betöltés...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!game) {
    return null;
  }

  const totalBattles = battles.length;
  const wonBattles = battles.filter((b) => b.status === "WON").length;
  const lostBattles = battles.filter((b) => b.status === "LOST").length;
  const winRate = totalBattles > 0 ? ((wonBattles / totalBattles) * 100).toFixed(1) : "0";

  return (
    <DashboardLayout>
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4 text-zinc-400 hover:text-white"
              onClick={() => router.push(`/dashboard/games/${gameId}/play`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vissza a játékhoz
            </Button>

            <h1 className="text-4xl font-bold text-white mb-2">
              📊 Statisztikák
            </h1>
            <p className="text-zinc-400">{game.name}</p>
          </div>

          {/* Statisztikák összefoglaló */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Swords className="w-5 h-5 text-purple-400" />
                  Összes harc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{totalBattles}</p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-green-900/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="w-5 h-5 text-green-400" />
                  Győzelmek
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-400">{wonBattles}</p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-red-900/20 border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Skull className="w-5 h-5 text-red-400" />
                  Vereségek
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-red-400">{lostBattles}</p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-purple-900/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Győzelmi arány
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-purple-400">{winRate}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Harcok története */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Harcok története</CardTitle>
            </CardHeader>
            <CardContent>
              {battles.length === 0 ? (
                <p className="text-zinc-400 text-center py-8">
                  Még nem vívtál harcot. Kezdd el a kalandot!
                </p>
              ) : (
                <div className="space-y-3">
                  {battles.map((battle) => (
                    <Card
                      key={battle.id}
                      className={`border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                        battle.status === "WON"
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-red-500/50 bg-red-500/10"
                      }`}
                      onClick={() => {
                        setReplayBattle(battle);
                        setShowReplay(true);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge
                              className={
                                battle.status === "WON"
                                  ? "bg-green-500/20 text-green-400 border-green-500/50"
                                  : "bg-red-500/20 text-red-400 border-red-500/50"
                              }
                            >
                              {battle.status === "WON" ? (
                                <Trophy className="w-4 h-4 mr-1" />
                              ) : (
                                <Skull className="w-4 h-4 mr-1" />
                              )}
                              {battle.status === "WON" ? "GYŐZELEM" : "VERESÉG"}
                            </Badge>
                            <div>
                              <p className="font-bold text-white">
                                {battle.dungeon.name}
                              </p>
                              <p className="text-sm text-zinc-400">
                                {new Date(battle.createdAt).toLocaleString("hu-HU")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-zinc-400">Eredmény</p>
                              <p className="text-lg font-bold text-white">
                                {battle.playerWins} - {battle.dungeonWins}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-purple-500/50 text-purple-400"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Újrajátszás
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                Harc Újrajátszása
              </span>
            </DialogTitle>
          </DialogHeader>

          {replayBattle && replayBattle.clashes && (
            <BattleArena
              clashes={replayBattle.clashes}
              playerWins={replayBattle.playerWins}
              dungeonWins={replayBattle.dungeonWins}
              onComplete={() => setShowReplay(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
