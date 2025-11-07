"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

interface Environment {
  id: string;
  name: string;
}

interface WorldCard {
  id: string;
  name: string;
  damage: number;
  health: number;
  type: string;
}

interface LeaderCard {
  id: string;
  name: string;
  boostType: string;
  baseCard: WorldCard;
}

interface CardSlot {
  id: string;
  isLeader: boolean;
  worldCardId?: string;
  leaderCardId?: string;
}

const DUNGEON_TYPES = {
  SIMPLE_ENCOUNTER: {
    label: "Egyszerű találkozás",
    icon: "⚔️",
    simple: 1,
    leader: 0,
    reward: "+1 sebzés",
    color: "text-green-400 border-green-400/30 bg-green-900/10",
  },
  SMALL_DUNGEON: {
    label: "Kis kazamata",
    icon: "🏛️",
    simple: 3,
    leader: 1,
    reward: "+2 életerő",
    color: "text-blue-400 border-blue-400/30 bg-blue-900/10",
  },
  LARGE_DUNGEON: {
    label: "Nagy kazamata",
    icon: "🏰",
    simple: 5,
    leader: 1,
    reward: "+3 sebzés",
    color: "text-purple-400 border-purple-400/30 bg-purple-900/10",
  },
};

export default function CreateDungeonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [worldCards, setWorldCards] = useState<WorldCard[]>([]);
  const [leaderCards, setLeaderCards] = useState<LeaderCard[]>([]);

  const [name, setName] = useState("");
  const [type, setType] = useState<keyof typeof DUNGEON_TYPES>("SIMPLE_ENCOUNTER");
  const [environmentId, setEnvironmentId] = useState("");
  const [cardSlots, setCardSlots] = useState<CardSlot[]>([]);

  // Környezetek betöltése
  useEffect(() => {
    const fetchEnvironments = async () => {
      try {
        const res = await fetch("/api/webmaster/environments");
        const data = await res.json();
        setEnvironments(data);
      } catch (err) {
        console.error("Error fetching environments:", err);
      }
    };
    fetchEnvironments();
  }, []);

  // Amikor környezet vagy típus változik, frissítjük a kártyákat és slotokat
  useEffect(() => {
    if (!environmentId) {
      setWorldCards([]);
      setLeaderCards([]);
      return;
    }

    const fetchCards = async () => {
      try {
        const [worldRes, leaderRes] = await Promise.all([
          fetch(`/api/webmaster/world-cards?environmentId=${environmentId}`),
          fetch(`/api/webmaster/leader-cards?environmentId=${environmentId}`),
        ]);

        const worldData = await worldRes.json();
        const leaderData = await leaderRes.json();

        setWorldCards(worldData);
        setLeaderCards(leaderData);
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    };

    fetchCards();
  }, [environmentId]);

  // Amikor típus változik, inicializáljuk a slotokat
  useEffect(() => {
    const typeInfo = DUNGEON_TYPES[type];
    
    const newSlots: CardSlot[] = [];
    
    // Sima kártyák slotjai
    for (let i = 0; i < typeInfo.simple; i++) {
      newSlots.push({
        id: `slot-${i}`,
        isLeader: false,
      });
    }
    
    // Vezér kártyák slotjai
    for (let i = 0; i < typeInfo.leader; i++) {
      newSlots.push({
        id: `slot-${typeInfo.simple + i}`,
        isLeader: true,
      });
    }
    
    setCardSlots(newSlots);
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validáció
    if (!name || !environmentId) {
      setError("Kérlek töltsd ki az összes kötelező mezőt!");
      return;
    }

    // Ellenőrizzük, hogy minden slotban van kártya
    const allFilled = cardSlots.every(slot => {
      if (slot.isLeader) {
        return !!slot.leaderCardId;
      } else {
        return !!slot.worldCardId;
      }
    });

    if (!allFilled) {
      setError("Minden kártyahelyet ki kell tölteni!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/webmaster/dungeons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type,
          environmentId,
          cards: cardSlots,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Hiba történt");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/webmaster/dungeons");
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ismeretlen hiba történt");
    } finally {
      setLoading(false);
    }
  };

  const updateCardSlot = (slotId: string, cardId: string) => {
    setCardSlots(prev =>
      prev.map(slot => {
        if (slot.id === slotId) {
          if (slot.isLeader) {
            return { ...slot, leaderCardId: cardId };
          } else {
            return { ...slot, worldCardId: cardId };
          }
        }
        return slot;
      })
    );
  };

  const typeInfo = DUNGEON_TYPES[type];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/webmaster/dungeons">
            <Button variant="outline" size="icon" className="border-red-400/40 text-red-200">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-200 via-orange-200 to-red-200 bg-clip-text text-transparent">
              🏰 Új Kazamata
            </h1>
            <p className="text-zinc-400 mt-2">
              Hozz létre új kihívást a játékosok számára
            </p>
          </div>
        </div>

        {success && (
          <Card className="mb-6 border-2 border-green-400/30 bg-green-900/10">
            <CardContent className="pt-6">
              <p className="text-green-300 font-semibold text-center">
                ✅ Kazamata sikeresen létrehozva! Átirányítás...
              </p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-6 border-2 border-red-400/30 bg-red-900/10">
            <CardContent className="pt-6">
              <p className="text-red-300 font-semibold">⚠️ {error}</p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="border-2 border-red-400/30 bg-zinc-900/50 backdrop-blur-xl mb-6">
            <CardHeader>
              <CardTitle className="text-red-200">Alapinformációk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-zinc-200">
                  Kazamata neve *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="pl. A mélység királynője"
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100"
                  required
                />
              </div>

              <div>
                <Label htmlFor="environment" className="text-zinc-200">
                  Környezet *
                </Label>
                <select
                  id="environment"
                  value={environmentId}
                  onChange={(e) => setEnvironmentId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100"
                  required
                >
                  <option value="">Válassz környezetet...</option>
                  {environments.map((env) => (
                    <option key={env.id} value={env.id}>
                      {env.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-zinc-200 mb-3 block">Kazamata típusa *</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(DUNGEON_TYPES).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setType(key as keyof typeof DUNGEON_TYPES)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        type === key
                          ? info.color + " border-opacity-100"
                          : "border-zinc-700 bg-zinc-800/30 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="text-2xl mb-2">{info.icon}</div>
                      <div className="font-semibold text-sm text-zinc-200">{info.label}</div>
                      <div className="text-xs text-zinc-400 mt-1">
                        {info.simple} sima + {info.leader} vezér
                      </div>
                      <div className="text-xs font-semibold mt-2" style={{ color: "inherit" }}>
                        {info.reward}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {environmentId && cardSlots.length > 0 && (
            <Card className="border-2 border-purple-400/30 bg-zinc-900/50 backdrop-blur-xl mb-6">
              <CardHeader>
                <CardTitle className="text-purple-200">
                  Kártyák ({typeInfo.simple} sima + {typeInfo.leader} vezér)
                </CardTitle>
                <p className="text-sm text-zinc-400 mt-2">
                  Válaszd ki a kártyákat sorrendben. {typeInfo.leader > 0 && "Az utolsó kártyának vezérnek kell lennie."}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {cardSlots.map((slot, index) => (
                  <div key={slot.id} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 font-bold">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <Label className="text-zinc-300 text-xs mb-1 block">
                        {slot.isLeader ? "🎖️ Vezérkártya" : "📄 Sima kártya"}
                      </Label>
                      <select
                        value={slot.isLeader ? slot.leaderCardId || "" : slot.worldCardId || ""}
                        onChange={(e) => updateCardSlot(slot.id, e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 text-sm"
                        required
                      >
                        <option value="">Válassz kártyát...</option>
                        {slot.isLeader
                          ? leaderCards.map((card) => (
                              <option key={card.id} value={card.id}>
                                {card.name} (alap: {card.baseCard.name}, {card.boostType === "DAMAGE_DOUBLE" ? "2x sebzés" : "2x életerő"})
                              </option>
                            ))
                          : worldCards
                              .filter(card => !cardSlots.some(s => !s.isLeader && s.worldCardId === card.id && s.id !== slot.id))
                              .map((card) => (
                              <option key={card.id} value={card.id}>
                                {card.name} (⚔️{card.damage} ❤️{card.health} {card.type})
                              </option>
                            ))}
                      </select>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading || !environmentId || cardSlots.length === 0}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {loading ? (
                <>Létrehozás...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Kazamata létrehozása
                </>
              )}
            </Button>
            <Link href="/webmaster/dungeons" className="flex-1">
              <Button type="button" variant="outline" className="w-full border-zinc-700 text-zinc-300">
                Mégse
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
