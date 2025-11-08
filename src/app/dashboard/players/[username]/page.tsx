"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  Trophy,
  TrendingUp,
  TrendingDown,
  Loader2,
  ArrowLeft,
  Flame,
  Droplet,
  Wind,
  Mountain,
  Swords,
  Heart,
  Clock,
  Star,
  LucideIcon,
} from "lucide-react";
import { CardType } from "@/generated/prisma";

interface PlayerProfile {
  player: {
    username: string;
    memberSince: string;
    isOwn: boolean;
  };
  statistics: {
    totalGames: number;
    totalBattles: number;
    wonBattles: number;
    lostBattles: number;
    inProgressBattles: number;
    winRate: number;
    dungeonTypeWins: {
      SIMPLE_ENCOUNTER: number;
      SMALL_DUNGEON: number;
      LARGE_DUNGEON: number;
    };
    favoriteEnvironment: string | null;
  };
  recentBattles: Array<{
    dungeonName: string;
    dungeonType: string;
    status: string;
    date: string;
  }>;
  topCards: Array<{
    name: string;
    baseDamage: number;
    baseHealth: number;
    type: CardType;
    totalDamage: number;
    totalHealth: number;
    damageBoost: number;
    healthBoost: number;
    totalPower: number;
  }>;
  cardTypeDistribution: Record<CardType, number>;
}

const CARD_TYPE_ICONS: Record<CardType, LucideIcon> = {
  FIRE: Flame,
  WATER: Droplet,
  AIR: Wind,
  EARTH: Mountain,
};

const CARD_TYPE_COLORS: Record<CardType, string> = {
  FIRE: "text-red-400 bg-red-500/10 border-red-500/30",
  WATER: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  AIR: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  EARTH: "text-amber-600 bg-amber-500/10 border-amber-500/30",
};

const CARD_TYPE_NAMES: Record<CardType, string> = {
  FIRE: "Tűz",
  WATER: "Víz",
  AIR: "Levegő",
  EARTH: "Föld",
};

const DUNGEON_TYPE_NAMES: Record<string, string> = {
  SIMPLE_ENCOUNTER: "Egyszerű találkozás",
  SMALL_DUNGEON: "Kis kazamata",
  LARGE_DUNGEON: "Nagy kazamata",
};

const BATTLE_STATUS_NAMES: Record<string, string> = {
  WON: "Győzelem",
  LOST: "Vereség",
  DRAW: "Döntetlen",
  IN_PROGRESS: "Folyamatban",
};

