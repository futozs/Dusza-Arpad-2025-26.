"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Sword, Heart, Globe } from "lucide-react";

type Environment = {
  id: string;
  name: string;
};

type CardType = "EARTH" | "AIR" | "WATER" | "FIRE";

type WorldCard = {
  id: string;
  name: string;
  damage: number;
  health: number;
  type: CardType;
  order: number;
  environmentId: string;
};

export default function EditWorldCardPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<WorldCard | null>(null);

  useEffect(() => {
    // Környezetek betöltése
    fetch("/api/webmaster/environments")
      .then((res) => res.json())
      .then((data) => setEnvironments(data))
      .catch(console.error);

    // Kártya adatainak betöltése
    fetch(`/api/webmaster/world-cards/${cardId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Nem található a kártya");
        return res.json();
      })
      .then((data) => {
        setFormData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [cardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/webmaster/world-cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Hiba történt");
      }

      router.push("/webmaster/world-cards");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ismeretlen hiba történt");
    } finally {
      setSaving(false);
    }
  };

  const cardTypes: { value: CardType; label: string; icon: string }[] = [
    { value: "EARTH", label: "Föld", icon: "🌍" },
    { value: "AIR", label: "Levegő", icon: "💨" },
    { value: "WATER", label: "Víz", icon: "💧" },
    { value: "FIRE", label: "Tűz", icon: "🔥" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-zinc-400 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Betöltés...</p>
        </div>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border border-red-500/30 bg-zinc-900">
            <CardContent className="p-8 text-center">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <Link href="/webmaster/world-cards">
                <Button className="bg-zinc-700 hover:bg-zinc-600">
                  Vissza a kártyákhoz
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/webmaster/world-cards">
            <Button variant="outline" size="icon" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <Globe className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Világkártya szerkesztése
              </h1>
              <p className="text-zinc-400 mt-1">
                {formData.name} módosítása
              </p>
            </div>
          </div>
        </div>

        <Card className="border border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Kártya adatai
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
                  onChange={(e) => setFormData({ ...formData, environmentId: e.target.value })}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {environments.map((env) => (
                    <option key={env.id} value={env.id}>
                      {env.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="name" className="text-zinc-200">
                  Kártya neve *
                </FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="pl. Aragorn"
                  required
                  maxLength={16}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-zinc-500 mt-1">Maximum 16 karakter</p>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="damage" className="text-zinc-200 flex items-center gap-2">
                    <Sword className="w-4 h-4 text-red-400" />
                    Sebzés érték *
                  </FieldLabel>
                  <Input
                    id="damage"
                    type="number"
                    min={2}
                    max={100}
                    value={formData.damage}
                    onChange={(e) => setFormData({ ...formData, damage: parseInt(e.target.value) })}
                    required
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Min: 2, Max: 100</p>
                </Field>

                <Field>
                  <FieldLabel htmlFor="health" className="text-zinc-200 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-green-400" />
                    Életerő *
                  </FieldLabel>
                  <Input
                    id="health"
                    type="number"
                    min={1}
                    max={100}
                    value={formData.health}
                    onChange={(e) => setFormData({ ...formData, health: parseInt(e.target.value) })}
                    required
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Min: 1, Max: 100</p>
                </Field>
              </div>

              <Field>
                <FieldLabel className="text-zinc-200">Kártya típusa *</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  {cardTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.type === type.value
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{type.icon}</span>
                      <span className={`font-semibold ${formData.type === type.value ? "text-purple-400" : "text-zinc-400"}`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="order" className="text-zinc-200">
                  Sorrend *
                </FieldLabel>
                <Input
                  id="order"
                  type="number"
                  min={1}
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  required
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  A kártyák sorrendje a világkártyák között
                </p>
              </Field>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mentés...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Változások mentése
                    </>
                  )}
                </Button>
                <Link href="/webmaster/world-cards" className="flex-1">
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
