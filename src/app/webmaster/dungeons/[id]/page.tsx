"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import { ArrowLeft, Save, Castle, Swords, Sparkles, Crown } from "lucide-react";

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
    iconComponent: Swords,
    simple: 1,
    leader: 0,
    reward: "+1 sebzés",
    color: "border-green-500/30 bg-green-500/10",
    textColor: "text-green-400",
  },
  SMALL_DUNGEON: {
    label: "Kis kazamata",
    iconComponent: Sparkles,
    simple: 3,
    leader: 1,
    reward: "+2 életerő",
    color: "border-blue-500/30 bg-blue-500/10",
    textColor: "text-blue-400",
  },
  LARGE_DUNGEON: {
    label: "Nagy kazamata",
    iconComponent: Crown,
    simple: 5,
    leader: 1,
    reward: "+3 sebzés",
    color: "border-purple-500/30 bg-purple-500/10",
    textColor: "text-purple-400",
  },
};

export default function EditDungeonPage() {
  const router = useRouter();
  const params = useParams();
  const dungeonId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [worldCards, setWorldCards] = useState<WorldCard[]>([]);
  const [leaderCards, setLeaderCards] = useState<LeaderCard[]>([]);

  const [name, setName] = useState("");
  const [type, setType] = useState<keyof typeof DUNGEON_TYPES>("SIMPLE_ENCOUNTER");
  const [environmentId, setEnvironmentId] = useState("");
  const [cardSlots, setCardSlots] = useState<CardSlot[]>([]);
  const [order, setOrder] = useState<number>(1);
  const [requiredWins, setRequiredWins] = useState<number>(0);

  // Kazamata betöltése
  useEffect(() => {
    const fetchDungeon = async () => {
      try {
        const res = await fetch(`/api/webmaster/dungeons/${dungeonId}`);
        if (!res.ok) throw new Error("Kazamata nem található");
        
        const dungeon = await res.json();
        
        setName(dungeon.name);
        setType(dungeon.type);
        setEnvironmentId(dungeon.environmentId || "");
        setOrder(dungeon.order || 1);
        setRequiredWins(dungeon.requiredWins || 0);
        
        // Kártyák beállítása
        const slots = dungeon.dungeonCards
          .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
          .map((dc: {
            id: string;
            isLeader: boolean;
            worldCardId: string | null;
            leaderCardId: string | null;
          }) => ({
            id: dc.id,
            isLeader: dc.isLeader,
            worldCardId: dc.worldCardId || undefined,
            leaderCardId: dc.leaderCardId || undefined,
          }));
        setCardSlots(slots);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dungeon:", err);
        setError("Kazamata betöltése sikertelen");
        setLoading(false);
      }
    };

    fetchDungeon();
  }, [dungeonId]);

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

  // Kártyák betöltése környezet szerint
  useEffect(() => {
    if (!environmentId) {
      setWorldCards([]);
      setLeaderCards([]);
      return;
    }

    const fetchCards = async () => {
      try {
        const res = await fetch(`/api/environments/${environmentId}`);
        const data = await res.json();
        setWorldCards(data.worldCards || []);
        setLeaderCards(data.leaderCards || []);
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    };

    fetchCards();
  }, [environmentId]);

  // Típus változásnál slot-ok újragenerálása
  useEffect(() => {
    if (!environmentId || loading) return;

    const typeInfo = DUNGEON_TYPES[type];
    const newSlots: CardSlot[] = [];

    // Sima kártyák
    for (let i = 0; i < typeInfo.simple; i++) {
      const existingSlot = cardSlots.find((s, idx) => idx === i && !s.isLeader);
      newSlots.push(
        existingSlot || {
          id: `simple-${i}`,
          isLeader: false,
        }
      );
    }

    // Vezér kártyák
    for (let i = 0; i < typeInfo.leader; i++) {
      const existingSlot = cardSlots.find((s) => s.isLeader);
      newSlots.push(
        existingSlot || {
          id: `leader-${i}`,
          isLeader: true,
        }
      );
    }

    setCardSlots(newSlots);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, environmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !environmentId) {
      setError("Kérlek töltsd ki az összes kötelező mezőt!");
      return;
    }

    const allFilled = cardSlots.every((slot) => {
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

    setSaving(true);

    try {
      const res = await fetch(`/api/webmaster/dungeons/${dungeonId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type,
          environmentId,
          cards: cardSlots,
          order,
          requiredWins,
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
      setSaving(false);
    }
  };

  const updateCardSlot = (slotId: string, cardId: string) => {
    setCardSlots((prev) =>
      prev.map((slot) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-zinc-400 text-center">Betöltés...</p>
        </div>
      </div>
    );
  }

  const typeInfo = DUNGEON_TYPES[type];
  const IconComponent = typeInfo.iconComponent;

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/webmaster/dungeons">
            <Button variant="outline" size="icon" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <Castle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Kazamata szerkesztése
              </h1>
              <p className="text-zinc-400 mt-1">
                {name || "Kazamata"} módosítása
              </p>
            </div>
          </div>
        </div>

        {success && (
          <Card className="mb-6 border border-green-500/30 bg-green-500/10">
            <CardContent className="pt-6">
              <p className="text-green-400 font-semibold text-center">
                ✅ Kazamata sikeresen frissítve! Átirányítás...
              </p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-6 border border-red-500/30 bg-red-500/10">
            <CardContent className="pt-6">
              <p className="text-red-400 font-semibold">⚠️ {error}</p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="border border-zinc-800 bg-zinc-900 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Castle className="w-5 h-5 text-red-500" />
                Alapinformációk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Field>
                <FieldLabel htmlFor="name" className="text-zinc-200">
                  Kazamata neve *
                </FieldLabel>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="pl. A mélység királynője"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="environment" className="text-zinc-200">
                  Környezet *
                </FieldLabel>
                <select
                  id="environment"
                  value={environmentId}
                  onChange={(e) => setEnvironmentId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Válassz környezetet...</option>
                  {environments.map((env) => (
                    <option key={env.id} value={env.id}>
                      {env.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel className="text-zinc-200 mb-3 block">Kazamata típusa *</FieldLabel>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(DUNGEON_TYPES).map(([key, info]) => {
                    const TypeIcon = info.iconComponent;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setType(key as keyof typeof DUNGEON_TYPES)}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          type === key
                            ? info.color + " border-opacity-100"
                            : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                        }`}
                      >
                        <TypeIcon className={`w-8 h-8 mx-auto mb-2 ${type === key ? info.textColor : "text-zinc-500"}`} />
                        <div className={`font-semibold text-sm ${type === key ? "text-white" : "text-zinc-400"}`}>
                          {info.label}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          {info.simple} sima + {info.leader} vezér
                        </div>
                        <div className={`text-xs font-semibold mt-2 ${type === key ? info.textColor : "text-zinc-600"}`}>
                          {info.reward}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <div className="grid md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="order" className="text-zinc-200">
                    Sorrend (progresszió) *
                  </FieldLabel>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    placeholder="1"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-zinc-500 mt-1">Kisebb sorrend = korábban elérhető</p>
                </Field>

                <Field>
                  <FieldLabel htmlFor="requiredWins" className="text-zinc-200">
                    Szükséges győzelmek *
                  </FieldLabel>
                  <Input
                    id="requiredWins"
                    type="number"
                    min="0"
                    value={requiredWins}
                    onChange={(e) => setRequiredWins(Number(e.target.value))}
                    placeholder="0"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Hány győzelem kell a feloldáshoz (0 = azonnal elérhető)
                  </p>
                </Field>
              </div>
            </CardContent>
          </Card>

          {environmentId && cardSlots.length > 0 && (
            <Card className="border border-zinc-800 bg-zinc-900 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <IconComponent className={`w-5 h-5 ${typeInfo.textColor}`} />
                  Kártyák ({typeInfo.simple} sima + {typeInfo.leader} vezér)
                </CardTitle>
                <p className="text-sm text-zinc-400 mt-2">
                  Válaszd ki a kártyákat sorrendben.{" "}
                  {typeInfo.leader > 0 && "Az utolsó kártyának vezérnek kell lennie."}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {cardSlots.map((slot, index) => (
                  <div key={slot.id} className="flex items-center gap-3 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400 font-bold text-sm">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <select
                        value={slot.isLeader ? slot.leaderCardId || "" : slot.worldCardId || ""}
                        onChange={(e) => updateCardSlot(slot.id, e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                        required
                      >
                        <option value="">
                          {slot.isLeader ? "Válassz vezérkártyát..." : "Válassz sima kártyát..."}
                        </option>
                        {slot.isLeader
                          ? leaderCards.map((card) => (
                              <option key={card.id} value={card.id}>
                                👑 {card.name} (⚔️{card.baseCard.damage * (card.boostType === "DAMAGE_DOUBLE" ? 2 : 1)}{" "}
                                ❤️{card.baseCard.health * (card.boostType === "HEALTH_DOUBLE" ? 2 : 1)} {card.baseCard.type})
                              </option>
                            ))
                          : worldCards.map((card) => (
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

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={saving || !environmentId || cardSlots.length === 0}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {saving ? (
                <>Mentés...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Változások mentése
                </>
              )}
            </Button>
            <Link href="/webmaster/dungeons" className="flex-1">
              <Button type="button" variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Mégse
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