export default function PlayerProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated" && username) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, username]);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/players/${encodeURIComponent(username)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Hiba történt a profil betöltése során");
      }

      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ismeretlen hiba");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="pt-24 px-4 flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="pt-24 px-4 md:px-8 pb-8">
          <div className="max-w-5xl mx-auto">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/players")}
              className="mb-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vissza
            </Button>
            <Card className="border border-red-900/50 bg-red-950/20">
              <CardContent className="p-8 text-center">
                <p className="text-red-400">{error}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="pt-24 px-4 md:px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/players")}
            className="mb-6 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Vissza a kereséshez
          </Button>

          {/* Header */}
          <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-6">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <User className="w-12 h-12 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {profile.player.username}
                    {profile.player.isOwn && (
                      <span className="ml-3 text-sm font-normal text-zinc-400">
                        (Te)
                      </span>
                    )}
                  </h1>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Regisztráció:{" "}
                      {new Date(profile.player.memberSince).toLocaleDateString(
                        "hu-HU"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statisztikák */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-zinc-400">Győzelmek</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {profile.statistics.wonBattles}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-zinc-400">Vereségek</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {profile.statistics.lostBattles}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-zinc-400">Győzelmi arány</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {profile.statistics.winRate}%
                </p>
              </CardContent>
            </Card>

            <Card className="border border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Swords className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-zinc-400">Összes harc</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {profile.statistics.totalBattles}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Kazamata teljesítmények */}
            <Card className="border border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Kazamata Teljesítmények
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(profile.statistics.dungeonTypeWins).map(
                  ([type, wins]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800"
                    >
                      <span className="text-zinc-300">
                        {DUNGEON_TYPE_NAMES[type]}
                      </span>
                      <span className="text-xl font-bold text-white">{wins}</span>
                    </div>
                  )
                )}
                {profile.statistics.favoriteEnvironment && (
                  <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-300">
                        Kedvenc Környezet
                      </span>
                    </div>
                    <p className="text-white font-medium">
                      {profile.statistics.favoriteEnvironment}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Kártya típus eloszlás */}
            <Card className="border border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Swords className="w-5 h-5 text-cyan-400" />
                  Kártya Típus Eloszlás
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(profile.cardTypeDistribution).map(
                  ([type, count]) => {
                    const Icon = CARD_TYPE_ICONS[type as CardType];
                    return (
                      <div
                        key={type}
                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg border ${
                              CARD_TYPE_COLORS[type as CardType]
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-zinc-300">
                            {CARD_TYPE_NAMES[type as CardType]}
                          </span>
                        </div>
                        <span className="text-xl font-bold text-white">
                          {count}
                        </span>
                      </div>
                    );
                  }
                )}
              </CardContent>
            </Card>
          </div>

          {/* Legmagasabb szintű kártyák */}
          <Card className="border border-zinc-800 bg-zinc-900/50 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Legmagasabb Szintű Kártyák
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {profile.topCards.map((card, index) => {
                  const Icon = CARD_TYPE_ICONS[card.type];
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-1">
                            {card.name}
                          </h4>
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs border ${
                              CARD_TYPE_COLORS[card.type]
                            }`}
                          >
                            <Icon className="w-3 h-3" />
                            {CARD_TYPE_NAMES[card.type]}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-zinc-400">Erő</div>
                          <div className="text-xl font-bold text-white">
                            {card.totalPower}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 rounded bg-zinc-900/50">
                          <div className="flex items-center gap-1 mb-1">
                            <Swords className="w-3 h-3 text-red-400" />
                            <span className="text-xs text-zinc-400">Sebzés</span>
                          </div>
                          <p className="text-sm text-white">
                            {card.totalDamage}
                            {card.damageBoost > 0 && (
                              <span className="text-green-400 text-xs ml-1">
                                (+{card.damageBoost})
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="p-2 rounded bg-zinc-900/50">
                          <div className="flex items-center gap-1 mb-1">
                            <Heart className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-zinc-400">Életerő</span>
                          </div>
                          <p className="text-sm text-white">
                            {card.totalHealth}
                            {card.healthBoost > 0 && (
                              <span className="text-green-400 text-xs ml-1">
                                (+{card.healthBoost})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {profile.topCards.length === 0 && (
                <p className="text-center text-zinc-400 py-8">
                  Még nincs kártya a gyűjteményben
                </p>
              )}
            </CardContent>
          </Card>

          {/* Legutóbbi harcok */}
          <Card className="border border-zinc-800 bg-zinc-900/50 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Legutóbbi Harcok
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.recentBattles.map((battle, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-zinc-950/50 border border-zinc-800"
                  >
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">
                        {battle.dungeonName}
                      </h4>
                      <p className="text-sm text-zinc-400">
                        {DUNGEON_TYPE_NAMES[battle.dungeonType]}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium mb-1 ${
                          battle.status === "WON"
                            ? "bg-green-500/10 text-green-400"
                            : battle.status === "LOST"
                            ? "bg-red-500/10 text-red-400"
                            : battle.status === "DRAW"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {BATTLE_STATUS_NAMES[battle.status]}
                      </div>
                      <p className="text-xs text-zinc-500">
                        {new Date(battle.date).toLocaleDateString("hu-HU")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {profile.recentBattles.length === 0 && (
                <p className="text-center text-zinc-400 py-8">
                  Még nincs harc történet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
