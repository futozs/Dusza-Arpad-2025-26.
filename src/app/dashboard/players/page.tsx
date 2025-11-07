"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Calendar, Trophy, TrendingUp, Loader2 } from "lucide-react";
import debounce from "lodash/debounce";

interface PlayerSearchResult {
  id: string;
  username: string;
  memberSince: string;
  totalGames: number;
  stats: {
    totalBattles: number;
    wonBattles: number;
    lostBattles: number;
    winRate: number;
  };
}

export default function PlayerSearchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState<PlayerSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Debounced keresés
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchPlayers = useCallback(
    debounce(async (query: string) => {
      if (query.trim().length === 0) {
        setPlayers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/players/search?query=${encodeURIComponent(query)}&limit=20`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Hiba történt a keresés során");
        }

        setPlayers(data.players);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ismeretlen hiba");
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    searchPlayers(searchQuery);
  }, [searchQuery, searchPlayers]);

  const handleViewProfile = (username: string) => {
    router.push(`/dashboard/players/${username}`);
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="pt-24 px-4 flex items-center justify-center min-h-screen">
          <div className="text-white">Betöltés...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Játékos Keresés</h1>
            <p className="text-zinc-400">
              Keress más játékosokat és nézd meg a statisztikáikat
            </p>
          </div>

          {/* Keresés */}
          <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Keresés felhasználónév alapján..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Hibaüzenet */}
          {error && (
            <Card className="border border-red-900/50 bg-red-950/20 mb-6">
              <CardContent className="p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Betöltés */}
          {loading && (
            <Card className="border border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                <span className="ml-3 text-zinc-400">Keresés...</span>
              </CardContent>
            </Card>
          )}

          {/* Eredmények */}
          {!loading && searchQuery.trim().length > 0 && players.length === 0 && (
            <Card className="border border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-8 text-center">
                <User className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400">
                  Nincs találat &ldquo;{searchQuery}&rdquo; keresésre
                </p>
              </CardContent>
            </Card>
          )}

          {!loading && players.length > 0 && (
            <div className="space-y-3">
              {players.map((player) => (
                <Card
                  key={player.id}
                  className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/70 transition-all cursor-pointer"
                  onClick={() => handleViewProfile(player.username)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-purple-500/10">
                            <User className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {player.username}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Regisztráció:{" "}
                                {new Date(player.memberSince).toLocaleDateString(
                                  "hu-HU"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                            <div className="flex items-center gap-2 mb-1">
                              <Trophy className="w-4 h-4 text-amber-400" />
                              <span className="text-xs text-zinc-400">
                                Győzelmek
                              </span>
                            </div>
                            <p className="text-lg font-bold text-white">
                              {player.stats.wonBattles}
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                              <span className="text-xs text-zinc-400">
                                Győzelmi arány
                              </span>
                            </div>
                            <p className="text-lg font-bold text-white">
                              {player.stats.winRate}%
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                            <div className="flex items-center gap-2 mb-1">
                              <Trophy className="w-4 h-4 text-zinc-400" />
                              <span className="text-xs text-zinc-400">
                                Összes harc
                              </span>
                            </div>
                            <p className="text-lg font-bold text-white">
                              {player.stats.totalBattles}
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-purple-400" />
                              <span className="text-xs text-zinc-400">
                                Játékok
                              </span>
                            </div>
                            <p className="text-lg font-bold text-white">
                              {player.totalGames}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="ml-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProfile(player.username);
                        }}
                      >
                        Profil megtekintése
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info ha nincs keresés */}
          {!loading && searchQuery.trim().length === 0 && (
            <Card className="border border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400 mb-2">
                  Kezdj el gépelni a kereséshez
                </p>
                <p className="text-sm text-zinc-500">
                  Csak publikus profillal rendelkező játékosok jelennek meg
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
