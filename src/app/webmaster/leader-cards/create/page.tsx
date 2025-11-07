"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

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

export default function CreateLeaderCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [worldCards, setWorldCards] = useState<WorldCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<WorldCard[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    baseCardId: "",
    boostType: "DAMAGE_DOUBLE" as "DAMAGE_DOUBLE" | "HEALTH_DOUBLE",
    environmentId: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/webmaster/environments").then((res) => res.json()),
      fetch("/api/webmaster/world-cards").then((res) => res.json()),
    ]).then(([envs, cards]) => {
      setEnvironments(envs);
      setWorldCards(cards);
      if (envs.length > 0) {
        setFormData((prev) => ({ ...prev, environmentId: envs[0].id }));
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (formData.environmentId) {
      const filtered = worldCards.filter((card) => card.environmentId === formData.environmentId);
      setFilteredCards(filtered);
      if (filtered.length > 0 && !formData.baseCardId) {
        setFormData((prev) => ({ ...prev, baseCardId: filtered[0].id }));
      }
    }
  }, [formData.environmentId, worldCards, formData.baseCardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/webmaster/leader-cards", {
        method: "POST",
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
      setLoading(false);
    }
  };

  const selectedCard = worldCards.find((c) => c.id === formData.baseCardId);
  const previewDamage = selectedCard ? (formData.boostType === "DAMAGE_DOUBLE" ? selectedCard.damage * 2 : selectedCard.damage) : 0;
  const previewHealth = selectedCard ? (formData.boostType === "HEALTH_DOUBLE" ? selectedCard.health * 2 : selectedCard.health) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-zinc-950 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/webmaster/leader-cards">
            <Button variant="outline" size="icon" className="border-red-400/40 text-red-200">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-200 via-orange-200 to-red-200 bg-clip-text text-transparent">
              Új vezérkártya
            </h1>
            <p className="text-zinc-400 mt-2">Származtass vezérkártyát egy világkártyából</p>
          </div>
        </div>

        <Card className="border-2 border-orange-400/30 bg-zinc-900/70">
          <CardHeader>
            <CardTitle className="text-orange-200">👑 Vezérkártya adatai</CardTitle>
            <CardDescription className="text-zinc-400">
              A vezérkártya egy világkártya duplázott tulajdonsággal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
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
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </Field>

              <Field>
                <FieldLabel className="text-zinc-200">Erősítés típusa *</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, boostType: "DAMAGE_DOUBLE" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.boostType === "DAMAGE_DOUBLE"
                        ? "border-red-400 bg-red-900/30"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <span className="text-2xl mb-2 block">🗡️</span>
                    <span className="text-zinc-100 font-semibold">Sebzés duplázás</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, boostType: "HEALTH_DOUBLE" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.boostType === "HEALTH_DOUBLE"
                        ? "border-green-400 bg-green-900/30"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <span className="text-2xl mb-2 block">💪</span>
                    <span className="text-zinc-100 font-semibold">Életerő duplázás</span>
                  </button>
                </div>
              </Field>

              {selectedCard && (
                <Card className="border-2 border-amber-400/30 bg-amber-900/10">
                  <CardHeader>
                    <CardTitle className="text-amber-200 text-lg">📊 Előnézet</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-zinc-900/50 p-3 rounded">
                        <p className="text-xs text-zinc-400">Eredeti</p>
                        <p className="text-sm text-zinc-300">
                          ⚔️ {selectedCard.damage} / ❤️ {selectedCard.health}
                        </p>
                      </div>
                      <div className="bg-orange-900/30 p-3 rounded">
                        <p className="text-xs text-zinc-400">Vezér</p>
                        <p className="text-sm text-orange-200 font-bold">
                          ⚔️ {previewDamage} / ❤️ {previewHealth}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading || filteredCards.length === 0}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Létrehozás..." : "Vezérkártya létrehozása"}
                </Button>
                <Link href="/webmaster/leader-cards" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-zinc-600 text-zinc-300"
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
