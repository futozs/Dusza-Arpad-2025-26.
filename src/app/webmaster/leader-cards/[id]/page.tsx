"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import { ArrowLeft, Save, Crown, Sword, Heart, Zap } from "lucide-react";

type WorldCard = {
  id: string;
  name: string;
  damage: number;
  health: number;
  type: string;
  environmentId: string;
};

type Environment = {
  id: string;
  name: string;
};

type LeaderCard = {
  id: string;
  name: string;
  boostType: "DAMAGE_DOUBLE" | "HEALTH_DOUBLE";
  baseCardId: string;
  environmentId: string;
  baseCard: WorldCard;
  environment: Environment;
};

export default function EditLeaderCardPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [worldCards, setWorldCards] = useState<WorldCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<WorldCard[]>([]);
  const [leaderCard, setLeaderCard] = useState<LeaderCard | null>(null);
  const [cardId, setCardId] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    baseCardId: "",
    boostType: "DAMAGE_DOUBLE" as "DAMAGE_DOUBLE" | "HEALTH_DOUBLE",
    environmentId: "",
  });

  useEffect(() => {
    params.then(({ id }) => {
      setCardId(id);
      Promise.all([
        fetch("/api/webmaster/environments").then((res) => res.json()),
        fetch("/api/webmaster/world-cards").then((res) => res.json()),
        fetch(`/api/webmaster/leader-cards/${id}`).then((res) => res.json()),
      ]).then(([envs, cards, leader]) => {
        setEnvironments(envs);
        setWorldCards(cards);
        setLeaderCard(leader);
        
        setFormData({
          name: leader.name,
          baseCardId: leader.baseCardId,
          boostType: leader.boostType,
          environmentId: leader.environmentId,
        });
        
        setLoading(false);
      }).catch(() => {
        setError("Hiba történt az adatok betöltése során");
        setLoading(false);
      });
    });
  }, [params]);

  useEffect(() => {
    if (formData.environmentId) {
      const filtered = worldCards.filter((card) => card.environmentId === formData.environmentId);
      setFilteredCards(filtered);
    }
  }, [formData.environmentId, worldCards]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/webmaster/leader-cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Hiba történt");
      }

      router.push("/webmaster/leader-cards");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ismeretlen hiba történt");
    } finally {
      setSaving(false);
    }
  };

  const selectedCard = worldCards.find((c) => c.id === formData.baseCardId);
  const previewDamage = selectedCard ? (formData.boostType === "DAMAGE_DOUBLE" ? selectedCard.damage * 2 : selectedCard.damage) : 0;
  const previewHealth = selectedCard ? (formData.boostType === "HEALTH_DOUBLE" ? selectedCard.health * 2 : selectedCard.health) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Betöltés...</div>
      </div>
    );
  }

  if (!leaderCard) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-400">Vezérkártya nem található</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/webmaster/leader-cards">
            <Button variant="outline" size="icon" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <Crown className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Vezérkártya szerkesztése
              </h1>
              <p className="text-zinc-400 mt-1">
                {leaderCard.name} módosítása
              </p>
            </div>
          </div>
        </div>

        <Card className="border border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Vezérkártya adatai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="environmentId" className="text-zinc-200">
                  Játékkörnyezet *
                </FieldLabel>
                <select
                  id="environmentId"
                  value={formData.environmentId}
                  onChange={(e) => setFormData({ ...formData, environmentId: e.target.value, baseCardId: "" })}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                  {environments.map((env) => (
                    <option key={env.id} value={env.id}>
                      {env.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="baseCardId" className="text-zinc-200">
                  Alapkártya *
                </FieldLabel>
                <select
                  id="baseCardId"
                  value={formData.baseCardId}
                  onChange={(e) => setFormData({ ...formData, baseCardId: e.target.value })}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                  {filteredCards.length === 0 && (
                    <option value="">Nincs elérhető kártya</option>
                  )}
                  {filteredCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.name} (⚔️{card.damage} / ❤️{card.health})
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="name" className="text-zinc-200">
                  Vezérkártya neve *
                </FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="pl. Darth Aragorn"
                  required
                  maxLength={20}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-amber-500 focus:border-transparent"
                />
              </Field>

              <Field>
                <FieldLabel className="text-zinc-200">Erősítés típusa *</FieldLabel>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, boostType: "DAMAGE_DOUBLE" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.boostType === "DAMAGE_DOUBLE"
                        ? "border-red-500 bg-red-500/10"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <Sword className={`w-8 h-8 mx-auto mb-2 ${
                      formData.boostType === "DAMAGE_DOUBLE" ? "text-red-500" : "text-zinc-500"
                    }`} />
                    <span className={`font-semibold block ${
                      formData.boostType === "DAMAGE_DOUBLE" ? "text-red-400" : "text-zinc-400"
                    }`}>
                      Sebzés duplázás
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, boostType: "HEALTH_DOUBLE" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.boostType === "HEALTH_DOUBLE"
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <Heart className={`w-8 h-8 mx-auto mb-2 ${
                      formData.boostType === "HEALTH_DOUBLE" ? "text-green-500" : "text-zinc-500"
                    }`} />
                    <span className={`font-semibold block ${
                      formData.boostType === "HEALTH_DOUBLE" ? "text-green-400" : "text-zinc-400"
                    }`}>
                      Életerő duplázás
                    </span>
                  </button>
                </div>
              </Field>

              {selectedCard && (
                <Card className="border-2 border-amber-500/30 bg-amber-500/5">
                  <CardHeader>
                    <CardTitle className="text-amber-400 text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Előnézet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-lg">
                        <p className="text-xs text-zinc-400 mb-2">Eredeti</p>
                        <div className="space-y-1">
                          <p className="text-sm text-zinc-300 flex items-center gap-2">
                            <Sword className="w-4 h-4 text-red-400" />
                            <span>{selectedCard.damage}</span>
                          </p>
                          <p className="text-sm text-zinc-300 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-green-400" />
                            <span>{selectedCard.health}</span>
                          </p>
                        </div>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
                        <p className="text-xs text-amber-400 mb-2 font-semibold">Vezérkártya</p>
                        <div className="space-y-1">
                          <p className="text-sm text-white font-bold flex items-center gap-2">
                            <Sword className="w-4 h-4 text-red-500" />
                            <span>{previewDamage}</span>
                          </p>
                          <p className="text-sm text-white font-bold flex items-center gap-2">
                            <Heart className="w-4 h-4 text-green-500" />
                            <span>{previewHealth}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={saving || filteredCards.length === 0}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Mentés..." : "Módosítások mentése"}
                </Button>
                <Link href="/webmaster/leader-cards" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Mégse
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
